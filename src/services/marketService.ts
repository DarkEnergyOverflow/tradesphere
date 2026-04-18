const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';

export interface StockPrice {
  symbol: string;
  price: number;
  change?: number;
  changePercent?: number;
}

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
}

export interface TimeSeriesData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

class MarketService {
  private async fetchFromFinnhub(endpoint: string, params: Record<string, string> = {}) {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('token', FINNHUB_API_KEY!);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getStockPrice(symbol: string): Promise<StockPrice> {
    try {
      const data = await this.fetchFromFinnhub('/quote', { symbol });
      
      if (!data || !data.c) {
        throw new Error('Invalid stock data received');
      }

      return {
        symbol,
        price: data.c,
        change: data.d || 0,
        changePercent: data.dp || 0,
      };
    } catch (error) {
      console.error('Error fetching stock price:', error);
      throw new Error('Failed to fetch stock price');
    }
  }

  async getStockQuote(symbol: string): Promise<StockQuote> {
    try {
      const [quoteData, profileData] = await Promise.all([
        this.fetchFromFinnhub('/quote', { symbol }),
        this.fetchFromFinnhub('/stock/profile2', { symbol }).catch(() => null),
      ]);

      if (!quoteData || !quoteData.c) {
        throw new Error('Invalid stock data received');
      }

      return {
        symbol,
        name: profileData?.name || symbol,
        price: quoteData.c,
        change: quoteData.d || 0,
        changePercent: quoteData.dp || 0,
        high: quoteData.h || quoteData.c,
        low: quoteData.l || quoteData.c,
        open: quoteData.o || quoteData.c,
        previousClose: quoteData.pc || quoteData.c,
        volume: 0,
      };
    } catch (error) {
      console.error(`Error fetching stock quote for ${symbol}:`, error);
      throw new Error('Failed to fetch stock quote');
    }
  }

  async getTimeSeries(symbol: string, period: string = '1mo', interval: string = '1d'): Promise<TimeSeriesData[]> {
    try {
      const to = Math.floor(Date.now() / 1000);
      const from = to - this.getPeriodSeconds(period);

      const data = await this.fetchFromFinnhub('/stock/candle', {
        symbol,
        resolution: 'D',
        from: from.toString(),
        to: to.toString(),
      });

      if (!data || !data.c || data.s === 'no_data') {
        return [];
      }

      const timeSeries: TimeSeriesData[] = [];
      for (let i = 0; i < data.t.length; i++) {
        timeSeries.push({
          date: new Date(data.t[i] * 1000),
          open: data.o[i],
          high: data.h[i],
          low: data.l[i],
          close: data.c[i],
          volume: data.v[i],
        });
      }

      return timeSeries;
    } catch (error) {
      console.error('Error fetching time series:', error);
      return [];
    }
  }

  async searchStocks(query: string): Promise<any[]> {
    try {
      const data = await this.fetchFromFinnhub('/search', { q: query });

      if (!data || !data.result) {
        return [];
      }

      return data.result.slice(0, 10).map((item: any) => ({
        symbol: item.symbol,
        name: item.description,
        type: item.type,
        exchange: item.displaySymbol,
      }));
    } catch (error) {
      console.error('Error searching stocks:', error);
      return [];
    }
  }

  private getPeriodSeconds(period: string): number {
    const periodMap: Record<string, number> = {
      '1d': 86400,
      '5d': 432000,
      '1mo': 2592000,
      '3mo': 7776000,
      '6mo': 15552000,
      '1y': 31536000,
    };
    
    return periodMap[period] || 2592000;
  }

  getPopularStocks(): string[] {
    // Indian stocks (NSE) - Finnhub doesn't support .NS suffix well, using US stocks
    // For Indian market, you'd need a different API like NSE India or Alpha Vantage
    return [
      'AAPL',    // Apple
      'MSFT',    // Microsoft
      'GOOGL',   // Google
      'AMZN',    // Amazon
      'TSLA',    // Tesla
      'META',    // Meta
      'NVDA',    // NVIDIA
      'JPM',     // JPMorgan
      'V',       // Visa
      'WMT',     // Walmart
    ];
  }
  
  getPopularIndianStocks(): string[] {
    // Note: Finnhub has limited support for Indian stocks
    // These symbols may not work with free tier
    return [
      'RELIANCE.NS',
      'TCS.NS',
      'INFY.NS',
      'HDFCBANK.NS',
      'ICICIBANK.NS',
      'SBIN.NS',
      'BHARTIARTL.NS',
      'ITC.NS',
      'HINDUNILVR.NS',
      'LT.NS',
    ];
  }
}

export const marketService = new MarketService();
