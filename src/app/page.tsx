import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 bg-blue-600"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-15 bg-green-500"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center space-y-8 max-w-4xl">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-7xl font-black tracking-tighter text-gray-900 mb-4">
              Trade<span className="text-blue-600">Sphere</span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="font-semibold uppercase tracking-wider">NSE/BSE Live Trading Platform</span>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Master Indian Stock Markets<br />
              <span className="text-blue-600">Risk-Free Virtual Trading</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Practice trading with ₹1,00,000 virtual capital. Real-time market data from NSE & BSE. 
              Build your portfolio, track performance, and learn without risk.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link
              href="/auth/signup"
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full font-semibold text-lg shadow-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span>Start Trading Now</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/auth/signin"
              className="px-10 py-4 bg-white text-gray-900 border-2 border-gray-300 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all"
            >
              Sign In
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200">
              <div className="text-5xl font-bold text-blue-600 mb-3">₹1L</div>
              <div className="text-gray-900 font-semibold text-lg mb-2">Virtual Capital</div>
              <div className="text-gray-600 text-sm">Start with ₹1,00,000 virtual money to practice trading strategies</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200">
              <div className="text-5xl font-bold text-green-600 mb-3">Live</div>
              <div className="text-gray-900 font-semibold text-lg mb-2">Real-Time Data</div>
              <div className="text-gray-600 text-sm">Access live market data from NSE & BSE exchanges</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200">
              <div className="text-5xl font-bold text-blue-600 mb-3">Zero</div>
              <div className="text-gray-900 font-semibold text-lg mb-2">Risk Trading</div>
              <div className="text-gray-600 text-sm">Learn and practice without any financial risk</div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
                <span className="font-semibold">Bank-Grade Security</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span className="font-semibold">Verified Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="font-semibold">Trusted by Traders</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-gray-500 text-xs">
          © 2024 TradeSphere. Virtual trading platform for educational purposes.
        </p>
      </div>
    </div>
  );
}
