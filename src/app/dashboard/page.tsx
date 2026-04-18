'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';

interface PortfolioSummary {
  balance: number;
  summary: {
    totalInvested: number;
    totalCurrent: number;
    totalProfitLoss: number;
    totalProfitLossPercent: number;
    totalValue: number;
  };
}

export default function Dashboard() {
  const [data, setData] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch('/api/portfolio');
      const result = await response.json();
      setData(result);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome to your trading terminal</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-blue-600 text-2xl">account_balance_wallet</span>
              </div>
              <div className="text-sm text-gray-600 mb-1 uppercase tracking-wider font-medium">Available Balance</div>
              <div className="text-2xl font-bold text-gray-900">
                ₹{data?.balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-purple-600 text-2xl">trending_down</span>
              </div>
              <div className="text-sm text-gray-600 mb-1 uppercase tracking-wider font-medium">Invested Amount</div>
              <div className="text-2xl font-bold text-gray-900">
                ₹{data?.summary.totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-green-600 text-2xl">trending_up</span>
              </div>
              <div className="text-sm text-gray-600 mb-1 uppercase tracking-wider font-medium">Current Value</div>
              <div className="text-2xl font-bold text-gray-900">
                ₹{data?.summary.totalCurrent.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className={`material-symbols-outlined text-2xl ${
                  (data?.summary.totalProfitLoss || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(data?.summary.totalProfitLoss || 0) >= 0 ? 'arrow_upward' : 'arrow_downward'}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-1 uppercase tracking-wider font-medium">Profit/Loss</div>
              <div
                className={`text-2xl font-bold ${
                  (data?.summary.totalProfitLoss || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                ₹{data?.summary.totalProfitLoss.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                <span className="text-sm ml-2">
                  ({data?.summary.totalProfitLossPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Total Portfolio Value Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 rounded-lg shadow-lg text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm uppercase tracking-wider font-medium opacity-90 mb-2">
                  Total Portfolio Value
                </div>
                <div className="text-4xl font-bold">
                  ₹{data?.summary.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>
              </div>
              <span className="material-symbols-outlined text-6xl opacity-20">account_balance</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="/stocks"
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <span className="material-symbols-outlined text-blue-600 text-2xl">search</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Explore Market</div>
                  <div className="text-sm text-gray-600">Browse stocks</div>
                </div>
              </div>
            </a>

            <a
              href="/portfolio"
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-green-50 p-3 rounded-lg group-hover:bg-green-100 transition-colors">
                  <span className="material-symbols-outlined text-green-600 text-2xl">pie_chart</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">View Portfolio</div>
                  <div className="text-sm text-gray-600">Your holdings</div>
                </div>
              </div>
            </a>

            <a
              href="/transactions"
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-purple-50 p-3 rounded-lg group-hover:bg-purple-100 transition-colors">
                  <span className="material-symbols-outlined text-purple-600 text-2xl">receipt_long</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Transaction History</div>
                  <div className="text-sm text-gray-600">View all trades</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
