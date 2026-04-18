'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import { createChart, ColorType } from 'lightweight-charts';

interface StockQuote {
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

export default function StockDetail() {
  const params = useParams();
  const router = useRouter();
  const symbol = params.symbol as string;
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [trading, setTrading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStockData();
  }, [symbol]);

  const fetchStockData = async () => {
    try {
      const response = await fetch(`/api/stocks/${symbol}`);
      const data = await response.json();
      setQuote(data.quote);

      if (chartContainerRef.current && data.timeSeries && data.timeSeries.length > 0) {
        const chart = createChart(chartContainerRef.current, {
          layout: {
            background: { type: ColorType.Solid, color: '#ffffff' },
            textColor: '#6b7280',
          },
          grid: {
            vertLines: { color: '#f3f4f6' },
            horzLines: { color: '#f3f4f6' },
          },
          width: chartContainerRef.current.clientWidth,
          height: 400,
        });

        const lineSeries = chart.addLineSeries({
          color: '#2563eb',
          lineWidth: 2,
        });

        const chartData = data.timeSeries
          .map((item: any) => ({
            time: new Date(item.date).toISOString().split('T')[0],
            value: item.close,
          }))
          .filter((item: any) => item.value > 0);

        lineSeries.setData(chartData);

        chart.timeScale().fitContent();

        return () => {
          chart.remove();
        };
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrade = async (type: 'buy' | 'sell') => {
    setTrading(true);
    setMessage('');

    try {
      const response = await fetch(`/api/trade/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, quantity }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Successfully ${type === 'buy' ? 'bought' : 'sold'} ${quantity} shares!`);
        setTimeout(() => router.push('/portfolio'), 1500);
      } else {
        setMessage(data.error || `Failed to ${type} stock`);
      }
    } catch (error) {
      setMessage(`Error ${type}ing stock`);
    } finally {
      setTrading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Sidebar />
        <TopNav />
        <div className="ml-64 pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-xl text-gray-900">Loading...</div>
        </div>
      </>
    );
  }

  if (!quote) {
    return (
      <>
        <Sidebar />
        <TopNav />
        <div className="ml-64 pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-xl text-gray-900">Stock not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <TopNav />
      <div className="ml-64 pt-20 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Stock Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-blue-600 text-3xl">show_chart</span>
                  <h1 className="text-3xl font-bold text-gray-900">{quote.symbol}</h1>
                </div>
                <p className="text-gray-600 text-lg">{quote.name}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-gray-900">₹{quote.price.toFixed(2)}</div>
                <div
                  className={`text-lg font-medium flex items-center justify-end gap-1 mt-1 ${
                    quote.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {quote.change >= 0 ? 'arrow_upward' : 'arrow_downward'}
                  </span>
                  {quote.change >= 0 ? '+' : ''}
                  {quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-xs text-gray-600 mb-1 uppercase tracking-wider font-medium">Open</div>
                <div className="text-lg font-bold text-gray-900">₹{quote.open.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1 uppercase tracking-wider font-medium">High</div>
                <div className="text-lg font-bold text-gray-900">₹{quote.high.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1 uppercase tracking-wider font-medium">Low</div>
                <div className="text-lg font-bold text-gray-900">₹{quote.low.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1 uppercase tracking-wider font-medium">Volume</div>
                <div className="text-lg font-bold text-gray-900">{quote.volume.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">candlestick_chart</span>
                Price Chart
              </h2>
              <div ref={chartContainerRef} />
            </div>

            {/* Trading Panel */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">swap_horiz</span>
                Trade
              </h2>

              {message && (
                <div
                  className={`p-3 rounded-lg mb-4 text-sm ${
                    message.includes('Successfully')
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1 uppercase tracking-wider font-medium">Total Amount</div>
                <div className="text-3xl font-bold text-gray-900">
                  ₹{(quote.price * quantity).toFixed(2)}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleTrade('buy')}
                  disabled={trading}
                  className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 font-bold flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                  {trading ? 'Processing...' : 'Buy'}
                </button>
                <button
                  onClick={() => handleTrade('sell')}
                  disabled={trading}
                  className="w-full bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 font-bold flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">sell</span>
                  {trading ? 'Processing...' : 'Sell'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
