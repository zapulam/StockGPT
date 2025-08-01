# 📈 StockGPT - AI-Powered Stock Analysis Platform

**StockGPT** is a modern web application that uses advanced multi-agent AI systems to provide intelligent stock market analysis and recommendations. The platform features a React frontend with interactive charts and a FastAPI backend powered by specialized AI agents that dynamically discover and analyze stocks based on real-time market conditions.

## 🚀 Features

### 🎯 **StockGPT Tab**
- **AI Stock Recommendations**: Get top 10 AI-curated stock picks with detailed analysis
- **Dynamic Discovery**: Agents discover trending stocks from news, earnings, and market conditions
- **Interactive Charts**: Stock price charts with timeline controls (1D, 1W, 1M, 3M, 1Y, 5Y)
- **Moving Averages**: Toggle MA20, MA50, MA200 with real-time calculation
- **AI Scoring**: Composite scores based on momentum, fundamentals, and news sentiment
- **Animated Loading**: Beautiful agent progress visualization during analysis

### 📊 **Analyze Tab**
- **In-Depth Analysis**: Detailed candlestick charts for individual stocks
- **Technical Indicators**: Advanced charting tools for technical analysis
- **Search Functionality**: Look up any stock for detailed analysis

### 📝 **Watchlist Tab**
- **Portfolio Tracking**: Save and monitor your favorite stocks
- **Real-Time Updates**: Live price updates and portfolio performance
- **Local Storage**: Persistent watchlist across sessions

## 🧱 Tech Stack

### Frontend
- **React 18** with modern hooks
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** for interactive charts
- **Lucide React** for icons
- **Vite** for fast development

### Backend
- **FastAPI** - High-performance Python API
- **Multi-Agent System** - Specialized AI agents for different analysis tasks
- **OpenAI GPT-4** - Natural language processing and reasoning
- **yFinance** - Real-time stock data
- **BeautifulSoup4** - Web scraping for news
- **Pandas/NumPy** - Data analysis

## 🤖 AI Agent Architecture

### **WebSearchAgent**
- Scrapes financial news from Yahoo Finance, MarketWatch, CNBC
- Extracts trending stock symbols from news articles using GPT-4
- Analyzes market sentiment and identifies investment opportunities
- **No predetermined lists** - discovers stocks dynamically from news

### **EarningsAgent**
- Scrapes earnings calendars for upcoming announcements
- Discovers earnings plays through sector momentum analysis
- Plans for options activity screening (earnings-related volume spikes)
- **Dynamic discovery** - finds stocks with upcoming catalysts

### **MarketAnalysisAgent**
- Screens for volume leaders and momentum patterns
- Analyzes sector rotation and technical indicators
- Plans institutional flow tracking
- **Pure screening approach** - no hardcoded stock lists

### **RecommendationSynthesizer**
- Combines discoveries from all other agents
- Calculates composite scores based on multiple factors
- Generates AI-powered reasoning for each recommendation
- **Pure synthesis** - only works with dynamically discovered stocks

## 🔧 Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/zapulam/StockGPT.git
cd StockGPT
```

### 2. Frontend Setup
```bash
npm install
npm run dev
```

### 3. Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

### 4. Configure API Keys
Create `backend/config.yml`:
```yaml
openai:
  api_key: "your-openai-api-key-here"
  model: "gpt-4"
```

### 5. Start Backend Server
```bash
cd backend
python -m uvicorn api:app --host 127.0.0.1 --port 8000 --reload
```

### 6. Access Application
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`

## 🎮 Usage

1. **Stock Recommendations**: Click "StockGPT" to get AI-curated stock picks
2. **Interactive Charts**: Use timeline controls and toggle moving averages
3. **Stock Analysis**: Switch to "Analyze" tab for in-depth chart analysis
4. **Build Watchlist**: Use "Watchlist" tab to track favorite stocks

## 🔄 Dynamic Discovery System

**Key Innovation**: StockGPT uses **zero predetermined stock lists**. Instead:

- **News-Driven**: Discovers stocks trending in financial news
- **Earnings-Based**: Finds companies with upcoming earnings catalysts  
- **Market-Responsive**: Adapts to current market conditions and sector rotation
- **Event-Driven**: Captures M&A targets, regulatory approvals, breakthrough news

This ensures recommendations are always **current, relevant, and market-responsive**.

## 📊 API Endpoints

- `GET/POST /stock-recommendations` - Get AI-generated stock recommendations
- `GET/POST /stock-chart/{symbol}` - Get historical chart data with moving averages
- `GET /` - Health check

## 🔮 Future Enhancements

- **Real-Time Data Feeds**: Integration with professional market data providers
- **Options Flow Analysis**: Unusual options activity screening
- **Social Sentiment**: Reddit/Twitter sentiment analysis
- **Backtesting Engine**: Strategy performance testing
- **Portfolio Analytics**: Risk analysis and optimization
- **Mobile App**: React Native mobile application

## ⚠️ Disclaimer

StockGPT provides AI-generated analysis for educational and informational purposes only. This is **not financial advice**. Always conduct your own research and consult with qualified financial professionals before making investment decisions.

## 🤝 Contributing

Pull requests are welcome! Areas for contribution:
- Additional data sources and APIs
- New agent types and analysis methods
- UI/UX improvements
- Performance optimizations
- Mobile responsiveness

## 📄 License

This project is open source. See LICENSE file for details.