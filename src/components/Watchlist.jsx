import React, { useState, useEffect } from 'react';
import { BookmarkPlus, Search, TrendingUp, TrendingDown, X, Plus, DollarSign, Eye, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddStock, setShowAddStock] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Mock stock data
  const availableStocks = {
    'AAPL': { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.34, changePercent: 1.35 },
    'MSFT': { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.85, change: -1.23, changePercent: -0.32 },
    'GOOGL': { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.56, change: 3.45, changePercent: 2.48 },
    'AMZN': { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 151.94, change: 1.87, changePercent: 1.25 },
    'TSLA': { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.42, change: -5.32, changePercent: -2.10 },
    'NVDA': { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.28, change: 12.45, changePercent: 1.44 },
    'META': { symbol: 'META', name: 'Meta Platforms Inc.', price: 296.73, change: 4.21, changePercent: 1.44 },
    'NFLX': { symbol: 'NFLX', name: 'Netflix Inc.', price: 487.32, change: -2.15, changePercent: -0.44 },
    'AMD': { symbol: 'AMD', name: 'Advanced Micro Devices', price: 145.67, change: 3.89, changePercent: 2.74 },
    'CRM': { symbol: 'CRM', name: 'Salesforce Inc.', price: 267.84, change: 1.56, changePercent: 0.59 }
  };

  // Load watchlist from localStorage on component mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('stockWatchlist');
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('stockWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = Object.keys(availableStocks).filter(symbol =>
        symbol.toLowerCase().includes(value.toLowerCase()) ||
        availableStocks[symbol].name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  };

  const addToWatchlist = (symbol) => {
    const stock = availableStocks[symbol];
    if (stock && !watchlist.some(item => item.symbol === symbol)) {
      const newStock = {
        ...stock,
        addedDate: new Date().toISOString(),
        id: Date.now() // Simple ID generation
      };
      setWatchlist(prev => [...prev, newStock]);
      setSearchTerm('');
      setSearchResults([]);
      setShowAddStock(false);
    }
  };

  const removeFromWatchlist = (id) => {
    setWatchlist(prev => prev.filter(stock => stock.id !== id));
  };

  const updateStockPrices = () => {
    // Simulate price updates
    setWatchlist(prev => prev.map(stock => {
      const basePrice = availableStocks[stock.symbol]?.price || stock.price;
      const randomChange = (Math.random() - 0.5) * 10; // Random change between -5 and +5
      const newPrice = Math.max(0.01, basePrice + randomChange);
      const change = newPrice - stock.price;
      const changePercent = (change / stock.price) * 100;
      
      return {
        ...stock,
        price: parseFloat(newPrice.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2))
      };
    }));
  };

  const getPerformanceColor = (change) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const calculatePortfolioValue = () => {
    return watchlist.reduce((total, stock) => total + stock.price, 0);
  };

  const calculateTotalChange = () => {
    return watchlist.reduce((total, stock) => total + stock.change, 0);
  };

  return (
    <div className="flex-1 bg-gray-900 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <BookmarkPlus className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={updateStockPrices}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Refresh Prices
              </button>
              <button
                onClick={() => setShowAddStock(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Stock</span>
              </button>
            </div>
          </div>
          <p className="text-gray-400 text-lg">
            Track your favorite stocks and monitor their performance in real-time.
          </p>
        </div>

        {/* Portfolio Summary */}
        {watchlist.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">Stocks Watched</span>
              </div>
              <span className="text-2xl font-bold text-white">{watchlist.length}</span>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-gray-400">Total Value</span>
              </div>
              <span className="text-2xl font-bold text-white">${calculatePortfolioValue().toFixed(2)}</span>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-400">Total Change</span>
              </div>
              <span className={`text-2xl font-bold ${getPerformanceColor(calculateTotalChange())}`}>
                {calculateTotalChange() >= 0 ? '+' : ''}${calculateTotalChange().toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Watchlist Grid */}
        {watchlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {watchlist.map((stock) => (
                <motion.div
                  key={stock.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{stock.symbol}</h3>
                      <p className="text-gray-400 text-sm">{stock.name}</p>
                    </div>
                    <button
                      onClick={() => removeFromWatchlist(stock.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Price:</span>
                      <span className="text-xl font-bold text-white">${stock.price}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Change:</span>
                      <div className={`flex items-center space-x-1 ${getPerformanceColor(stock.change)}`}>
                        {stock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span>{stock.change >= 0 ? '+' : ''}${stock.change}</span>
                        <span>({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Added:</span>
                      <span className="text-white text-sm">
                        {new Date(stock.addedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Mini chart placeholder */}
                  <div className="mt-4 h-16 bg-gray-700/50 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Mini chart - {stock.symbol}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-16">
            <BookmarkPlus className="w-24 h-24 text-gray-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Your watchlist is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Start tracking stocks by adding them to your watchlist
            </p>
            <button
              onClick={() => setShowAddStock(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Stock</span>
            </button>
          </div>
        )}

        {/* Add Stock Modal */}
        <AnimatePresence>
          {showAddStock && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Add Stock to Watchlist</h3>
                  <button
                    onClick={() => {
                      setShowAddStock(false);
                      setSearchTerm('');
                      setSearchResults([]);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search stocks (e.g., AAPL, Tesla)"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {searchResults.map((symbol) => {
                      const stock = availableStocks[symbol];
                      const isInWatchlist = watchlist.some(item => item.symbol === symbol);
                      
                      return (
                        <button
                          key={symbol}
                          onClick={() => !isInWatchlist && addToWatchlist(symbol)}
                          disabled={isInWatchlist}
                          className={`w-full p-3 rounded-lg border text-left transition-colors ${
                            isInWatchlist
                              ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold">{stock.symbol}</div>
                              <div className="text-sm text-gray-400">{stock.name}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">${stock.price}</div>
                              {isInWatchlist && (
                                <div className="text-xs text-blue-400">In watchlist</div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {searchTerm && searchResults.length === 0 && (
                  <div className="text-center py-4 text-gray-400">
                    No stocks found matching "{searchTerm}"
                  </div>
                )}

                {!searchTerm && (
                  <div className="text-center py-4 text-gray-400">
                    Start typing to search for stocks
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Watchlist;