# StockGPT Backend - Agentic Framework

## Overview

The StockGPT backend uses an advanced agentic framework with multiple specialized AI agents to generate intelligent stock recommendations. The system combines web search, market analysis, earnings research, and AI synthesis to provide data-driven investment insights.

## Architecture

### Agents
- **WebSearchAgent**: Searches financial news and analyzes market sentiment
- **MarketAnalysisAgent**: Analyzes market trends, technical indicators, and momentum
- **EarningsAgent**: Reviews earnings calendars and fundamental metrics
- **RecommendationSynthesizer**: Combines all data into final stock recommendations

### Features
- Real-time web scraping of financial news
- Technical analysis with RSI, moving averages, momentum indicators
- Fundamental analysis including P/E ratios, earnings growth, analyst recommendations
- AI-powered sentiment analysis and reasoning
- Parallel agent execution for performance
- Comprehensive error handling and fallbacks

## Setup

### 1. Install Dependencies
```bash
cd backend
python setup.py
```

Or manually:
```bash
pip install -r requirements.txt
```

### 2. Configure API Keys
Create `config.yml`:
```yaml
openai:
  api_key: "your-openai-api-key-here"
  model: "gpt-4"

newsapi:  # Optional
  api_key: "your-newsapi-key-here"
```

### 3. Run the Server
```bash
uvicorn api:app --reload --port 8000
```

## API Endpoints

### Stock Recommendations
- **GET** `/stock-recommendations` - Get AI-generated stock recommendations
- **POST** `/stock-recommendations` - Get recommendations with custom parameters

### Chat (Legacy)
- **POST** `/chat` - General financial Q&A

### Health Check
- **GET** `/` - Server health status

## Response Format

### Stock Recommendations Response
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
      "recommendation": "Strong Buy",
      "ai_score": 95,
      "reasoning": "Strong technical momentum with bullish market sentiment...",
      "risk_level": "Low"
    }
  ],
  "market_context": {
    "sentiment": "bullish",
    "trending_topics": ["AI", "Tech earnings", "Fed policy"],
    "volatility_level": "moderate"
  }
}
```

## Performance

- **Parallel Execution**: Agents run simultaneously for faster results
- **Caching**: Market data cached to reduce API calls
- **Error Handling**: Graceful fallbacks if individual agents fail
- **Timeout Protection**: Prevents hanging requests

## Dependencies

### Core Framework
- FastAPI - Web framework
- OpenAI - AI/LLM integration
- LangChain - Agent orchestration

### Data Sources
- yfinance - Stock market data
- aiohttp - Async web requests
- BeautifulSoup4 - Web scraping
- pandas/numpy - Data analysis

### Utilities
- pyyaml - Configuration
- python-dateutil - Date handling

## Development

### Adding New Agents
1. Create new agent class extending `BaseAgent`
2. Implement `execute()` method
3. Add to orchestrator in `stock_recommendation_service.py`

### Testing
```bash
# Test individual agents
python -m pytest tests/

# Test API endpoints
curl http://localhost:8000/stock-recommendations
```

## Security & Compliance

- API keys stored in config files (not in code)
- Rate limiting on external API calls
- Input validation and sanitization
- Error messages don't expose sensitive data

## Disclaimer

This system provides AI-generated stock recommendations for informational and educational purposes only. It does not constitute financial advice. Always conduct your own research and consult with qualified financial professionals before making investment decisions.