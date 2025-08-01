import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, BarChart3, Calendar, DollarSign, Volume2, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="flex-1 bg-gray-900 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Stock Analysis</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Search for any stock to view detailed candlestick charts and technical analysis.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="flex">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter stock symbol (e.g., AAPL, TSLA)"
                  value={searchTerm}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => handleSearch(searchTerm)}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-r-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
            
            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                {searchResults.map((symbol) => (
                  <button
                    key={symbol}
                    onClick={() => {
                      setSearchTerm(symbol);
                      handleSearch(symbol);
                    }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Popular Stocks */}
          <div className="mt-4">
            <p className="text-gray-400 text-sm mb-2">Popular stocks:</p>
            <div className="flex flex-wrap gap-2">
              {popularStocks.map((symbol) => (
                <button
                  key={symbol}
                  onClick={() => handleSearch(symbol)}
                  className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-full border border-gray-700 transition-colors"
                >
                  {symbol}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stock Analysis Display */}
        {selectedStock ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stock Header */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedStock.symbol}</h2>
                  <p className="text-gray-400">{selectedStock.name}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <span className="text-3xl font-bold text-white">{selectedStock.price}</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${selectedStock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    <TrendingUp className="w-4 h-4" />
                    <span>{selectedStock.change >= 0 ? '+' : ''}{selectedStock.change}</span>
                    <span>({selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent}%)</span>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Volume</p>
                  <p className="text-white font-semibold">{selectedStock.volume}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Market Cap</p>
                  <p className="text-white font-semibold">{selectedStock.marketCap}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">P/E Ratio</p>
                  <p className="text-white font-semibold">{selectedStock.pe}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">52W Range</p>
                  <p className="text-white font-semibold">{selectedStock.low52} - {selectedStock.high52}</p>
                </div>
              </div>
            </div>

            {/* Timeframe Selector */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400">Timeframe:</span>
              <div className="flex space-x-1">
                {timeframes.map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      timeframe === tf
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">
                Candlestick Chart - {selectedStock.symbol} ({timeframe})
              </h3>
              <div className="h-96 bg-gray-700/50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Interactive candlestick chart for {selectedStock.symbol} would appear here
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Chart showing OHLC data, volume, and technical indicators
                  </p>
                </div>
              </div>
            </div>

            {/* Technical Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4">Technical Indicators</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">RSI (14)</span>
                    <span className="text-yellow-400">68.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">MACD</span>
                    <span className="text-green-400">Bullish</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Moving Avg (50)</span>
                    <span className="text-blue-400">$172.45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bollinger Bands</span>
                    <span className="text-purple-400">Upper: $180.2</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4">Support & Resistance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Resistance 1</span>
                    <span className="text-red-400">$178.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Resistance 2</span>
                    <span className="text-red-400">$182.20</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Support 1</span>
                    <span className="text-green-400">$171.80</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Support 2</span>
                    <span className="text-green-400">$168.90</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <BarChart3 className="w-24 h-24 text-gray-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Search for a stock to begin analysis
            </h3>
            <p className="text-gray-500">
              Enter a stock symbol above to view detailed charts and technical indicators
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyze;