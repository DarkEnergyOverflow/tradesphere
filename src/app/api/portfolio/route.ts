import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { tradingService } from '@/services/tradingService';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    const portfolio = await tradingService.getPortfolio(session.user.id);

    const totalInvested = portfolio.reduce((sum, item) => sum + item.investedValue, 0);
    const totalCurrent = portfolio.reduce((sum, item) => sum + item.currentValue, 0);
    const totalProfitLoss = totalCurrent - totalInvested;
    const totalProfitLossPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

    return NextResponse.json({
      balance: user?.balance || 0,
      portfolio,
      summary: {
        totalInvested,
        totalCurrent,
        totalProfitLoss,
        totalProfitLossPercent,
        totalValue: (user?.balance || 0) + totalCurrent,
      },
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}
