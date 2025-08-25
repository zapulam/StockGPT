import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, BarChart3, Calendar, DollarSign, Volume2, ArrowUpDown, Sparkles, Target, Activity, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Analyze = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('1D');
  const [searchResults, setSearchResults] = useState([]);

  // Mock stock data for demonstration
  const mockStockData = {
    'AAPL': {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 175.43,
      change: 2.34,
      changePercent: 1.35,
      volume: '52.3M',
      marketCap: '2.75T',
      pe: 28.9,
      high52: 199.62,
      low52: 124.17,
      data: Array.from({length: 50}, (_, i) => ({
        date: new Date(Date.now() - (49-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        open: 170 + Math.random() * 10,
        high: 175 + Math.random() * 15,
        low: 165 + Math.random() * 10,
        close: 170 + Math.random() * 10,
        volume: Math.floor(Math.random() * 100) + 20
      }))
    },
    'TSLA': {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: 248.42,
      change: -5.32,
      changePercent: -2.10,
      volume: '89.7M',
      marketCap: '789.2B',
      pe: 45.2,
      high52: 414.50,
      low52: 138.80,
      data: Array.from({length: 50}, (_, i) => ({
        date: new Date(Date.now() - (49-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        open: 240 + Math.random() * 20,
        high: 250 + Math.random() * 25,
        low: 230 + Math.random() * 15,
        close: 240 + Math.random() * 20,
        volume: Math.floor(Math.random() * 150) + 50
      }))
    }
  };

  const popularStocks = ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META'];

  const handleSearch = async (symbol) => {
    if (!symbol.trim()) return;
    
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const stockData = mockStockData[symbol.toUpperCase()];
    if (stockData) {
      setSelectedStock(stockData);
      setSearchResults([]);
    } else {
      setSearchResults([]);
      alert(`Stock ${symbol.toUpperCase()} not found in demo data. Try AAPL or TSLA.`);
    }
    setLoading(false);
  };

  const handleSearchInput = (value) => {
    setSearchTerm(value);
    if (value.length > 0) {
      // Filter popular stocks for suggestions
      const filtered = popularStocks.filter(stock => 
        stock.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  };

  const timeframes = ['1D', '5D', '1M', '3M', '6M', '1Y', '5Y'];

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl blur opacity-20"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Stock Analysis</h1>
              <p className="text-slate-400 text-lg">Search for any stock to view detailed candlestick charts and technical analysis.</p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <div className="relative max-w-md">
            <div className="flex">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter stock symbol (e.g., AAPL, TSLA)"
                  value={searchTerm}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-l-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all duration-200"
                />
              </div>
              <motion.button
                onClick={() => handleSearch(searchTerm)}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-r-xl transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Searching...' : 'Search'}
              </motion.button>
            </div>
            
            {/* Search Results Dropdown */}
            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl"
                >
                  {searchResults.map((symbol) => (
                    <motion.button
                      key={symbol}
                      onClick={() => {
                        setSearchTerm(symbol);
                        handleSearch(symbol);
                      }}
                      className="w-full px-4 py-3 text-left text-white hover:bg-white/10 first:rounded-t-xl last:rounded-b-xl transition-colors duration-200"
                      whileHover={{ x: 5 }}
                    >
                      {symbol}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Popular Stocks */}
          <div className="mt-6">
            <p className="text-slate-400 text-sm mb-3">Popular stocks:</p>
            <div className="flex flex-wrap gap-2">
              {popularStocks.map((symbol) => (
                <motion.button
                  key={symbol}
                  onClick={() => handleSearch(symbol)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-sm rounded-lg border border-white/10 transition-all duration-200 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {symbol}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Stock Analysis Display */}
        {selectedStock ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stock Header */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedStock.symbol}</h2>
                  <p className="text-slate-400 text-lg">{selectedStock.name}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-3 mb-3">
                    <DollarSign className="w-6 h-6 text-emerald-400" />
                    <span className="text-4xl font-bold text-white">{selectedStock.price}</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${selectedStock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selectedStock.change >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    <span className="font-semibold text-lg">{selectedStock.change >= 0 ? '+' : ''}{selectedStock.change}</span>
                    <span className="text-sm">({selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent}%)</span>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <Volume2 className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm mb-1">Volume</p>
                  <p className="text-white font-semibold text-lg">{selectedStock.volume}</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <DollarSign className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm mb-1">Market Cap</p>
                  <p className="text-white font-semibold text-lg">{selectedStock.marketCap}</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <BarChart3 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm mb-1">P/E Ratio</p>
                  <p className="text-white font-semibold text-lg">{selectedStock.pe}</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <Target className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm mb-1">52W Range</p>
                  <p className="text-white font-semibold text-sm">{selectedStock.low52} - {selectedStock.high52}</p>
                </div>
              </div>
            </div>

            {/* Timeframe Selector */}
            <div className="flex items-center space-x-4">
              <Calendar className="w-6 h-6 text-slate-400" />
              <span className="text-slate-400 font-medium">Timeframe:</span>
              <div className="flex space-x-2">
                {timeframes.map((tf) => (
                  <motion.button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                      timeframe === tf
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tf}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">
                Candlestick Chart - {selectedStock.symbol} ({timeframe})
              </h3>
              <div className="h-96 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <BarChart3 className="w-20 h-20 text-slate-500 mx-auto mb-6" />
                  <p className="text-slate-400 text-lg mb-2">
                    Interactive candlestick chart for {selectedStock.symbol} would appear here
                  </p>
                  <p className="text-slate-500 text-sm">
                    Chart showing OHLC data, volume, and technical indicators
                  </p>
                </div>
              </div>
            </div>

            {/* Technical Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Activity className="w-5 h-5 text-emerald-400 mr-2" />
                  Technical Indicators
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-slate-400">RSI (14)</span>
                    <span className="text-yellow-400 font-semibold">68.5</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-slate-400">MACD</span>
                    <span className="text-emerald-400 font-semibold">Bullish</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-slate-400">Moving Avg (50)</span>
                    <span className="text-blue-400 font-semibold">$172.45</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-slate-400">Bollinger Bands</span>
                    <span className="text-purple-400 font-semibold">Upper: $180.2</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Target className="w-5 h-5 text-orange-400 mr-2" />
                  Support & Resistance
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-slate-400">Resistance 1</span>
                    <span className="text-red-400 font-semibold">$178.50</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-slate-400">Resistance 2</span>
                    <span className="text-red-400 font-semibold">$182.20</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-slate-400">Support 1</span>
                    <span className="text-emerald-400 font-semibold">$171.80</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-slate-400">Support 2</span>
                    <span className="text-emerald-400 font-semibold">$168.90</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/10">
              <BarChart3 className="w-12 h-12 text-slate-500" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-400 mb-4">
              Search for a stock to begin analysis
            </h3>
            <p className="text-slate-500 text-lg max-w-md mx-auto">
              Enter a stock symbol above to view detailed charts and technical indicators
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyze;