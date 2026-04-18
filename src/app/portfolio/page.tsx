'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import Link from 'next/link';

interface PortfolioItem {
  id: string;
  stockSymbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  currentValue: number;
  investedValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch('/api/portfolio');
      const data = await response.json();
      setPortfolio(data.portfolio);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
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

  return (
    <>
      <Sidebar />
      <TopNav />
      <div className="ml-64 pt-20 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Portfolio</h1>
            <p className="text-gray-600">Track your holdings and performance</p>
          </div>

          {portfolio.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">account_balance_wallet</span>
              <p className="text-gray-600 mb-6 text-lg">You don't have any stocks yet.</p>
              <Link
                href="/stocks"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all font-medium"
              >
                <span className="material-symbols-outlined text-sm">search</span>
                <span>Browse Stocks</span>
              </Link>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="text-sm text-gray-600 mb-1 uppercase tracking-wider font-medium">Total Holdings</div>
                  <div className="text-2xl font-bold text-gray-900">{portfolio.length}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="text-sm text-gray-600 mb-1 uppercase tracking-wider font-medium">Total Invested</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{portfolio.reduce((sum, item) => sum + item.investedValue, 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="text-sm text-gray-600 mb-1 uppercase tracking-wider font-medium">Current Value</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{portfolio.reduce((sum, item) => sum + item.currentValue, 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Holdings Table */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Symbol
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Avg Price
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Current Price
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Invested
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Current Value
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                          P/L
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {portfolio.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-blue-600">show_chart</span>
                              <span className="text-sm font-bold text-gray-900">{item.stockSymbol}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            ₹{item.avgPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                            ₹{item.currentPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            ₹{item.investedValue.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                            ₹{item.currentValue.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <div className={`font-bold ${
                              item.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {item.profitLoss >= 0 ? '+' : ''}₹{item.profitLoss.toFixed(2)}
                            </div>
                            <div className={`text-xs ${
                              item.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              ({item.profitLossPercent.toFixed(2)}%)
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <Link
                              href={`/stocks/${item.stockSymbol}`}
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                            >
                              <span>Trade</span>
                              <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
