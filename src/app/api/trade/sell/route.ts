import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { tradingService } from '@/services/tradingService';
import { z } from 'zod';

const sellSchema = z.object({
  symbol: z.string(),
  quantity: z.number().positive().int(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { symbol, quantity } = sellSchema.parse(body);

    const result = await tradingService.sellStock(session.user.id, symbol, quantity);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error selling stock:', error);
    return NextResponse.json(
      { error: 'Failed to sell stock' },
      { status: 500 }
    );
  }
}
