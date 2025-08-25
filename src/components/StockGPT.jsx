import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Brain, RefreshCw, DollarSign, Search, Calendar, Bot, CheckCircle, Activity, Globe, BarChart3, Sparkles, Zap, Target, TrendingUpIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StockChart from './StockChart';

const StockGPT = () => {
  const [recommendedStocks, setRecommendedStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Modern loading animation states
  const [currentAgentStep, setCurrentAgentStep] = useState(0);
  
  const agentSteps = [
    {
      id: 'web_search',
      title: 'Web Search Agent',
      description: 'Scanning financial news and market sentiment',
      icon: Search,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'market_analysis',
      title: 'Market Analysis Agent',
      description: 'Analyzing market trends and technical indicators',
      icon: BarChart3,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'earnings_agent',
      title: 'Earnings Agent',
      description: 'Reviewing earnings calendars and fundamentals',
      icon: Calendar,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'synthesizer',
      title: 'Recommendation Synthesizer',
      description: 'Synthesizing insights into stock recommendations',
      icon: Bot,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  // Manage loading animation progression
  useEffect(() => {
    let interval;
    
    if (loading) {
      // Start with first step
      setCurrentAgentStep(0);
      console.log('Loading animation started: Web Search Agent');
      
      // Cycle through steps every 3 seconds
      interval = setInterval(() => {
        setCurrentAgentStep(prev => {
          const nextStep = (prev + 1) % agentSteps.length;
          console.log(`Loading animation: Step ${prev} → ${nextStep} (${agentSteps[nextStep].title})`);
          return nextStep;
        });
      }, 3000);
    } else {
      // Reset to first step when not loading
      setCurrentAgentStep(0);
      console.log('Loading animation stopped');
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading, agentSteps.length]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      // Call the real agentic framework API
      const response = await fetch('http://127.0.0.1:8000/stock-recommendations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.recommendations) {
        // Transform API response to match component expectations
        const transformedStocks = data.recommendations.map(stock => {
          const score = Math.round(stock.ai_score);
          console.log(`🔍 SCORE DEBUG: ${stock.symbol} - ai_score: ${stock.ai_score}, rounded: ${score}`);
          
          return {
            symbol: stock.symbol,
            name: stock.company_name,
            price: parseFloat(stock.current_price).toFixed(2), // Round to 2 decimal places
            change: parseFloat(stock.month_change / 5).toFixed(2), // Approximate daily change, rounded to 2 decimals
            changePercent: parseFloat(stock.month_change / 20).toFixed(1), // Approximate daily change %, rounded to 1 decimal
            recommendation: stock.recommendation,
            score: score, // Round score to whole number
            reasoning: stock.reasoning,
            sector: stock.sector,
            riskLevel: stock.risk_level
          };
        });
        
        setRecommendedStocks(transformedStocks);
      } else {
        throw new Error(data.error || 'No recommendations received');
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err.message || 'Failed to fetch AI recommendations');
      
    } finally {
      setLoading(false);
    }
  };

  // Removed automatic fetch on component mount

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'Strong Buy': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Buy': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Hold': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Sell': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBackgroundColor = (score) => {
    if (score >= 90) return 'bg-emerald-400';
    if (score >= 80) return 'bg-blue-400';
    if (score >= 70) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  if (loading) {
    const currentStep = agentSteps[currentAgentStep];
    const CurrentIcon = currentStep.icon;
    
    return (
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96 px-4">
            <div className="text-center max-w-5xl w-full">
              
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 animate-pulse"></div>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">AI Analysis Engine</h2>
                <p className="text-slate-400 text-lg">Multi-agent system analyzing market data for optimal stock recommendations</p>
              </motion.div>

              {/* Agent Progress Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto px-2">
                {agentSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index === currentAgentStep;
                  const isCompleted = index < currentAgentStep;
                  
                  return (
                    <div key={step.id} className="flex justify-center">
                      <motion.div
                        className={`relative p-6 rounded-2xl border backdrop-blur-sm transition-all duration-700 ${
                          isActive 
                            ? `bg-gradient-to-r ${step.gradient}/20 border-white/20 shadow-2xl shadow-blue-500/20` 
                            : isCompleted
                            ? 'bg-emerald-500/10 border-emerald-400/30'
                            : 'bg-white/5 border-white/10'
                        }`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ 
                          opacity: isActive ? 1 : isCompleted ? 0.9 : 0.7,
                          scale: isActive ? 1.02 : 1,
                          transition: { duration: 0.7, delay: index * 0.1 }
                        }}
                      >
                        {/* Status Indicator */}
                        <div className="absolute top-4 right-4">
                          {isCompleted && (
                            <CheckCircle className="w-6 h-6 text-emerald-400" />
                          )}
                          {isActive && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              <Activity className="w-6 h-6 text-blue-400" />
                            </motion.div>
                          )}
                        </div>
                        
                        {/* Agent Content */}
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-xl ${isActive ? `bg-gradient-to-r ${step.gradient}` : 'bg-white/10'}`}>
                            <StepIcon className={`w-6 h-6 ${
                              isActive ? 'text-white' : 
                              isCompleted ? 'text-emerald-400' : 'text-slate-500'
                            }`} />
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className={`font-bold text-lg ${
                              isActive ? 'text-white' : 
                              isCompleted ? 'text-emerald-400' : 'text-slate-400'
                            }`}>
                              {step.title}
                            </h3>
                            <p className={`text-sm mt-2 ${
                              isActive ? 'text-slate-300' : 'text-slate-500'
                            }`}>
                              {step.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Active Pulse Animation */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-2xl"
                            style={{
                              background: `linear-gradient(45deg, transparent, ${step.color.replace('text-', 'rgba(').replace('-400', ', 0.1)')})`
                            }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </motion.div>
                    </div>
                  );
                })}
              </div>

              {/* Current Status */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAgentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.3, 1],
                        rotate: [0, 360]
                      }}
                      transition={{ 
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 3, repeat: Infinity, ease: "linear" }
                      }}
                      className={`p-6 rounded-2xl bg-gradient-to-r ${currentStep.gradient} shadow-2xl ring-4 ring-blue-500/30`}
                    >
                      <CurrentIcon className="w-10 h-10 text-white" />
                    </motion.div>
                    <div className="text-left">
                      <h3 className="text-2xl font-bold text-white">{currentStep.title}</h3>
                      <p className="text-slate-400 text-lg">{currentStep.description}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-3 mb-6 backdrop-blur-sm">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${((currentAgentStep + 1) / agentSteps.length) * 100}%` 
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center"
              >
                <p className="text-slate-500 text-lg">
                  Step {currentAgentStep + 1} of {agentSteps.length} • Expected completion: 2-4 minutes.
                </p>
                <div className="flex items-center justify-center mt-4 space-x-2">
                  <div className="flex space-x-2">
                    {agentSteps.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`w-4 h-4 rounded-full transition-all duration-500 ${
                          index === currentAgentStep 
                            ? 'bg-blue-400 shadow-lg shadow-blue-400/50' 
                            : index < currentAgentStep 
                            ? 'bg-emerald-400' 
                            : 'bg-slate-600'
                        }`}
                        animate={index === currentAgentStep ? { 
                          scale: [1, 1.4, 1],
                          boxShadow: ['0 0 0 0 rgba(59, 130, 246, 0.4)', '0 0 0 8px rgba(59, 130, 246, 0)', '0 0 0 0 rgba(59, 130, 246, 0.4)']
                        } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
              
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingDown className="w-8 h-8 text-red-400" />
              </div>
              <div className="text-red-400 text-xl mb-6">{error}</div>
              <motion.button 
                onClick={fetchRecommendations}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Again
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show welcome screen if user hasn't searched yet
  if (!hasSearched && !loading) {
    return (
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96 px-4">
            <div className="text-center max-w-4xl w-full">
              
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <div className="flex items-center justify-center mb-8">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                      <Brain className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -inset-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-30 animate-pulse"></div>
                  </div>
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">Welcome to StockGPT</h2>
                <p className="text-slate-400 text-xl leading-relaxed max-w-2xl mx-auto">
                  Your AI-powered platform for intelligent stock market analysis and insights. 
                  Get personalized stock recommendations powered by advanced multi-agent analysis.
                </p>
              </motion.div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                {[
                  {
                    icon: Search,
                    title: "Web Search Agent",
                    description: "Scans financial news and market sentiment",
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    icon: BarChart3,
                    title: "Market Analysis Agent", 
                    description: "Analyzes market trends and technical indicators",
                    color: "from-emerald-500 to-teal-500"
                  },
                  {
                    icon: Bot,
                    title: "AI Synthesizer",
                    description: "Synthesizes insights into stock recommendations",
                    color: "from-purple-500 to-pink-500"
                  }
                ].map((feature, index) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                        <FeatureIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-slate-400 text-sm">{feature.description}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mb-8"
              >
                <motion.button 
                  onClick={fetchRecommendations}
                  className="group relative px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center space-x-3">
                    <Sparkles className="w-6 h-6" />
                    <span>Start AI Analysis</span>
                  </div>
                </motion.button>
                <p className="text-slate-500 text-sm mt-4">
                  Click to begin multi-agent stock analysis (takes 2-4 minutes)
                </p>
              </motion.div>
              
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-20"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">AI Stock Recommendations</h1>
                <p className="text-slate-400 text-lg">Powered by advanced multi-agent analysis</p>
              </div>
            </div>
            <motion.button 
              onClick={fetchRecommendations}
              className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </motion.button>
          </div>
        </div>

        {/* Stock Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {recommendedStocks.map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-white mb-1">{stock.symbol}</h3>
                    <p className="text-slate-400 text-sm">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-5 h-5 text-emerald-400" />
                      <span className="text-3xl font-bold text-white">${parseFloat(stock.price).toFixed(2)}</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${parseFloat(stock.change) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {parseFloat(stock.change) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="font-semibold">{parseFloat(stock.change) >= 0 ? '+' : ''}{parseFloat(stock.change).toFixed(2)}</span>
                      <span className="text-sm">({parseFloat(stock.changePercent) >= 0 ? '+' : ''}{parseFloat(stock.changePercent).toFixed(1)}%)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Recommendation:</span>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getRecommendationColor(stock.recommendation)}`}>
                      {stock.recommendation}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">AI Score:</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-white/10 rounded-full h-3 backdrop-blur-sm">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 shadow-lg ${getScoreBackgroundColor(stock.score)}`}
                          style={{ width: `${Math.min(100, Math.max(0, stock.score))}%` }}
                        ></div>
                      </div>
                      <span className={`font-bold text-lg ${getScoreColor(stock.score)}`}>
                        {stock.score}/100
                      </span>
                    </div>
                  </div>

                  {/* AI Reasoning */}
                  {stock.reasoning && (
                    <div className="mt-4 text-left">
                      <span className="text-slate-400 text-sm">AI Analysis:</span>
                      <p className="text-slate-300 text-sm mt-2 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/10">{stock.reasoning}</p>
                    </div>
                  )}

                  {/* Risk Level and Sector */}
                  <div className="mt-4 flex items-center justify-between text-sm">
                    {stock.sector && (
                      <span className="px-3 py-1 bg-blue-400/10 text-blue-400 rounded-full text-xs font-medium border border-blue-400/20">
                        {stock.sector}
                      </span>
                    )}
                    {stock.riskLevel && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        stock.riskLevel === 'Low' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                        stock.riskLevel === 'Medium' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' :
                        'bg-red-400/10 text-red-400 border-red-400/20'
                      }`}>
                        {stock.riskLevel} Risk
                      </span>
                    )}
                  </div>

                  {/* Interactive Stock Chart */}
                  <div className="mt-6">
                    <StockChart symbol={stock.symbol} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>


      </div>
    </div>
  );
};

export default StockGPT;