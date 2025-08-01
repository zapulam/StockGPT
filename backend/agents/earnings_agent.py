import yfinance as yf
import pandas as pd
from typing import Dict, Any, List
from datetime import datetime, timedelta
import asyncio
import requests
from .base_agent import BaseAgent

class EarningsAgent(BaseAgent):
    """Agent responsible for earnings calendar and fundamental analysis"""
    
    def __init__(self):
        super().__init__("EarningsAgent", "Analyzes earnings calendar and fundamental metrics")
        
        # Dynamic earnings watchlist - no hardcoded stocks!
        
    async def _get_earnings_watchlist(self, context: Dict[str, Any] = None) -> List[str]:
        """Get dynamic watchlist from other agents or market discovery"""
        try:
            watchlist = []
            
            # Method 1: Use stocks discovered by other agents
            if context:
                # Get stocks from market analysis agent
                market_data = context.get("market_analysis", {})
                momentum_stocks = market_data.get("momentum_stocks", [])
                if momentum_stocks:
                    watchlist.extend([stock.get("symbol") for stock in momentum_stocks if stock.get("symbol")])
                    self.log_info(f"Using {len(momentum_stocks)} stocks from market analysis agent")
                
                # Get stocks from web search agent
                web_data = context.get("web_search_results", {})
                trending_stocks = web_data.get("trending_stocks", [])
                if trending_stocks:
                    watchlist.extend(trending_stocks)
                    self.log_info(f"Using {len(trending_stocks)} stocks from web search agent")
            
            # Method 2: Independent discovery if needed
            if len(watchlist) < 5:
                self.log_info("Performing independent earnings watchlist discovery...")
                discovered = await self._discover_earnings_candidates()
                watchlist.extend(discovered)
            
            # Remove duplicates and filter by market cap
            unique_watchlist = []
            seen = set()
            
            for symbol in watchlist:
                if symbol and symbol not in seen:
                    try:
                        ticker = yf.Ticker(symbol)
                        info = ticker.info
                        market_cap = info.get("marketCap", 0)
                        
                        # Only include large-cap stocks (>5B market cap) for earnings analysis
                        if market_cap > 5_000_000_000:
                            unique_watchlist.append(symbol)
                            seen.add(symbol)
                            
                    except Exception:
                        continue
            
            final_watchlist = unique_watchlist[:15]  # Limit to 15 stocks
            
            if final_watchlist:
                self.log_info(f"Earnings analysis will track {len(final_watchlist)} stocks: {final_watchlist}")
                return final_watchlist
            else:
                self.log_warning("No stocks discovered for earnings analysis")
                return []
                
        except Exception as e:
            self.log_error(f"Error building earnings watchlist: {e}")
            return []
    
    async def _discover_earnings_candidates(self) -> List[str]:
        """Dynamically discover stocks with upcoming earnings using web research"""
        try:
            self.log_info("Dynamically discovering stocks with upcoming earnings...")
            
            # Method 1: Web search for earnings calendar
            earnings_candidates = await self._search_earnings_calendar()
            
            # Method 2: If web search fails, use sector rotation analysis
            if len(earnings_candidates) < 5:
                earnings_candidates.extend(await self._discover_by_sector_momentum())
            
            # Method 3: Volume and options activity spike detection
            if len(earnings_candidates) < 10:
                earnings_candidates.extend(await self._discover_by_options_activity())
            
            # Remove duplicates
            unique_candidates = list(set(earnings_candidates))
            
            self.log_info(f"Dynamic earnings discovery found {len(unique_candidates)} candidates")
            return unique_candidates[:15]
            
        except Exception as e:
            self.log_error(f"Dynamic earnings candidate discovery failed: {e}")
            return []
    
    async def _search_earnings_calendar(self) -> List[str]:
        """Search for stocks with upcoming earnings announcements"""
        try:
            # Use financial websites to find upcoming earnings
            import aiohttp
            from bs4 import BeautifulSoup
            
            earnings_stocks = []
            
            # Try to scrape Yahoo Finance earnings calendar
            async with aiohttp.ClientSession() as session:
                try:
                    url = "https://finance.yahoo.com/calendar/earnings"
                    async with session.get(url, timeout=10) as response:
                        if response.status == 200:
                            html = await response.text()
                            soup = BeautifulSoup(html, 'html.parser')
                            
                            # Look for ticker symbols in earnings calendar
                            import re
                            # Find potential ticker symbols (2-5 uppercase letters)
                            text_content = soup.get_text()
                            potential_tickers = re.findall(r'\b[A-Z]{2,5}\b', text_content)
                            
                            # Filter to reasonable tickers and validate
                            for ticker in potential_tickers[:50]:  # Check first 50 found
                                try:
                                    # Quick validation
                                    yf_ticker = yf.Ticker(ticker)
                                    info = yf_ticker.info
                                    if info.get('marketCap', 0) > 1_000_000_000:  # 1B+ market cap
                                        earnings_stocks.append(ticker)
                                        if len(earnings_stocks) >= 10:
                                            break
                                except:
                                    continue
                                    
                except Exception as e:
                    self.log_error(f"Error scraping earnings calendar: {e}")
            
            self.log_info(f"Found {len(earnings_stocks)} stocks from earnings calendar search")
            return earnings_stocks
            
        except Exception as e:
            self.log_error(f"Earnings calendar search failed: {e}")
            return []
    
    async def _discover_by_sector_momentum(self) -> List[str]:
        """Discover stocks in sectors with strong momentum"""
        try:
            # Analyze sector ETFs to find strongest sectors
            sector_etfs = {
                "XLK": "Technology",
                "XLF": "Financials", 
                "XLV": "Healthcare",
                "XLY": "Consumer Discretionary",
                "XLE": "Energy",
                "XLI": "Industrials"
            }
            
            strong_sectors = []
            for etf, sector in sector_etfs.items():
                try:
                    ticker = yf.Ticker(etf)
                    hist = ticker.history(period="1mo")
                    if len(hist) > 10:
                        # Calculate momentum
                        momentum = (hist['Close'][-1] - hist['Close'][0]) / hist['Close'][0] * 100
                        if momentum > 2:  # More than 2% gain in past month
                            strong_sectors.append(sector)
                except:
                    continue
            
            # For strong sectors, we would normally need a stock screener API
            # As a fallback, return empty list to force other discovery methods
            self.log_info(f"Identified strong sectors: {strong_sectors}")
            return []  # Would need screener API to get stocks by sector
            
        except Exception as e:
            self.log_error(f"Sector momentum discovery failed: {e}")
            return []
    
    async def _discover_by_options_activity(self) -> List[str]:
        """Discover stocks with unusual options activity (earnings plays)"""
        try:
            # This would require options data API which we don't have
            # Return empty list to keep discovery purely dynamic
            self.log_info("Options activity discovery requires specialized data feed")
            return []
            
        except Exception as e:
            self.log_error(f"Options activity discovery failed: {e}")
            return []
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute earnings analysis"""
        self.log_info("Starting earnings and fundamental analysis")
        
        try:
            # Get upcoming earnings
            upcoming_earnings = await self._get_upcoming_earnings(context)
            
            # Analyze fundamental metrics
            fundamental_analysis = await self._analyze_fundamentals(context)
            
            # Identify earnings surprises potential
            earnings_insights = await self._analyze_earnings_trends(context)
            
            # Get analyst recommendations
            analyst_data = await self._get_analyst_recommendations(context)
            
            result = {
                "earnings_analysis": {
                    "upcoming_earnings": upcoming_earnings,
                    "fundamental_analysis": fundamental_analysis,
                    "earnings_insights": earnings_insights,
                    "analyst_recommendations": analyst_data,
                    "analysis_timestamp": datetime.now().isoformat()
                }
            }
            
            self.log_info(f"Analyzed {len(upcoming_earnings)} upcoming earnings")
            return result
            
        except Exception as e:
            self.log_error(f"Earnings analysis failed: {str(e)}")
            return {"earnings_analysis_error": str(e)}
    
    async def _get_upcoming_earnings(self, context: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get upcoming earnings dates for watchlist stocks"""
        upcoming_earnings = []
        current_date = datetime.now()
        
        # Get dynamic watchlist using inter-agent communication
        watchlist = await self._get_earnings_watchlist(context)
        
        for symbol in watchlist:  # Analyze watchlist stocks
            try:
                ticker = yf.Ticker(symbol)
                info = ticker.info
                
                # Get earnings date if available
                earnings_date = info.get('earningsDate')
                next_earnings = info.get('nextEarningsDate')
                
                # Use the most recent earnings date info
                target_date = earnings_date or next_earnings
                
                if target_date:
                    # Handle different date formats
                    if isinstance(target_date, list) and target_date:
                        target_date = target_date[0]
                    
                    if isinstance(target_date, (int, float)):
                        earnings_datetime = datetime.fromtimestamp(target_date)
                    else:
                        continue
                    
                    # Only include earnings within next 30 days
                    days_until = (earnings_datetime - current_date).days
                    if 0 <= days_until <= 30:
                        # Get additional company info
                        market_cap = info.get('marketCap', 0)
                        sector = info.get('sector', 'Unknown')
                        
                        upcoming_earnings.append({
                            "symbol": symbol,
                            "company_name": info.get('longName', symbol),
                            "earnings_date": earnings_datetime.isoformat(),
                            "days_until_earnings": days_until,
                            "market_cap": market_cap,
                            "sector": sector,
                            "current_price": info.get('currentPrice', 0)
                        })
                        
            except Exception as e:
                self.log_error(f"Failed to get earnings for {symbol}: {str(e)}")
        
        # Sort by earnings date
        return sorted(upcoming_earnings, key=lambda x: x['days_until_earnings'])
    
    async def _analyze_fundamentals(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze fundamental metrics for top stocks"""
        fundamental_data = {}
        strong_fundamentals = []
        
        # Get dynamic watchlist using inter-agent communication
        watchlist = await self._get_earnings_watchlist(context)
        
        for symbol in watchlist:  # Analyze subset for performance
            try:
                ticker = yf.Ticker(symbol)
                info = ticker.info
                
                # Key fundamental metrics
                pe_ratio = info.get('trailingPE')
                peg_ratio = info.get('pegRatio')
                price_to_book = info.get('priceToBook')
                debt_to_equity = info.get('debtToEquity')
                roe = info.get('returnOnEquity')
                profit_margin = info.get('profitMargins')
                revenue_growth = info.get('revenueGrowth')
                
                # Calculate fundamental score
                score = 0
                
                # P/E ratio scoring (lower is better, but not too low)
                if pe_ratio and 10 < pe_ratio < 25:
                    score += 2
                elif pe_ratio and 5 < pe_ratio <= 10:
                    score += 1
                
                # PEG ratio scoring (lower is better)
                if peg_ratio and peg_ratio < 1:
                    score += 2
                elif peg_ratio and peg_ratio < 1.5:
                    score += 1
                
                # ROE scoring (higher is better)
                if roe and roe > 0.15:
                    score += 2
                elif roe and roe > 0.10:
                    score += 1
                
                # Profit margin scoring
                if profit_margin and profit_margin > 0.15:
                    score += 2
                elif profit_margin and profit_margin > 0.10:
                    score += 1
                
                # Revenue growth scoring
                if revenue_growth and revenue_growth > 0.10:
                    score += 2
                elif revenue_growth and revenue_growth > 0.05:
                    score += 1
                
                # Debt-to-equity scoring (lower is better)
                if debt_to_equity and debt_to_equity < 0.3:
                    score += 1
                elif debt_to_equity and debt_to_equity < 0.5:
                    score += 0.5
                
                fundamental_data[symbol] = {
                    "pe_ratio": pe_ratio,
                    "peg_ratio": peg_ratio,
                    "price_to_book": price_to_book,
                    "debt_to_equity": debt_to_equity,
                    "roe": roe,
                    "profit_margin": profit_margin,
                    "revenue_growth": revenue_growth,
                    "fundamental_score": score
                }
                
                # Track stocks with strong fundamentals
                if score >= 6:
                    strong_fundamentals.append({
                        "symbol": symbol,
                        "score": score,
                        "highlights": self._get_fundamental_highlights(fundamental_data[symbol])
                    })
                    
            except Exception as e:
                self.log_error(f"Failed to analyze fundamentals for {symbol}: {str(e)}")
        
        return {
            "detailed_fundamentals": fundamental_data,
            "strong_fundamental_stocks": sorted(strong_fundamentals, key=lambda x: x['score'], reverse=True)[:10]
        }
    
    async def _analyze_earnings_trends(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze earnings trends and surprises"""
        earnings_insights = {
            "positive_guidance_stocks": [],
            "earnings_beat_history": [],
            "high_earnings_growth": []
        }
        
        # Get dynamic watchlist using inter-agent communication
        watchlist = await self._get_earnings_watchlist(context)
        
        for symbol in watchlist[:10]:  # Analyze subset
            try:
                ticker = yf.Ticker(symbol)
                info = ticker.info
                
                # Earnings growth metrics
                earnings_growth = info.get('earningsGrowth')
                quarterly_earnings_growth = info.get('earningsQuarterlyGrowth')
                
                if earnings_growth and earnings_growth > 0.15:
                    earnings_insights["high_earnings_growth"].append({
                        "symbol": symbol,
                        "earnings_growth": earnings_growth,
                        "quarterly_growth": quarterly_earnings_growth
                    })
                    
            except Exception as e:
                self.log_error(f"Failed to analyze earnings trends for {symbol}: {str(e)}")
        
        return earnings_insights
    
    async def _get_analyst_recommendations(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Get analyst recommendations and price targets"""
        analyst_data = {
            "strong_buy_stocks": [],
            "high_price_targets": [],
            "upgraded_stocks": []
        }
        
        # Get dynamic watchlist using inter-agent communication
        watchlist = await self._get_earnings_watchlist(context)
        
        for symbol in watchlist:
            try:
                ticker = yf.Ticker(symbol)
                info = ticker.info
                
                # Get recommendation data
                recommendation = info.get('recommendationKey', '')
                target_price = info.get('targetMeanPrice')
                current_price = info.get('currentPrice')
                
                # Calculate upside potential
                if target_price and current_price and current_price > 0:
                    upside_potential = ((target_price - current_price) / current_price) * 100
                    
                    if recommendation in ['strong_buy', 'buy'] and upside_potential > 15:
                        analyst_data["strong_buy_stocks"].append({
                            "symbol": symbol,
                            "recommendation": recommendation,
                            "target_price": target_price,
                            "current_price": current_price,
                            "upside_potential": upside_potential
                        })
                    
                    if upside_potential > 25:
                        analyst_data["high_price_targets"].append({
                            "symbol": symbol,
                            "upside_potential": upside_potential,
                            "target_price": target_price,
                            "current_price": current_price
                        })
                        
            except Exception as e:
                self.log_error(f"Failed to get analyst data for {symbol}: {str(e)}")
        
        # Sort by upside potential
        analyst_data["strong_buy_stocks"] = sorted(
            analyst_data["strong_buy_stocks"], 
            key=lambda x: x['upside_potential'], 
            reverse=True
        )[:10]
        
        analyst_data["high_price_targets"] = sorted(
            analyst_data["high_price_targets"], 
            key=lambda x: x['upside_potential'], 
            reverse=True
        )[:10]
        
        return analyst_data
    
    def _get_fundamental_highlights(self, fundamentals: Dict[str, Any]) -> List[str]:
        """Get highlights from fundamental analysis"""
        highlights = []
        
        if fundamentals.get('pe_ratio') and fundamentals['pe_ratio'] < 15:
            highlights.append("Low P/E ratio")
        
        if fundamentals.get('peg_ratio') and fundamentals['peg_ratio'] < 1:
            highlights.append("PEG ratio < 1")
        
        if fundamentals.get('roe') and fundamentals['roe'] > 0.15:
            highlights.append("High ROE")
        
        if fundamentals.get('profit_margin') and fundamentals['profit_margin'] > 0.15:
            highlights.append("High profit margins")
        
        if fundamentals.get('revenue_growth') and fundamentals['revenue_growth'] > 0.10:
            highlights.append("Strong revenue growth")
        
        if fundamentals.get('debt_to_equity') and fundamentals['debt_to_equity'] < 0.3:
            highlights.append("Low debt-to-equity")
        
        return highlights