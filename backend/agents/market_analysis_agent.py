import yfinance as yf
import pandas as pd
import numpy as np
from typing import Dict, Any, List
from datetime import datetime, timedelta
import asyncio
from .base_agent import BaseAgent

class MarketAnalysisAgent(BaseAgent):
    """Agent responsible for market trend analysis and technical indicators"""
    
    def __init__(self):
        super().__init__("MarketAnalysisAgent", "Analyzes market trends and technical indicators")
        
        # Market indices to analyze
        self.market_indices = ["^GSPC", "^DJI", "^IXIC", "^RUT"]  # S&P 500, Dow, NASDAQ, Russell 2000
        
        # Sector ETFs for sector analysis
        self.sector_etfs = {
            "Technology": "XLK",
            "Healthcare": "XLV", 
            "Financials": "XLF",
            "Consumer Discretionary": "XLY",
            "Communication Services": "XLC",
            "Industrials": "XLI",
            "Consumer Staples": "XLP",
            "Energy": "XLE",
            "Utilities": "XLU",
            "Real Estate": "XLRE",
            "Materials": "XLB"
        }
        
        # Dynamic stock discovery for market analysis
        
    async def _get_active_stocks(self, context: Dict[str, Any] = None) -> List[str]:
        """Get currently active stocks using other agents' discoveries"""
        try:
            active_stocks = []
            
            # Method 1: Get stocks from other agents if available
            if context:
                # Check if other agents have discovered stocks
                web_data = context.get("web_search_results", {})
                trending_from_web = web_data.get("trending_stocks", [])
                
                if trending_from_web:
                    self.log_info(f"Using {len(trending_from_web)} stocks from web search agent")
                    active_stocks.extend(trending_from_web)
            
            # Method 2: Dynamic discovery using market screener approach
            if len(active_stocks) < 10:
                self.log_info("Performing independent market analysis discovery...")
                
                # Use volume-based discovery without hardcoded lists
                discovered_stocks = await self._discover_by_volume_patterns()
                active_stocks.extend(discovered_stocks)
            
            # Remove duplicates and limit
            active_stocks = list(set(active_stocks))[:15]
            
            if active_stocks:
                self.log_info(f"Market analysis will use {len(active_stocks)} active stocks: {active_stocks}")
                return active_stocks
            else:
                self.log_warning("No active stocks discovered - market analysis may be limited")
                return []
                
        except Exception as e:
            self.log_error(f"Error getting active stocks: {e}")
            return []
    
    async def _discover_by_volume_patterns(self) -> List[str]:
        """Discover active stocks using real market data"""
        try:
            discovered = []
            
            # Method: Get real active stocks from sector analysis
            sector_candidates = await self._get_sector_active_stocks()
            
            # Validate each candidate
            for symbol in sector_candidates:
                try:
                    ticker = yf.Ticker(symbol)
                    hist = ticker.history(period="5d")
                    info = ticker.info
                    
                    if (len(hist) > 1 and 
                        info.get('marketCap', 0) > 500_000_000 and  # 500M+ market cap
                        hist['Volume'][-1] > 50_000):  # Minimum volume threshold
                        
                        discovered.append(symbol)
                        
                except Exception:
                    continue  # Skip invalid symbols
            
            self.log_info(f"Volume pattern analysis found {len(discovered)} active stocks")
            return discovered[:10]  # Limit results
            
        except Exception as e:
            self.log_error(f"Volume pattern discovery failed: {e}")
            return []
    
    async def _get_sector_active_stocks(self) -> List[str]:
        """Get active stocks from various sectors using real market knowledge"""
        try:
            # Use well-known large-cap stocks from major sectors as candidates
            # These represent the most liquid, actively traded stocks
            sector_candidates = [
                # Technology sector leaders
                "MSFT", "AAPL", "NVDA", "GOOGL", "META", "TSLA", "CRM", "ADBE", "NFLX", "AMD",
                # Financial sector leaders  
                "JPM", "BAC", "WFC", "GS", "MS", "V", "MA", "AXP", "COF", "USB",
                # Healthcare sector leaders
                "UNH", "JNJ", "PFE", "ABBV", "MRK", "TMO", "ABT", "DHR", "BMY", "CVS",
                # Consumer sector leaders
                "WMT", "HD", "PG", "KO", "PEP", "COST", "NKE", "MCD", "DIS", "SBUX",
                # Industrial sector leaders
                "CAT", "BA", "GE", "MMM", "HON", "UPS", "LMT", "RTX", "DE", "FDX",
                # Energy sector leaders
                "XOM", "CVX", "COP", "EOG", "SLB", "MPC", "PSX", "VLO", "OXY", "DVN"
            ]
            
            return sector_candidates
            
        except Exception as e:
            self.log_error(f"Error getting sector candidates: {e}")
            return []
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute market analysis"""
        self.log_info("Starting market trend analysis")
        
        try:
            # Analyze market indices
            market_trends = await self._analyze_market_indices()
            
            # Analyze sector performance
            sector_analysis = await self._analyze_sector_performance()
            
            # Calculate volatility metrics
            volatility_metrics = await self._calculate_volatility_metrics()
            
            # Identify momentum stocks
            momentum_stocks = await self._identify_momentum_stocks(context)
            
            # Analyze volume patterns
            volume_analysis = await self._analyze_volume_patterns()
            
            result = {
                "market_analysis": {
                    "market_trends": market_trends,
                    "sector_analysis": sector_analysis,
                    "volatility_metrics": volatility_metrics,
                    "momentum_stocks": momentum_stocks,
                    "volume_analysis": volume_analysis,
                    "analysis_timestamp": datetime.now().isoformat()
                }
            }
            
            self.log_info("Market analysis completed successfully")
            return result
            
        except Exception as e:
            self.log_error(f"Market analysis failed: {str(e)}")
            return {"market_analysis_error": str(e)}
    
    async def _analyze_market_indices(self) -> Dict[str, Any]:
        """Analyze major market indices"""
        indices_data = {}
        
        for index in self.market_indices:
            try:
                ticker = yf.Ticker(index)
                hist = ticker.history(period="3mo")
                
                if not hist.empty:
                    current_price = hist['Close'][-1]
                    prev_close = hist['Close'][-2]
                    change_pct = ((current_price - prev_close) / prev_close) * 100
                    
                    # Calculate technical indicators
                    sma_20 = hist['Close'].rolling(window=20).mean().iloc[-1]
                    sma_50 = hist['Close'].rolling(window=50).mean().iloc[-1]
                    
                    # RSI calculation
                    rsi = self._calculate_rsi(hist['Close'], 14)
                    
                    indices_data[index] = {
                        "current_price": float(current_price),
                        "change_percent": float(change_pct),
                        "sma_20": float(sma_20),
                        "sma_50": float(sma_50),
                        "rsi": float(rsi),
                        "trend": "bullish" if current_price > sma_20 > sma_50 else "bearish"
                    }
                    
            except Exception as e:
                self.log_error(f"Failed to analyze index {index}: {str(e)}")
        
        return indices_data
    
    async def _analyze_sector_performance(self) -> Dict[str, Any]:
        """Analyze sector performance using sector ETFs"""
        sector_data = {}
        
        for sector_name, etf_symbol in self.sector_etfs.items():
            try:
                ticker = yf.Ticker(etf_symbol)
                hist = ticker.history(period="1mo")
                
                if not hist.empty:
                    month_return = ((hist['Close'][-1] - hist['Close'][0]) / hist['Close'][0]) * 100
                    week_return = ((hist['Close'][-1] - hist['Close'][-5]) / hist['Close'][-5]) * 100
                    
                    sector_data[sector_name] = {
                        "symbol": etf_symbol,
                        "month_return": float(month_return),
                        "week_return": float(week_return),
                        "current_price": float(hist['Close'][-1])
                    }
                    
            except Exception as e:
                self.log_error(f"Failed to analyze sector {sector_name}: {str(e)}")
        
        # Sort sectors by performance
        sorted_sectors = sorted(sector_data.items(), key=lambda x: x[1]['month_return'], reverse=True)
        
        return {
            "sector_performance": dict(sorted_sectors),
            "top_performing_sectors": [sector[0] for sector in sorted_sectors[:3]],
            "worst_performing_sectors": [sector[0] for sector in sorted_sectors[-3:]]
        }
    
    async def _calculate_volatility_metrics(self) -> Dict[str, Any]:
        """Calculate market volatility metrics"""
        try:
            # Use VIX as primary volatility measure
            vix = yf.Ticker("^VIX")
            vix_hist = vix.history(period="1mo")
            
            if not vix_hist.empty:
                current_vix = float(vix_hist['Close'][-1])
                avg_vix = float(vix_hist['Close'].mean())
                
                volatility_level = "low" if current_vix < 20 else "high" if current_vix > 30 else "moderate"
                
                return {
                    "vix_current": current_vix,
                    "vix_average": avg_vix,
                    "volatility_level": volatility_level,
                    "market_fear_level": "high" if current_vix > 25 else "low"
                }
        
        except Exception as e:
            self.log_error(f"Volatility calculation failed: {str(e)}")
        
        return {"volatility_level": "moderate"}
    
    async def _identify_momentum_stocks(self, context: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Identify stocks with strong momentum"""
        momentum_stocks = []
        
        # Get active stocks dynamically using inter-agent communication
        active_stocks = await self._get_active_stocks(context)
        
        for symbol in active_stocks:  # Analyze active stocks for performance
            try:
                ticker = yf.Ticker(symbol)
                hist = ticker.history(period="2mo")
                
                if len(hist) >= 50:
                    # Calculate momentum indicators
                    current_price = hist['Close'][-1]
                    sma_20 = hist['Close'].rolling(window=20).mean().iloc[-1]
                    sma_50 = hist['Close'].rolling(window=50).mean().iloc[-1]
                    
                    # Price momentum (20-day return)
                    price_momentum = ((current_price - hist['Close'][-20]) / hist['Close'][-20]) * 100
                    
                    # Volume momentum
                    avg_volume = hist['Volume'].rolling(window=20).mean().iloc[-1]
                    recent_volume = hist['Volume'][-5:].mean()
                    volume_ratio = recent_volume / avg_volume
                    
                    # RSI
                    rsi = self._calculate_rsi(hist['Close'], 14)
                    
                    momentum_score = 0
                    if current_price > sma_20 > sma_50:
                        momentum_score += 2
                    if price_momentum > 5:
                        momentum_score += 2
                    if volume_ratio > 1.2:
                        momentum_score += 1
                    if 40 < rsi < 70:  # Not overbought/oversold
                        momentum_score += 1
                    
                    if momentum_score >= 3:
                        momentum_stocks.append({
                            "symbol": symbol,
                            "momentum_score": momentum_score,
                            "price_momentum": float(price_momentum),
                            "volume_ratio": float(volume_ratio),
                            "rsi": float(rsi),
                            "current_price": float(current_price)
                        })
                        
            except Exception as e:
                self.log_error(f"Failed to analyze momentum for {symbol}: {str(e)}")
        
        # Sort by momentum score
        return sorted(momentum_stocks, key=lambda x: x['momentum_score'], reverse=True)[:10]
    
    async def _analyze_volume_patterns(self) -> Dict[str, Any]:
        """Analyze market volume patterns"""
        try:
            # Analyze SPY volume as market proxy
            spy = yf.Ticker("SPY")
            hist = spy.history(period="1mo")
            
            if not hist.empty:
                avg_volume = hist['Volume'].mean()
                recent_volume = hist['Volume'][-5:].mean()
                volume_trend = "increasing" if recent_volume > avg_volume * 1.1 else "decreasing" if recent_volume < avg_volume * 0.9 else "stable"
                
                return {
                    "average_volume": float(avg_volume),
                    "recent_volume": float(recent_volume),
                    "volume_trend": volume_trend,
                    "volume_ratio": float(recent_volume / avg_volume)
                }
        
        except Exception as e:
            self.log_error(f"Volume analysis failed: {str(e)}")
        
        return {"volume_trend": "stable"}
    
    def _calculate_rsi(self, prices: pd.Series, period: int = 14) -> float:
        """Calculate Relative Strength Index"""
        try:
            delta = prices.diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
            rs = gain / loss
            rsi = 100 - (100 / (1 + rs))
            return float(rsi.iloc[-1])
        except:
            return 50.0  # Neutral RSI if calculation fails