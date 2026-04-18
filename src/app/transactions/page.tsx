'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';

interface Transaction {
  id: string;
  stockSymbol: string;
  type: string;
  quantity: number;
  price: number;
  createdAt: string;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction History</h1>
            <p className="text-gray-600">View all your trading activity</p>
          </div>

          {transactions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">receipt_long</span>
              <p className="text-gray-600 text-lg">No transactions yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Symbol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(transaction.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-600">show_chart</span>
                            <span className="text-sm font-bold text-gray-900">{transaction.stockSymbol}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              transaction.type === 'BUY'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            <span className="material-symbols-outlined text-xs">
                              {transaction.type === 'BUY' ? 'arrow_downward' : 'arrow_upward'}
                            </span>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                          {transaction.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          ₹{transaction.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-bold">
                          ₹{(transaction.price * transaction.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
