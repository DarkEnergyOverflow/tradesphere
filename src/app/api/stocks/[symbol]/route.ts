import { NextResponse } from 'next/server';
import { marketService } from '@/services/marketService';

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = params.symbol;
    const quote = await marketService.getStockQuote(symbol);
    const timeSeries = await marketService.getTimeSeries(symbol, '1mo', '1d');

    return NextResponse.json({
      quote,
      timeSeries,
    });
  } catch (error) {
    console.error('Error fetching stock details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock details' },
      { status: 500 }
    );
  }
}
