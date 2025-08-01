import openai
import yaml
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
from services.stock_recommendation_service import get_recommendation_service

class StockRecommendationRequest(BaseModel):
    use_parallel_execution: Optional[bool] = True
    include_market_context: Optional[bool] = True

class StockChartRequest(BaseModel):
    symbol: str
    period: Optional[str] = "1mo"  # 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
    interval: Optional[str] = "1d"  # 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo
    include_moving_averages: Optional[bool] = True

# Load configuration
with open('config.yml') as config:
    config_data = yaml.safe_load(config)
    openai_config = config_data['openai']

# Initialize OpenAI client for agentic framework
client = openai.OpenAI(api_key=openai_config['api_key'])

# Initialize FastAPI app
app = FastAPI(
    title="StockGPT API",
    description="Agentic AI framework for intelligent stock recommendations",
    version="2.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health():
    return {"message": "StockGPT API is running - Agentic Stock Recommendation System"}

@app.post("/stock-recommendations")
async def get_stock_recommendations(request: StockRecommendationRequest = None):
    """
    Generate AI-powered stock recommendations using agentic framework
    
    This endpoint uses multiple specialized agents to:
    - Search the web for financial news and market sentiment
    - Analyze market trends and technical indicators  
    - Review earnings calendars and fundamental metrics
    - Synthesize all data into top 10 stock recommendations
    """
    try:
        # Get the recommendation service
        recommendation_service = get_recommendation_service(client)
        
        # Use default request if none provided
        if request is None:
            request = StockRecommendationRequest()
        
        # Generate recommendations
        recommendations = await recommendation_service.generate_recommendations(
            use_parallel_execution=request.use_parallel_execution
        )
        
        return recommendations
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate recommendations: {str(e)}")

@app.get("/stock-recommendations")
async def get_stock_recommendations_simple():
    """
    Simple GET endpoint for stock recommendations (no request body needed)
    """
    try:
        recommendation_service = get_recommendation_service(client)
        recommendations = await recommendation_service.generate_recommendations()
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate recommendations: {str(e)}")

@app.post("/stock-chart")
async def get_stock_chart_data(request: StockChartRequest):
    """
    Get historical stock price data with optional moving averages
    
    Supports various timeframes and intervals for detailed chart analysis
    """
    try:
        # Fetch stock data using yfinance
        ticker = yf.Ticker(request.symbol)
        hist = ticker.history(period=request.period, interval=request.interval)
        
        if hist.empty:
            raise HTTPException(status_code=404, detail=f"No data found for symbol: {request.symbol}")
        
        # Convert to list of dictionaries for JSON response
        chart_data = []
        for index, row in hist.iterrows():
            data_point = {
                "date": index.strftime("%Y-%m-%d %H:%M:%S") if hasattr(index, 'strftime') else str(index),
                "timestamp": int(index.timestamp() * 1000) if hasattr(index, 'timestamp') else 0,
                "open": round(float(row['Open']), 2),
                "high": round(float(row['High']), 2),
                "low": round(float(row['Low']), 2),
                "close": round(float(row['Close']), 2),
                "volume": int(row['Volume']) if pd.notna(row['Volume']) else 0
            }
            chart_data.append(data_point)
        
        # Calculate moving averages if requested
        moving_averages = {}
        if request.include_moving_averages and len(chart_data) > 0:
            close_prices = [point['close'] for point in chart_data]
            
            # Always calculate MAs if we have any data - don't require minimum lengths
            ma_periods = [20, 50, 200]
            data_length = len(close_prices)
            
            print(f"🔍 DEBUG: Calculating MAs for {data_length} data points")
            print(f"🔍 DEBUG: include_moving_averages = {request.include_moving_averages}")
            print(f"🔍 DEBUG: Sample close prices: {close_prices[:5]}...")
            
            for period in ma_periods:
                ma_values = []
                valid_count = 0
                for i in range(len(close_prices)):
                    if i < period - 1:
                        ma_values.append(None)
                    else:
                        ma = sum(close_prices[i-period+1:i+1]) / period
                        ma_values.append(round(ma, 2))
                        valid_count += 1
                
                moving_averages[f"ma_{period}"] = ma_values
                print(f"🔍 DEBUG: MA{period} - {valid_count} valid values, sample: {[v for v in ma_values[-5:] if v is not None]}")
            
            print(f"🔍 DEBUG: Final moving_averages keys: {list(moving_averages.keys())}")
            print(f"🔍 DEBUG: MA20 length: {len(moving_averages.get('ma_20', []))}")
            print(f"🔍 DEBUG: Sample MA20 values: {[v for v in moving_averages.get('ma_20', [])[-10:] if v is not None]}")
        else:
            print(f"🔍 DEBUG: NOT calculating MAs - include_moving_averages: {request.include_moving_averages}, chart_data length: {len(chart_data)}")
        
        # Get current stock info
        info = ticker.info
        current_price = info.get('currentPrice', chart_data[-1]['close'] if chart_data else 0)
        previous_close = info.get('previousClose', 0)
        change = current_price - previous_close if previous_close else 0
        change_percent = (change / previous_close * 100) if previous_close else 0
        
        response = {
            "symbol": request.symbol.upper(),
            "company_name": info.get('longName', request.symbol),
            "current_price": round(float(current_price), 2),
            "previous_close": round(float(previous_close), 2),
            "change": round(float(change), 2),
            "change_percent": round(float(change_percent), 2),
            "period": request.period,
            "interval": request.interval,
            "data": chart_data,
            "moving_averages": moving_averages,
            "data_points": len(chart_data),
            "timestamp": datetime.now().isoformat()
        }
        
        print(f"🔍 DEBUG: FINAL Response moving_averages keys: {list(response['moving_averages'].keys())}")
        print(f"🔍 DEBUG: FINAL Response data length: {len(response['data'])}")
        print(f"🔍 DEBUG: FINAL Has MA data: {bool(response['moving_averages'])}")
        if response['moving_averages']:
            print(f"🔍 DEBUG: FINAL MA20 sample: {response['moving_averages'].get('ma_20', [])[-3:]}")
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch chart data: {str(e)}")

@app.get("/stock-chart/{symbol}")
async def get_stock_chart_data_simple(symbol: str, period: str = "1mo", interval: str = "1d"):
    """
    Simple GET endpoint for stock chart data (no request body needed)
    """
    request = StockChartRequest(symbol=symbol, period=period, interval=interval)
    return await get_stock_chart_data(request)
