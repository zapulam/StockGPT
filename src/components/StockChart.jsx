import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Calendar, TrendingUp, BarChart3, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StockChart = ({ symbol, className = "" }) => {
  const [rawData, setRawData] = useState([]); // Store comprehensive dataset
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('1mo');
  const [showMovingAverages, setShowMovingAverages] = useState(true);
  const [stockInfo, setStockInfo] = useState(null);
  
  // Loading animation states
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(0);
  
  const loadingMessages = [
    "Fetching stock data...",
    "Calculating moving averages...",
    "Analyzing price trends...",
    "Loading historical data...",
    "Processing market indicators...",
    "Preparing interactive chart...",
    "Gathering technical analysis...",
    "Finalizing visualization..."
  ];

  // Timeline options
  const timelineOptions = [
    { label: '1D', value: '1d', days: 1 },
    { label: '1W', value: '1w', days: 7 },
    { label: '1M', value: '1mo', days: 30 },
    { label: '3M', value: '3mo', days: 90 },
    { label: '1Y', value: '1y', days: 365 },
    { label: '5Y', value: '5y', days: 1825 }
  ];

  const fetchComprehensiveData = async () => {
    if (!symbol) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔍 API DEBUG: Fetching data for ${symbol}...`);
      
      // Fetch 2 years of comprehensive data
      const response = await fetch('http://127.0.0.1:8000/stock-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: symbol,
          period: '2y', // Get comprehensive dataset
          interval: '1d',
          include_moving_averages: true
        }),
      });

      console.log(`🔍 API DEBUG: Response status:`, response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`Failed to fetch chart data: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform and store comprehensive data
      const transformedData = data.data.map((point, index) => {
        const transformed = {
          date: new Date(point.timestamp).toLocaleDateString(),
          fullDate: new Date(point.timestamp),
          timestamp: point.timestamp,
          price: point.close,
          open: point.open,
          high: point.high,
          low: point.low,
          volume: point.volume
        };

        // Add moving averages if available (always add properties, even if null)
        if (data.moving_averages) {
          Object.keys(data.moving_averages).forEach(maKey => {
            // Always add the MA property, even if null - this is required for Recharts
            transformed[maKey] = data.moving_averages[maKey][index];
          });
        }

        return transformed;
      });

      setRawData(transformedData);
      setStockInfo({
        symbol: data.symbol,
        companyName: data.company_name,
        currentPrice: data.current_price,
        change: data.change,
        changePercent: data.change_percent
      });

      // Comprehensive MA debugging
      console.log('🔍 FRONTEND DEBUG: API Response Structure:');
      console.log('- moving_averages keys:', Object.keys(data.moving_averages || {}));
      console.log('- moving_averages:', data.moving_averages);
      console.log('- data length:', data.data?.length);
      console.log('- include_moving_averages sent:', true);
      
      console.log('🔍 FRONTEND DEBUG: Sample transformed data:');
      console.log('- First 3 points:', transformedData.slice(0, 3));
      console.log('- Last 3 points:', transformedData.slice(-3));
      
      // Check specific MA properties
      const samplePoint = transformedData[Math.floor(transformedData.length / 2)];
      console.log('🔍 FRONTEND DEBUG: Middle data point:', samplePoint);
      console.log('🔍 FRONTEND DEBUG: MA properties exist:', {
        has_ma_20: 'ma_20' in samplePoint,
        has_ma_50: 'ma_50' in samplePoint,
        has_ma_200: 'ma_200' in samplePoint,
        ma_20_value: samplePoint.ma_20,
        ma_50_value: samplePoint.ma_50,
        ma_200_value: samplePoint.ma_200
      });
      
      console.log(`Fetched ${transformedData.length} data points for ${symbol}`);

    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError(err.message || 'Failed to fetch chart data');
    } finally {
      setLoading(false);
    }
  };

  const filterDataByTimeframe = () => {
    if (!rawData.length) return;

    const timeline = timelineOptions.find(t => t.value === selectedPeriod);
    let displayData;

    switch (selectedPeriod) {
      case '1d':
        // Show last 5 trading days minimum (but label as 1D for recent focus)
        displayData = rawData.slice(-5);
        break;
      case '1w':
        // Show last 7 trading days (1 week)
        displayData = rawData.slice(-7);
        break;
      case '1mo':
        // Show last ~22 trading days (1 month)
        displayData = rawData.slice(-22);
        break;
      case '3mo':
        // Show last ~65 trading days (3 months)
        displayData = rawData.slice(-65);
        break;
      case '1y':
        // Show last ~250 trading days (1 year)
        displayData = rawData.slice(-252);
        break;
      case '5y':
        // Show all available data (up to 2 years we fetched)
        displayData = rawData;
        break;
      default:
        displayData = rawData.slice(-22);
    }

    console.log(`🔍 TIMEFRAME DEBUG: ${selectedPeriod} → ${displayData.length} points from ${rawData.length} total`);
    
    // Debug moving averages in filtered data
    if (displayData.length > 0) {
      const firstPoint = displayData[0];
      const lastPoint = displayData[displayData.length - 1];
      console.log('🔍 MA DEBUG - First point:', {
        date: firstPoint.date,
        price: firstPoint.price,
        ma_20: firstPoint.ma_20,
        ma_50: firstPoint.ma_50,
        ma_200: firstPoint.ma_200
      });
      console.log('🔍 MA DEBUG - Last point:', {
        date: lastPoint.date,  
        price: lastPoint.price,
        ma_20: lastPoint.ma_20,
        ma_50: lastPoint.ma_50,
        ma_200: lastPoint.ma_200
      });
      console.log('🔍 MA DEBUG - Has any MA data:', {
        hasAnyMA20: displayData.some(p => p.ma_20 !== null && p.ma_20 !== undefined),
        hasAnyMA50: displayData.some(p => p.ma_50 !== null && p.ma_50 !== undefined), 
        hasAnyMA200: displayData.some(p => p.ma_200 !== null && p.ma_200 !== undefined)
      });
    }
    
    setChartData(displayData);
  };

  // Fetch comprehensive data only when symbol changes
  useEffect(() => {
    fetchComprehensiveData();
  }, [symbol]);

  // Filter data when timeframe changes or rawData is updated
  useEffect(() => {
    filterDataByTimeframe();
  }, [rawData, selectedPeriod]);

  // Loading message rotation effect
  useEffect(() => {
    let interval;
    if (loading) {
      // Reset to first message when loading starts
      setCurrentLoadingMessage(0);
      
      // Rotate through messages every 800ms
      interval = setInterval(() => {
        setCurrentLoadingMessage(prev => (prev + 1) % loadingMessages.length);
      }, 800);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading, loadingMessages.length]);

  const formatTooltipValue = (value, name) => {
    if (name === 'volume') {
      return [new Intl.NumberFormat().format(value), 'Volume'];
    }
    return [`$${value?.toFixed(2)}`, name === 'price' ? 'Price' : name.toUpperCase()];
  };

  const formatTooltipLabel = (label, payload) => {
    if (payload && payload[0] && payload[0].payload.fullDate) {
      return payload[0].payload.fullDate.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    return label;
  };

  if (loading) {
    return (
      <div className={`h-64 bg-gray-700/50 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity }
            }}
            className="mb-4"
          >
            <BarChart3 className="w-8 h-8 text-blue-400 mx-auto" />
          </motion.div>
          
          <div className="h-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentLoadingMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-gray-400 text-sm"
              >
                {loadingMessages[currentLoadingMessage]}
              </motion.span>
            </AnimatePresence>
          </div>
          
          {/* Progress dots */}
          <div className="flex items-center justify-center space-x-1 mt-3">
            {loadingMessages.map((_, index) => (
              <motion.div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  index === currentLoadingMessage ? 'bg-blue-400' : 'bg-gray-600'
                }`}
                animate={index === currentLoadingMessage ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`h-64 bg-gray-700/50 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <span className="text-red-400 text-sm">Error: {error}</span>
          <button 
            onClick={fetchComprehensiveData}
            className="block mt-2 text-blue-400 hover:text-blue-300 text-xs"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className={`h-64 bg-gray-700/50 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">No chart data available</span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-gray-800 rounded-lg p-3 border border-gray-700 ${className}`}
    >
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <h3 className="text-white font-medium text-sm">{stockInfo?.symbol}</h3>
          {stockInfo && (
            <span className={`text-xs ${stockInfo.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stockInfo.change >= 0 ? '+' : ''}{stockInfo.change.toFixed(2)} ({stockInfo.changePercent.toFixed(1)}%)
            </span>
          )}
        </div>

        {/* Compact MA Toggle */}
        <button
          onClick={() => setShowMovingAverages(!showMovingAverages)}
          className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
            showMovingAverages 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {showMovingAverages ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          <span>MA {showMovingAverages ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Compact Timeline Controls */}
      <div className="flex items-center justify-center space-x-1 mb-3">
        {timelineOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedPeriod(option.value)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              selectedPeriod === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              fontSize={10}
              tick={{ fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={10}
              tick={{ fill: '#9CA3AF' }}
              domain={['dataMin - 5', 'dataMax + 5']}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#F9FAFB',
                fontSize: '12px'
              }}
              formatter={formatTooltipValue}
              labelFormatter={formatTooltipLabel}
            />
            
            {/* Starting price reference line */}
            {chartData.length > 0 && (
              <ReferenceLine 
                y={chartData[0].price} 
                stroke="#6B7280" 
                strokeDasharray="3 3" 
                strokeWidth={1}
              />
            )}
            
            {/* Main price line */}
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={false}
              name="Price"
            />
            
            {/* Moving averages - Simplified for debugging */}
            {showMovingAverages && (
              <>
                <Line 
                  type="monotone" 
                  dataKey="ma_20" 
                  stroke="#FBBF24" 
                  strokeWidth={3}
                  dot={false}
                  connectNulls={true}
                  name="MA 20"
                />
                <Line 
                  type="monotone" 
                  dataKey="ma_50" 
                  stroke="#F87171" 
                  strokeWidth={3}
                  dot={false}
                  connectNulls={true}
                  name="MA 50"
                />
                <Line 
                  type="monotone" 
                  dataKey="ma_200" 
                  stroke="#A78BFA" 
                  strokeWidth={3}
                  dot={false}
                  connectNulls={true}
                  name="MA 200"
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* MA Legend (compact) - Always show when MA is ON */}
      {showMovingAverages && (
        <div className="mt-2 flex justify-center space-x-3 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-0.5" style={{backgroundColor: '#FBBF24'}}></div>
            <span className="text-gray-400">MA20</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-0.5" style={{backgroundColor: '#F87171'}}></div>
            <span className="text-gray-400">MA50</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-0.5" style={{backgroundColor: '#A78BFA'}}></div>
            <span className="text-gray-400">MA200</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StockChart;