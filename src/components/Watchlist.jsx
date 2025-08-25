import React, { useState, useEffect } from 'react';
import { BookmarkPlus, Search, TrendingUp, TrendingDown, X, Plus, DollarSign, Eye, Trash2, Sparkles, Target, Activity } from 'lucide-react';
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
    if (change > 0) return 'text-emerald-400';
    if (change < 0) return 'text-red-400';
    return 'text-slate-400';
  };

  const calculatePortfolioValue = () => {
    return watchlist.reduce((total, stock) => total + stock.price, 0);
  };

  const calculateTotalChange = () => {
    return watchlist.reduce((total, stock) => total + stock.change, 0);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookmarkPlus className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl blur opacity-20"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">My Watchlist</h1>
                <p className="text-slate-400 text-lg">Track your favorite stocks and monitor their performance in real-time.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={updateStockPrices}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all duration-200 border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Refresh Prices
              </motion.button>
              <motion.button
                onClick={() => setShowAddStock(true)}
                className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                <span>Add Stock</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Portfolio Summary */}
        {watchlist.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div 
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-slate-400 font-medium">Stocks Watched</span>
              </div>
              <span className="text-3xl font-bold text-white">{watchlist.length}</span>
            </motion.div>
            
            <motion.div 
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-slate-400 font-medium">Total Value</span>
              </div>
              <span className="text-3xl font-bold text-white">${calculatePortfolioValue().toFixed(2)}</span>
            </motion.div>
            
            <motion.div 
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-yellow-400" />
                </div>
                <span className="text-slate-400 font-medium">Total Change</span>
              </div>
              <span className={`text-3xl font-bold ${getPerformanceColor(calculateTotalChange())}`}>
                {calculateTotalChange() >= 0 ? '+' : ''}${calculateTotalChange().toFixed(2)}
              </span>
            </motion.div>
          </div>
        )}

        {/* Watchlist Grid */}
        {watchlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {watchlist.map((stock, index) => (
                <motion.div
                  key={stock.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10"
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{stock.symbol}</h3>
                        <p className="text-slate-400 text-sm">{stock.name}</p>
                      </div>
                      <motion.button
                        onClick={() => removeFromWatchlist(stock.id)}
                        className="text-slate-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-white/5"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Price:</span>
                        <span className="text-2xl font-bold text-white">${stock.price}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Change:</span>
                        <div className={`flex items-center space-x-2 ${getPerformanceColor(stock.change)}`}>
                          {stock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span className="font-semibold">{stock.change >= 0 ? '+' : ''}${stock.change}</span>
                          <span className="text-sm">({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%)</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Added:</span>
                        <span className="text-white text-sm">
                          {new Date(stock.addedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Mini chart placeholder */}
                    <div className="mt-6 h-20 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                      <span className="text-slate-500 text-xs">Mini chart - {stock.symbol}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/10">
              <BookmarkPlus className="w-12 h-12 text-slate-500" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-400 mb-4">
              Your watchlist is empty
            </h3>
            <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
              Start tracking stocks by adding them to your watchlist
            </p>
            <motion.button
              onClick={() => setShowAddStock(true)}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Stock</span>
            </motion.button>
          </div>
        )}

        {/* Add Stock Modal */}
        <AnimatePresence>
          {showAddStock && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Add Stock to Watchlist</h3>
                  <motion.button
                    onClick={() => {
                      setShowAddStock(false);
                      setSearchTerm('');
                      setSearchResults([]);
                    }}
                    className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search stocks (e.g., AAPL, Tesla)"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    autoFocus
                  />
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {searchResults.map((symbol) => {
                      const stock = availableStocks[symbol];
                      const isInWatchlist = watchlist.some(item => item.symbol === symbol);
                      
                      return (
                        <motion.button
                          key={symbol}
                          onClick={() => !isInWatchlist && addToWatchlist(symbol)}
                          disabled={isInWatchlist}
                          className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
                            isInWatchlist
                              ? 'bg-white/5 border-white/10 text-slate-400 cursor-not-allowed'
                              : 'bg-white/5 border-white/10 hover:bg-white/10 text-white hover:border-white/20'
                          }`}
                          whileHover={!isInWatchlist ? { scale: 1.02 } : {}}
                          whileTap={!isInWatchlist ? { scale: 0.98 } : {}}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-lg">{stock.symbol}</div>
                              <div className="text-sm text-slate-400">{stock.name}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-lg">${stock.price}</div>
                              {isInWatchlist && (
                                <div className="text-xs text-orange-400 font-medium">In watchlist</div>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {searchTerm && searchResults.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    No stocks found matching "{searchTerm}"
                  </div>
                )}

                {!searchTerm && (
                  <div className="text-center py-8 text-slate-400">
                    <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-50" />
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