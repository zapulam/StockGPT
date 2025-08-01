import yfinance as yf
from typing import Dict, Any, List
from datetime import datetime
import asyncio
import json
from .base_agent import BaseAgent

class RecommendationSynthesizer(BaseAgent):
    """Main agent that synthesizes all information into stock recommendations"""
    
    def __init__(self, openai_client=None):
        super().__init__("RecommendationSynthesizer", "Synthesizes all agent data into stock recommendations")
        self.openai_client = openai_client
        
        # Dynamic stock discovery - no hardcoded lists!
        
    async def _discover_trending_stocks(self) -> List[str]:
        """Discover real, active stocks using yfinance market data"""
        try:
            self.log_info("Discovering real trending stocks from yfinance...")
            
            # Method 1: Get most active stocks from major ETFs
            active_stocks = []
            
            # Use major sector ETFs to find their most liquid holdings
            sector_etfs = [
                "SPY",   # S&P 500 ETF
                "QQQ",   # NASDAQ 100 ETF  
                "IWM",   # Russell 2000 ETF
                "VTI",   # Total Stock Market ETF
                "XLK",   # Technology Sector ETF
                "XLF",   # Financial Sector ETF
                "XLV",   # Healthcare Sector ETF
                "XLE",   # Energy Sector ETF
                "XLI",   # Industrial Sector ETF
                "XLY"    # Consumer Discretionary ETF
            ]
            
            # Method 2: Use known ticker patterns from real market structure
            # Get stocks by analyzing market index behavior and common patterns
            trending_candidates = await self._get_real_market_stocks()
            
            for symbol in trending_candidates:
                try:
                    ticker = yf.Ticker(symbol)
                    hist = ticker.history(period="5d")
                    info = ticker.info
                    
                    # Validate this is a real, active stock
                    if (len(hist) > 1 and 
                        info.get('marketCap', 0) > 1_000_000_000 and  # 1B+ market cap
                        hist['Volume'][-1] > 100_000):  # Minimum daily volume
                        
                        # Calculate activity metrics
                        momentum = (hist['Close'][-1] - hist['Close'][-2]) / hist['Close'][-2] * 100
                        volume_ratio = hist['Volume'][-1] / hist['Volume'].mean() if hist['Volume'].mean() > 0 else 1
                        
                        active_stocks.append({
                            'symbol': symbol,
                            'momentum': abs(momentum),  # Use absolute momentum for activity
                            'volume_ratio': volume_ratio,
                            'market_cap': info.get('marketCap', 0),
                            'volume': hist['Volume'][-1]
                        })
                        
                except Exception:
                    # Skip invalid symbols without logging errors
                    continue
            
            # Sort by activity (momentum + volume)
            active_stocks.sort(key=lambda x: (x['momentum'] + x['volume_ratio']), reverse=True)
            
            # Get top active stocks
            trending_stocks = [stock['symbol'] for stock in active_stocks[:15]]
            
            self.log_info(f"Discovered {len(trending_stocks)} real trending stocks: {trending_stocks}")
            
            return trending_stocks if len(trending_stocks) >= 5 else await self._get_fallback_actives()
            
        except Exception as e:
            self.log_error(f"Error discovering trending stocks: {e}")
            return await self._get_fallback_actives()
    
    async def _get_real_market_stocks(self) -> List[str]:
        """Get real stock symbols from verified market sources"""
        try:
            self.log_info("Discovering stocks from verified market sources...")
            candidates = []
            
            # Method 1: Extract holdings from major ETFs (real companies)
            major_etfs = ["SPY", "QQQ", "IWM", "VTI", "XLK", "XLF", "XLV"]
            
            for etf_symbol in major_etfs:
                try:
                    etf_ticker = yf.Ticker(etf_symbol)
                    # Get basic info to ensure ETF is active
                    etf_info = etf_ticker.info
                    if etf_info.get('totalAssets', 0) > 1_000_000_000:  # 1B+ in assets
                        # Note: yfinance doesn't provide holdings data directly
                        # So we'll use a different approach
                        self.log_info(f"ETF {etf_symbol} validated as active with ${etf_info.get('totalAssets', 0):,.0f} in assets")
                except Exception as e:
                    self.log_error(f"Failed to validate ETF {etf_symbol}: {e}")
                    continue
            
            # Method 2: Dynamically discover stocks - NO PREDETERMINED LISTS!
            # This agent should ONLY synthesize discoveries from other agents
            self.log_info("RecommendationSynthesizer does not discover stocks independently")
            # All stock discovery should come from other agents' analysis
            
            self.log_info(f"Validated {len(candidates)} real market stocks from verified sources")
            return candidates
            
        except Exception as e:
            self.log_error(f"Error discovering real market stocks: {e}")
            return []
    
    async def _get_fallback_actives(self) -> List[str]:
        """No fallback - force pure dynamic discovery"""
        try:
            self.log_warning("No predetermined fallback lists - system must rely on dynamic discovery")
            
            # Return empty list to force system to work with what other agents discover
            # This ensures we never rely on predetermined stock lists
            return []
            
        except Exception as e:
            self.log_error(f"Fallback method failed: {e}")
            return []
    
    async def _systematic_market_screening(self) -> List[str]:
        """No systematic screening with predetermined lists"""
        try:
            self.log_warning("Systematic screening disabled - system must use dynamic agent discoveries only")
            # Return empty to force reliance on other agents' discoveries
            return []
            
        except Exception as e:
            self.log_error(f"Systematic screening failed: {e}")
            return []
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Synthesize all agent data into final stock recommendations"""
        self.log_info("Starting stock recommendation synthesis")
        
        try:
            # Extract data from other agents
            web_data = context.get("web_search_results", {})
            market_data = context.get("market_analysis", {})
            earnings_data = context.get("earnings_analysis", {})
            
            # Generate stock scores
            stock_scores = await self._calculate_stock_scores(web_data, market_data, earnings_data)
            
            # Get top recommendations
            top_recommendations = await self._select_top_stocks(stock_scores, web_data, market_data, earnings_data)
            
            # Generate AI reasoning for each recommendation
            ai_reasoning = await self._generate_ai_reasoning(top_recommendations, web_data, market_data, earnings_data)
            
            # Create final recommendation list
            final_recommendations = await self._create_final_recommendations(top_recommendations, ai_reasoning)
            
            result = {
                "stock_recommendations": {
                    "recommendations": final_recommendations,
                    "market_context": self._create_market_context(web_data, market_data),
                    "methodology": self._get_methodology_summary(),
                    "timestamp": datetime.now().isoformat(),
                    "disclaimer": "These recommendations are for informational purposes only and do not constitute financial advice."
                }
            }
            
            self.log_info(f"Generated {len(final_recommendations)} stock recommendations")
            return result
            
        except Exception as e:
            self.log_error(f"Recommendation synthesis failed: {str(e)}")
            return {"recommendation_error": str(e)}
    
    async def _calculate_stock_scores(self, web_data: Dict, market_data: Dict, earnings_data: Dict) -> Dict[str, float]:
        """Calculate composite scores for stocks based on all available data"""
        stock_scores = {}
        
        # Get momentum stocks from market analysis
        momentum_stocks = market_data.get("momentum_stocks", [])
        momentum_symbols = {stock["symbol"]: stock["momentum_score"] for stock in momentum_stocks}
        
        # Get fundamental analysis data
        fundamental_stocks = earnings_data.get("fundamental_analysis", {}).get("strong_fundamental_stocks", [])
        fundamental_symbols = {stock["symbol"]: stock["score"] for stock in fundamental_stocks}
        
        # Get analyst recommendations
        analyst_recs = earnings_data.get("analyst_recommendations", {}).get("strong_buy_stocks", [])
        analyst_symbols = {stock["symbol"]: stock["upside_potential"] for stock in analyst_recs}
        
        # Get trending topics for sector boost
        trending_topics = web_data.get("trending_topics", [])
        
        # CRITICAL: Get stocks discovered by other agents (NO independent discovery!)
        all_discovered_stocks = []
        
        # Get stocks from WebSearchAgent
        web_trending_stocks = web_data.get("trending_stocks", [])
        if web_trending_stocks:
            all_discovered_stocks.extend(web_trending_stocks)
            self.log_info(f"Got {len(web_trending_stocks)} stocks from WebSearchAgent: {web_trending_stocks}")
        
        # Get stocks from EarningsAgent (extract symbols from upcoming earnings)
        upcoming_earnings = earnings_data.get("upcoming_earnings", [])
        if upcoming_earnings:
            # Extract symbols from earnings data
            earnings_symbols = [earning.get("symbol") for earning in upcoming_earnings if earning.get("symbol")]
            all_discovered_stocks.extend(earnings_symbols)
            self.log_info(f"Got {len(earnings_symbols)} stocks from EarningsAgent: {earnings_symbols}")
        
        # Get stocks from MarketAnalysisAgent
        market_momentum_stocks = market_data.get("momentum_stocks", [])
        if market_momentum_stocks:
            # Extract symbols from momentum stock objects
            market_symbols = [stock.get("symbol") for stock in market_momentum_stocks if stock.get("symbol")]
            all_discovered_stocks.extend(market_symbols)
            self.log_info(f"Got {len(market_symbols)} stocks from MarketAnalysisAgent: {market_symbols}")
        
        # Remove duplicates and clean up
        unique_stocks = list(set(all_discovered_stocks))
        self.log_info(f"Total unique stocks discovered by agents: {len(unique_stocks)} - {unique_stocks}")
        
        # If no stocks discovered, log warning
        if not unique_stocks:
            self.log_warning("No stocks discovered by any agent - check agent discovery methods")
            return {}
        
        # Calculate scores for each discovered stock
        for symbol in unique_stocks:
            score = 0
            
            # Momentum score (0-4 points)
            if symbol in momentum_symbols:
                score += min(momentum_symbols[symbol], 4)
            
            # Fundamental score (0-6 points)
            if symbol in fundamental_symbols:
                score += min(fundamental_symbols[symbol], 6)
            
            # Analyst score (0-3 points based on upside potential)
            if symbol in analyst_symbols:
                upside = analyst_symbols[symbol]
                if upside > 30:
                    score += 3
                elif upside > 20:
                    score += 2
                elif upside > 10:
                    score += 1
            
            # Sector/trend boost (0-2 points)
            try:
                ticker = yf.Ticker(symbol)
                info = ticker.info
                sector = info.get("sector", "").lower()
                
                for topic in trending_topics:
                    if any(keyword in topic.lower() for keyword in [sector, symbol.lower()]):
                        score += 1
                        break
            except:
                pass
            
            # Market sentiment boost/penalty (±1 point)
            market_sentiment = web_data.get("market_sentiment", "neutral")
            if market_sentiment == "bullish":
                score += 1
            elif market_sentiment == "bearish":
                score -= 1
            
            stock_scores[symbol] = score
        
        return stock_scores
    
    async def _select_top_stocks(self, stock_scores: Dict[str, float], web_data: Dict, market_data: Dict, earnings_data: Dict) -> List[Dict[str, Any]]:
        """Select top 10 stocks based on scores and additional criteria"""
        
        # Sort stocks by score
        sorted_stocks = sorted(stock_scores.items(), key=lambda x: x[1], reverse=True)
        
        top_stocks = []
        sectors_included = set()
        
        for symbol, score in sorted_stocks:
            if len(top_stocks) >= 10:
                break
            
            if score < 3:  # Minimum score threshold
                continue
            
            try:
                # Get current stock data
                ticker = yf.Ticker(symbol)
                info = ticker.info
                hist = ticker.history(period="1mo")
                
                if hist.empty:
                    continue
                
                sector = info.get("sector", "Unknown")
                
                # Limit to 2 stocks per sector for diversification
                sector_count = sum(1 for stock in top_stocks if stock.get("sector") == sector)
                if sector_count >= 2:
                    continue
                
                current_price = float(hist["Close"][-1])
                month_change = ((current_price - hist["Close"][0]) / hist["Close"][0]) * 100
                
                stock_info = {
                    "symbol": symbol,
                    "company_name": info.get("longName", symbol),
                    "sector": sector,
                    "current_price": current_price,
                    "month_change": month_change,
                    "market_cap": info.get("marketCap", 0),
                    "composite_score": score,
                    "pe_ratio": info.get("trailingPE"),
                    "recommendation_strength": self._get_recommendation_strength(score)
                }
                
                top_stocks.append(stock_info)
                sectors_included.add(sector)
                
            except Exception as e:
                self.log_error(f"Failed to get data for {symbol}: {str(e)}")
                continue
        
        return top_stocks
    
    async def _generate_ai_reasoning(self, top_stocks: List[Dict], web_data: Dict, market_data: Dict, earnings_data: Dict) -> Dict[str, str]:
        """Generate AI reasoning for each stock recommendation"""
        if not self.openai_client:
            return {stock["symbol"]: "AI reasoning not available" for stock in top_stocks}
        
        reasoning = {}
        
        # Create context summary
        context_summary = self._create_analysis_context(web_data, market_data, earnings_data)
        
        for stock in top_stocks:
            try:
                stock_context = f"""
                Stock: {stock['symbol']} ({stock['company_name']})
                Sector: {stock['sector']}
                Current Price: ${stock['current_price']:.2f}
                1-Month Change: {stock['month_change']:.1f}%
                Composite Score: {stock['composite_score']:.1f}
                P/E Ratio: {stock.get('pe_ratio', 'N/A')}
                """
                
                response = await asyncio.to_thread(
                    self.openai_client.chat.completions.create,
                    model="gpt-4",
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a financial analyst providing concise reasoning for stock recommendations. Keep responses to 2-3 sentences highlighting key factors."
                        },
                        {
                            "role": "user",
                            "content": f"""
                            Based on the following market analysis and stock data, provide a brief reasoning for why {stock['symbol']} is recommended:
                            
                            Market Context:
                            {context_summary}
                            
                            Stock Details:
                            {stock_context}
                            
                            Provide 2-3 sentences explaining why this stock is attractive for investment.
                            """
                        }
                    ]
                )
                
                reasoning[stock["symbol"]] = response.choices[0].message.content.strip()
                
            except Exception as e:
                self.log_error(f"Failed to generate reasoning for {stock['symbol']}: {str(e)}")
                reasoning[stock["symbol"]] = f"Strong technical and fundamental indicators suggest {stock['symbol']} has attractive upside potential."
        
        return reasoning
    
    async def _create_final_recommendations(self, top_stocks: List[Dict], ai_reasoning: Dict[str, str]) -> List[Dict[str, Any]]:
        """Create final formatted recommendations"""
        recommendations = []
        
        for i, stock in enumerate(top_stocks, 1):
            recommendation = {
                "rank": i,
                "symbol": stock["symbol"],
                "company_name": stock["company_name"],
                "sector": stock["sector"],
                "current_price": stock["current_price"],
                "month_change": stock["month_change"],
                "change_direction": "up" if stock["month_change"] > 0 else "down",
                "market_cap": stock["market_cap"],
                "recommendation": stock["recommendation_strength"],
                "ai_score": min(int(stock["composite_score"] * 10), 100),
                "reasoning": ai_reasoning.get(stock["symbol"], "Strong fundamental and technical indicators."),
                "pe_ratio": stock.get("pe_ratio"),
                "risk_level": self._assess_risk_level(stock)
            }
            
            recommendations.append(recommendation)
        
        return recommendations
    
    def _create_market_context(self, web_data: Dict, market_data: Dict) -> Dict[str, Any]:
        """Create market context summary"""
        return {
            "market_sentiment": web_data.get("market_sentiment", "neutral"),
            "trending_topics": web_data.get("trending_topics", [])[:5],
            "volatility_level": market_data.get("volatility_metrics", {}).get("volatility_level", "moderate"),
            "top_sectors": market_data.get("sector_analysis", {}).get("top_performing_sectors", [])[:3]
        }
    
    def _create_analysis_context(self, web_data: Dict, market_data: Dict, earnings_data: Dict) -> str:
        """Create context summary for AI reasoning"""
        sentiment = web_data.get("market_sentiment", "neutral")
        volatility = market_data.get("volatility_metrics", {}).get("volatility_level", "moderate")
        trending = ", ".join(web_data.get("trending_topics", [])[:3])
        
        return f"Market sentiment is {sentiment} with {volatility} volatility. Trending topics include: {trending}."
    
    def _get_recommendation_strength(self, score: float) -> str:
        """Convert numeric score to recommendation strength"""
        if score >= 8:
            return "Strong Buy"
        elif score >= 6:
            return "Buy"
        elif score >= 4:
            return "Moderate Buy"
        else:
            return "Hold"
    
    def _assess_risk_level(self, stock: Dict) -> str:
        """Assess risk level based on stock characteristics"""
        market_cap = stock.get("market_cap", 0)
        month_change = abs(stock.get("month_change", 0))
        
        if market_cap > 100_000_000_000:  # >$100B
            if month_change < 10:
                return "Low"
            else:
                return "Medium"
        elif market_cap > 10_000_000_000:  # >$10B
            return "Medium"
        else:
            return "High"
    
    def _get_methodology_summary(self) -> str:
        """Get methodology summary"""
        return ("Recommendations based on momentum analysis, fundamental metrics, "
                "analyst sentiment, market trends, and current news sentiment. "
                "Scores combine technical indicators, earnings data, and market context.")