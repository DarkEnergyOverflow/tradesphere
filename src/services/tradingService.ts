import { prisma } from '@/lib/prisma';
import { marketService } from './marketService';

export interface TradeResult {
  success: boolean;
  message: string;
  balance?: number;
  portfolio?: any;
}

class TradingService {
  async buyStock(userId: string, symbol: string, quantity: number): Promise<TradeResult> {
    try {
      // Fetch current price
      const stockPrice = await marketService.getStockPrice(symbol);
      const totalCost = stockPrice.price * quantity;

      // Get user balance
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return { success: false, message: 'User not found' };
      }

      if (user.balance < totalCost) {
        return { success: false, message: 'Insufficient balance' };
      }

      // Execute transaction
      const result = await prisma.$transaction(async (tx) => {
        // Deduct balance
        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: { balance: user.balance - totalCost },
        });

        // Update or create portfolio entry
        const existingPortfolio = await tx.portfolio.findUnique({
          where: {
            userId_stockSymbol: {
              userId,
              stockSymbol: symbol,
            },
          },
        });

        let portfolio;
        if (existingPortfolio) {
          const newQuantity = existingPortfolio.quantity + quantity;
          const newAvgPrice =
            (existingPortfolio.avgPrice * existingPortfolio.quantity + totalCost) / newQuantity;

          portfolio = await tx.portfolio.update({
            where: { id: existingPortfolio.id },
            data: {
              quantity: newQuantity,
              avgPrice: newAvgPrice,
            },
          });
        } else {
          portfolio = await tx.portfolio.create({
            data: {
              userId,
              stockSymbol: symbol,
              quantity,
              avgPrice: stockPrice.price,
            },
          });
        }

        // Log transaction
        await tx.transaction.create({
          data: {
            userId,
            stockSymbol: symbol,
            type: 'BUY',
            quantity,
            price: stockPrice.price,
          },
        });

        return { updatedUser, portfolio };
      });

      return {
        success: true,
        message: 'Stock purchased successfully',
        balance: result.updatedUser.balance,
        portfolio: result.portfolio,
      };
    } catch (error) {
      console.error('Error buying stock:', error);
      return { success: false, message: 'Failed to purchase stock' };
    }
  }

  async sellStock(userId: string, symbol: string, quantity: number): Promise<TradeResult> {
    try {
      // Fetch current price
      const stockPrice = await marketService.getStockPrice(symbol);
      const totalValue = stockPrice.price * quantity;

      // Check portfolio
      const portfolio = await prisma.portfolio.findUnique({
        where: {
          userId_stockSymbol: {
            userId,
            stockSymbol: symbol,
          },
        },
      });

      if (!portfolio || portfolio.quantity < quantity) {
        return { success: false, message: 'Insufficient stock quantity' };
      }

      // Execute transaction
      const result = await prisma.$transaction(async (tx) => {
        // Add balance
        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: { balance: { increment: totalValue } },
        });

        // Update or remove portfolio entry
        let updatedPortfolio;
        if (portfolio.quantity === quantity) {
          await tx.portfolio.delete({
            where: { id: portfolio.id },
          });
          updatedPortfolio = null;
        } else {
          updatedPortfolio = await tx.portfolio.update({
            where: { id: portfolio.id },
            data: { quantity: portfolio.quantity - quantity },
          });
        }

        // Log transaction
        await tx.transaction.create({
          data: {
            userId,
            stockSymbol: symbol,
            type: 'SELL',
            quantity,
            price: stockPrice.price,
          },
        });

        return { updatedUser, portfolio: updatedPortfolio };
      });

      return {
        success: true,
        message: 'Stock sold successfully',
        balance: result.updatedUser.balance,
        portfolio: result.portfolio,
      };
    } catch (error) {
      console.error('Error selling stock:', error);
      return { success: false, message: 'Failed to sell stock' };
    }
  }

  async getPortfolio(userId: string) {
    const portfolios = await prisma.portfolio.findMany({
      where: { userId },
    });

    const portfolioWithCurrentPrices = await Promise.all(
      portfolios.map(async (item) => {
        try {
          const stockPrice = await marketService.getStockPrice(item.stockSymbol);
          const currentValue = stockPrice.price * item.quantity;
          const investedValue = item.avgPrice * item.quantity;
          const profitLoss = currentValue - investedValue;
          const profitLossPercent = (profitLoss / investedValue) * 100;

          return {
            ...item,
            currentPrice: stockPrice.price,
            currentValue,
            investedValue,
            profitLoss,
            profitLossPercent,
          };
        } catch (error) {
          return {
            ...item,
            currentPrice: item.avgPrice,
            currentValue: item.avgPrice * item.quantity,
            investedValue: item.avgPrice * item.quantity,
            profitLoss: 0,
            profitLossPercent: 0,
          };
        }
      })
    );

    return portfolioWithCurrentPrices;
  }

  async getTransactions(userId: string, limit: number = 50) {
    return prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}

export const tradingService = new TradingService();
