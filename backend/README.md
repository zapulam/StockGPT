# StockGPT Backend - Dynamic Multi-Agent Framework

## Overview

The StockGPT backend features an advanced multi-agent AI system that **dynamically discovers and analyzes stocks** based on real-time market conditions. Unlike traditional systems that rely on predetermined stock lists, our agents use intelligent discovery methods to find trending stocks from news, earnings calendars, and market patterns.

## 🚀 Key Innovation: Zero Predetermined Lists

**Revolutionary Approach**: This system uses **NO hardcoded stock lists**. Instead, agents intelligently discover stocks through:

- **📰 News Analysis**: Extract trending stocks from financial news
- **📊 Earnings Discovery**: Scrape earnings calendars for upcoming catalysts
- **📈 Market Screening**: Detect volume spikes and momentum patterns
- **🧠 AI Synthesis**: Combine discoveries from multiple sources

This ensures recommendations are always **current, relevant, and market-responsive**.

## 🤖 Agent Architecture

### **WebSearchAgent** - News-Driven Discovery
```python
# Scrapes live financial news from:
- Yahoo Finance
- MarketWatch  
- CNBC

# Uses GPT-4 to extract:
- Companies with positive momentum
- Earnings beats and upgrades
- M&A activity and breakthrough news
- Sector trends and market themes
```

**Key Features:**
- Real-time news scraping with BeautifulSoup4
- GPT-4 powered stock symbol extraction
- Sentiment analysis and market context
- **Zero predetermined lists** - pure news discovery

### **EarningsAgent** - Catalyst Discovery
```python
# Dynamic discovery methods:
- _search_earnings_calendar()      # Scrape Yahoo Finance earnings
- _discover_by_sector_momentum()   # Find hot sectors via ETF analysis
- _discover_by_options_activity()  # Unusual options volume (planned)
```

**Key Features:**
- Live earnings calendar scraping
- Sector momentum analysis via ETFs (XLK, XLF, XLV, etc.)
- Market cap and volume validation (>$1B, >100K volume)
- **No predetermined candidates** - pure calendar discovery

### **MarketAnalysisAgent** - Technical Screening
```python
# Screening methods (planned for advanced data feeds):
- _screen_by_volume_leaders()      # Unusual volume activity
- _screen_by_momentum()            # Technical breakout patterns
- _screen_by_institutional_activity()  # Smart money flow
```

**Key Features:**
- Market index analysis (S&P 500, NASDAQ, Russell 2000)
- Sector ETF momentum tracking
- Technical indicator calculation (RSI, moving averages)
- **Pure screening approach** - no stock universe limits

### **RecommendationSynthesizer** - Pure Synthesis
```python
# Synthesis only - NO independent discovery:
- Combines discoveries from other agents
- Calculates composite scores (momentum + fundamentals + news)
- Generates AI-powered reasoning
- Creates final ranked recommendations
```

**Key Features:**
- Multi-factor scoring algorithm
- GPT-4 generated investment reasoning
- Risk assessment and sector diversification
- **Zero fallback lists** - relies purely on agent discoveries

## 🔧 Setup & Installation

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure API Keys
Create `config.yml`:
```yaml
openai:
  api_key: "your-openai-api-key-here"
  model: "gpt-4"
```

### 3. Start Server
```bash
python -m uvicorn api:app --host 127.0.0.1 --port 8000 --reload
```

## 📊 API Endpoints

### Stock Recommendations
- **GET** `/stock-recommendations` - Get AI-generated recommendations
- **POST** `/stock-recommendations` - Custom parameters

### Chart Data  
- **GET** `/stock-chart/{symbol}` - Historical data with moving averages
- **POST** `/stock-chart` - Chart data with custom timeframes

### Health Check
- **GET** `/` - Server health status

## 📋 Response Format

### Stock Recommendations
```json
{
  "success": true,
  "timestamp": "2024-01-01T12:00:00",
  "execution_time_seconds": 45.2,
  "recommendations": [
    {
      "rank": 1,
      "symbol": "AAPL",
      "company_name": "Apple Inc.",
      "sector": "Technology",
      "current_price": 175.43,
      "month_change": 5.2,
      "change_direction": "up",
      "recommendation": "Strong Buy",
      "ai_score": 95,
      "reasoning": "Strong earnings beat with positive analyst upgrades...",
      "risk_level": "Low",
      "pe_ratio": 28.5
    }
  ],
  "market_context": {
    "sentiment": "bullish",
    "trending_topics": ["AI revolution", "Tech earnings", "Fed policy"],
    "methodology": "Dynamic multi-agent discovery",
    "agents_used": ["WebSearch", "Earnings", "MarketAnalysis"]
  }
}
```

### Chart Data
```json
{
  "symbol": "AAPL",
  "timeframe": "1Y", 
  "data": [
    {
      "date": "2024-01-01",
      "open": 180.0,
      "high": 185.0,
      "low": 175.0,
      "close": 182.0,
      "volume": 50000000,
      "ma_20": 178.5,
      "ma_50": 175.2,
      "ma_200": 172.8
    }
  ],
  "include_moving_averages": true
}
```

## ⚡ Performance Features

- **Parallel Agent Execution**: All agents run simultaneously
- **Intelligent Caching**: Reduce redundant API calls
- **Graceful Degradation**: System works even if individual agents fail
- **Timeout Protection**: Prevents hanging requests
- **Error Recovery**: Comprehensive exception handling

## 🔄 Agent Communication Flow

```
1. WebSearchAgent     → Discovers trending stocks from news
         ↓
2. EarningsAgent      → Gets web discoveries + earnings calendar stocks  
         ↓
3. MarketAnalysisAgent → Gets previous discoveries + technical analysis
         ↓  
4. RecommendationSynthesizer → Scores and ranks ALL discovered stocks
```

**Key Principle**: Each agent passes its discoveries to the next, creating a **cumulative intelligence system** with no predetermined constraints.

## 🛠️ Dependencies

### Core Framework
- **FastAPI** - High-performance web framework
- **OpenAI** - GPT-4 integration for analysis
- **yfinance** - Real-time stock market data

### Data & Analysis
- **aiohttp** - Async web scraping
- **BeautifulSoup4** - HTML parsing for news
- **pandas/numpy** - Data manipulation and analysis
- **python-dateutil** - Date handling

### Utilities
- **pyyaml** - Configuration management
- **asyncio** - Asynchronous operations

## 🔍 Development

### Adding New Agents
1. Extend `BaseAgent` class:
```python
class NewAgent(BaseAgent):
    def __init__(self):
        super().__init__("NewAgent", "Description")
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        # Your discovery logic here
        return {"new_discoveries": [...]}
```

2. Add to orchestrator in `stock_recommendation_service.py`

### Testing Individual Agents
```bash
# Test WebSearchAgent
python -c "from agents.web_search_agent import WebSearchAgent; agent = WebSearchAgent(); print(agent.execute({}))"

# Test full recommendation flow
curl http://localhost:8000/stock-recommendations
```

## 🔒 Security & Compliance

- **API Key Security**: Configuration files only, never in code
- **Rate Limiting**: Respectful API usage with delays
- **Input Validation**: Sanitized parameters and responses
- **Error Isolation**: Sensitive data never exposed in errors
- **CORS Configuration**: Proper frontend/backend communication

## 🎯 Discovery Quality Assurance

### Validation Pipeline
Every discovered stock must pass:
- **✅ Ticker Format**: 2-5 uppercase letters
- **✅ Market Cap**: Minimum $1B (configurable)
- **✅ Trading Volume**: Active daily volume (>100K)
- **✅ Price Validation**: Above penny stock threshold
- **✅ Data Availability**: Valid yfinance data

### Error Handling
- **Invalid tickers**: Silently filtered out
- **API failures**: Graceful degradation to other discovery methods
- **Empty discoveries**: System handles missing data elegantly
- **Timeout protection**: Prevents hanging on slow news sites

## 📈 Monitoring & Logging

- **Agent Performance**: Execution time tracking
- **Discovery Metrics**: Count of stocks found by each agent
- **Success Rates**: API call success monitoring
- **Error Tracking**: Comprehensive error logging

## ⚠️ Disclaimer

This system provides AI-generated stock analysis for educational and informational purposes only. The dynamic discovery system is designed to identify potential opportunities but does **not constitute financial advice**. 

**Always conduct your own research and consult with qualified financial professionals before making investment decisions.**

## 🚀 Future Enhancements

### Enhanced Discovery
- **Options Flow Integration**: Unusual options activity screening
- **Social Sentiment**: Reddit/Twitter trend analysis
- **Institutional Tracking**: 13F filing analysis
- **SEC Filing Alerts**: 8-K and 10-Q monitoring

### Advanced Analytics
- **Technical Screeners**: Volume, momentum, breakout patterns
- **Fundamental Screeners**: P/E, growth, debt ratios
- **Alternative Data**: Satellite imagery, credit card spending
- **Real-Time Feeds**: Professional market data integration

### Performance Optimization
- **Distributed Agents**: Scale across multiple servers
- **Caching Layers**: Redis for frequently accessed data
- **Database Integration**: PostgreSQL for historical analysis
- **WebSocket Streams**: Real-time price updates