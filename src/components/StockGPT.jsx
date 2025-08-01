import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Brain, RefreshCw, DollarSign, Search, Calendar, Bot, CheckCircle, Activity, Globe, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StockChart from './StockChart';

const StockGPT = () => {
  const [recommendedStocks, setRecommendedStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Modern loading animation states
  const [currentAgentStep, setCurrentAgentStep] = useState(0);
  
  const agentSteps = [
    {
      id: 'web_search',
      title: 'Web Search Agent',
      description: 'Scanning financial news and market sentiment',
      icon: Search,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      id: 'market_analysis',
      title: 'Market Analysis Agent',
      description: 'Analyzing market trends and technical indicators',
      icon: BarChart3,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      id: 'earnings_agent',
      title: 'Earnings Agent',
      description: 'Reviewing earnings calendars and fundamentals',
      icon: Calendar,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      id: 'synthesizer',
      title: 'Recommendation Synthesizer',
      description: 'Synthesizing insights into stock recommendations',
      icon: Bot,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10'
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

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'Strong Buy': return 'text-green-400 bg-green-400/10';
      case 'Buy': return 'text-blue-400 bg-blue-400/10';
      case 'Hold': return 'text-yellow-400 bg-yellow-400/10';
      case 'Sell': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBackgroundColor = (score) => {
    if (score >= 90) return 'bg-green-400';
    if (score >= 80) return 'bg-blue-400';
    if (score >= 70) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  if (loading) {
    const currentStep = agentSteps[currentAgentStep];
    const CurrentIcon = currentStep.icon;
    
    return (
      <div className="flex-1 bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96 px-4">
            <div className="text-center max-w-5xl w-full">
              
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="flex items-center justify-center mb-4">
                  <Brain className="w-8 h-8 text-blue-400 mr-3" />
                  <h2 className="text-2xl font-bold text-white">AI Analysis Engine</h2>
                </div>
                <p className="text-gray-400 text-sm">Multi-agent system analyzing market data for optimal stock recommendations</p>
              </motion.div>

              {/* Agent Progress Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto px-2">
                {agentSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index === currentAgentStep;
                  const isCompleted = index < currentAgentStep;
                  
                  return (
                    <div key={step.id} className="flex justify-center">
                      <motion.div
                        className={`relative p-4 rounded-lg border w-full transition-all duration-700 ${
                          isActive 
                            ? `${step.bgColor} border-blue-400/60 shadow-lg shadow-blue-400/20` 
                            : isCompleted
                            ? 'bg-green-400/10 border-green-400/40'
                            : 'bg-gray-800/30 border-gray-700'
                        }`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ 
                          opacity: isActive ? 1 : isCompleted ? 0.9 : 0.7,
                          scale: isActive ? 1.02 : 1,
                          transition: { duration: 0.7, delay: index * 0.1 }
                        }}
                      >
                      {/* Status Indicator */}
                      <div className="absolute top-2 right-2">
                        {isCompleted && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                        {isActive && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Activity className="w-5 h-5 text-blue-400" />
                          </motion.div>
                        )}
                      </div>
                      
                      {/* Agent Content */}
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${isActive ? step.bgColor : 'bg-gray-700'}`}>
                          <StepIcon className={`w-5 h-5 ${
                            isActive ? step.color : 
                            isCompleted ? 'text-green-400' : 'text-gray-500'
                          }`} />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className={`font-semibold text-sm ${
                            isActive ? 'text-white' : 
                            isCompleted ? 'text-green-400' : 'text-gray-400'
                          }`}>
                            {step.title}
                          </h3>
                          <p className={`text-xs mt-1 ${
                            isActive ? 'text-gray-300' : 'text-gray-500'
                          }`}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Active Pulse Animation */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-lg"
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
                  className="mb-6"
                >
                  <div className="flex items-center justify-center space-x-3 mb-3">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.3, 1],
                        rotate: [0, 360]
                      }}
                      transition={{ 
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 3, repeat: Infinity, ease: "linear" }
                      }}
                      className={`p-4 rounded-full ${currentStep.bgColor} shadow-lg ring-2 ring-blue-400/30`}
                    >
                      <CurrentIcon className={`w-8 h-8 ${currentStep.color}`} />
                    </motion.div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-white">{currentStep.title}</h3>
                      <p className="text-gray-400 text-sm">{currentStep.description}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress Bar */}
              <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
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
                <p className="text-gray-500 text-sm">
                  Step {currentAgentStep + 1} of {agentSteps.length} • Expected completion: 2-4 minutes.
                </p>
                <div className="flex items-center justify-center mt-2 space-x-2">
                  <div className="flex space-x-1">
                    {agentSteps.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-500 ${
                          index === currentAgentStep 
                            ? 'bg-blue-400 shadow-lg shadow-blue-400/50' 
                            : index < currentAgentStep 
                            ? 'bg-green-400' 
                            : 'bg-gray-600'
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
      <div className="flex-1 bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-red-400 text-xl mb-4">{error}</div>
              <button 
                onClick={fetchRecommendations}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-900 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold text-white">AI Stock Recommendations</h1>
            </div>
            <button 
              onClick={fetchRecommendations}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stock Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendedStocks.map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white text-left">{stock.symbol}</h3>
                  <p className="text-gray-400 text-sm text-left">{stock.name}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-2xl font-bold text-white">${parseFloat(stock.price).toFixed(2)}</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${parseFloat(stock.change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {parseFloat(stock.change) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{parseFloat(stock.change) >= 0 ? '+' : ''}{parseFloat(stock.change).toFixed(2)}</span>
                    <span>({parseFloat(stock.changePercent) >= 0 ? '+' : ''}{parseFloat(stock.changePercent).toFixed(1)}%)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-left">AI Recommendation:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRecommendationColor(stock.recommendation)}`}>
                    {stock.recommendation}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-left">AI Score:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${getScoreBackgroundColor(stock.score)}`}
                        style={{ width: `${Math.min(100, Math.max(0, stock.score))}%` }}
                      ></div>
                    </div>
                    <span className={`font-bold text-sm ${getScoreColor(stock.score)}`}>
                      {stock.score}/100
                    </span>
                  </div>
                </div>

                {/* AI Reasoning */}
                {stock.reasoning && (
                  <div className="mt-2 text-left">
                    <span className="text-gray-400 text-xs text-left">AI Analysis:</span>
                    <p className="text-gray-300 text-xs mt-1 text-left leading-relaxed">{stock.reasoning}</p>
                  </div>
                )}

                {/* Risk Level and Sector */}
                <div className="mt-2 flex items-center justify-between text-sm">
                  {stock.sector && (
                    <span className="px-2 py-1 bg-blue-400/10 text-blue-400 rounded-full text-xs">
                      {stock.sector}
                    </span>
                  )}
                  {stock.riskLevel && (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      stock.riskLevel === 'Low' ? 'bg-green-400/10 text-green-400' :
                      stock.riskLevel === 'Medium' ? 'bg-yellow-400/10 text-yellow-400' :
                      'bg-red-400/10 text-red-400'
                    }`}>
                      {stock.riskLevel} Risk
                    </span>
                  )}
                </div>

                {/* Interactive Stock Chart */}
                <div className="mt-3">
                  <StockChart symbol={stock.symbol} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-gray-400 text-sm text-center">
            <strong>Disclaimer:</strong> AI recommendations and charts are for informational purposes only and should not be considered as financial advice. 
            Charts display real historical price data with technical indicators. 
            Always conduct your own research and consult with financial professionals before making investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockGPT;