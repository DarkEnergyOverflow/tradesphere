import { NextResponse } from 'next/server';
import { marketService } from '@/services/marketService';

export async function GET() {
  try {
    const popularStocks = marketService.getPopularStocks();
    
    const stocksWithPrices = await Promise.allSettled(
      popularStocks.map(async (symbol) => {
        try {
          const quote = await marketService.getStockQuote(symbol);
          return quote;
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error);
          return null;
        }
      })
    );

    const validStocks = stocksWithPrices
      .filter((result) => result.status === 'fulfilled' && result.value !== null)
      .map((result) => (result as PromiseFulfilledResult<any>).value);

    return NextResponse.json({ stocks: validStocks });
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stocks' },
      { status: 500 }
    );
  }
}
