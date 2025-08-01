import asyncio
import aiohttp
from typing import Dict, Any, List
from datetime import datetime, timedelta
import json
from bs4 import BeautifulSoup
import re
from .base_agent import BaseAgent

class WebSearchAgent(BaseAgent):
    """Agent responsible for searching the web and analyzing financial news"""
    
    def __init__(self, openai_client=None):
        super().__init__("WebSearchAgent", "Searches web for financial news and market insights")
        self.openai_client = openai_client
        
        # Financial news sources to search
        self.news_sources = [
            "https://finance.yahoo.com/news/",
            "https://www.marketwatch.com/latest-news",
            "https://www.cnbc.com/world-markets/",
        ]
        
        # Key financial terms to search for
        self.search_terms = [
            "stock market trends",
            "earnings reports",
            "market volatility",
            "sector rotation",
            "economic indicators",
            "fed interest rates",
            "inflation data",
            "GDP growth"
        ]
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute web search and news analysis"""
        self.log_info("Starting web search and news analysis")
        
        try:
            # Search for recent financial news
            news_articles = await self._search_financial_news()
            
            # Analyze sentiment and extract insights
            market_sentiment = await self._analyze_market_sentiment(news_articles)
            
            # Extract trending topics
            trending_topics = await self._extract_trending_topics(news_articles)
            
            result = {
                "web_search_results": {
                    "news_articles": news_articles[:10],  # Top 10 articles
                    "market_sentiment": market_sentiment,
                    "trending_topics": trending_topics,
                    "analysis_timestamp": datetime.now().isoformat()
                }
            }
            
            self.log_info(f"Found {len(news_articles)} articles, sentiment: {market_sentiment}")
            return result
            
        except Exception as e:
            self.log_error(f"Web search failed: {str(e)}")
            return {"web_search_error": str(e)}
    
    async def _search_financial_news(self) -> List[Dict[str, str]]:
        """Search for recent financial news articles"""
        articles = []
        
        async with aiohttp.ClientSession() as session:
            for source in self.news_sources:
                try:
                    articles.extend(await self._scrape_news_source(session, source))
                except Exception as e:
                    self.log_error(f"Failed to scrape {source}: {str(e)}")
        
        # Sort by recency and relevance
        return sorted(articles, key=lambda x: x.get('timestamp', ''), reverse=True)[:20]
    
    async def _scrape_news_source(self, session: aiohttp.ClientSession, url: str) -> List[Dict[str, str]]:
        """Scrape news articles from a specific source"""
        articles = []
        
        try:
            async with session.get(url, timeout=10) as response:
                if response.status == 200:
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    # Extract articles based on common patterns
                    article_elements = soup.find_all(['article', 'div'], class_=re.compile(r'(story|article|news|headline)'))
                    
                    for element in article_elements[:10]:  # Limit per source
                        title_elem = element.find(['h1', 'h2', 'h3', 'a'])
                        if title_elem:
                            title = title_elem.get_text(strip=True)
                            link = title_elem.get('href', '') if title_elem.name == 'a' else ''
                            
                            # Extract summary if available
                            summary_elem = element.find(['p', 'div'], class_=re.compile(r'(summary|excerpt|description)'))
                            summary = summary_elem.get_text(strip=True) if summary_elem else ""
                            
                            if title and len(title) > 10:
                                articles.append({
                                    'title': title,
                                    'summary': summary,
                                    'link': link,
                                    'source': url,
                                    'timestamp': datetime.now().isoformat()
                                })
        
        except Exception as e:
            self.log_error(f"Error scraping {url}: {str(e)}")
        
        return articles
    
    async def _analyze_market_sentiment(self, articles: List[Dict[str, str]]) -> str:
        """Analyze overall market sentiment from news articles"""
        if not self.openai_client or not articles:
            return "neutral"
        
        try:
            # Combine article titles and summaries
            news_text = "\\n".join([
                f"Title: {article['title']} Summary: {article.get('summary', '')}" 
                for article in articles[:10]
            ])
            
            response = await asyncio.to_thread(
                self.openai_client.chat.completions.create,
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "Analyze the sentiment of financial news. Respond with only one word: 'bullish', 'bearish', or 'neutral'."
                    },
                    {
                        "role": "user",
                        "content": f"Analyze the market sentiment from these recent financial news headlines and summaries:\\n\\n{news_text}"
                    }
                ]
            )
            
            sentiment = response.choices[0].message.content.strip().lower()
            return sentiment if sentiment in ['bullish', 'bearish', 'neutral'] else 'neutral'
            
        except Exception as e:
            self.log_error(f"Sentiment analysis failed: {str(e)}")
            return "neutral"
    
    async def _extract_trending_topics(self, articles: List[Dict[str, str]]) -> List[str]:
        """Extract trending topics from news articles"""
        if not self.openai_client or not articles:
            return []
        
        try:
            # Combine article titles
            titles_text = "\\n".join([article['title'] for article in articles[:15]])
            
            response = await asyncio.to_thread(
                self.openai_client.chat.completions.create,
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "Extract 5-10 key trending topics from financial news headlines. Return as a JSON array of strings. Focus on sectors, companies, economic events, and market themes."
                    },
                    {
                        "role": "user",
                        "content": f"Extract trending topics from these financial news headlines:\\n\\n{titles_text}"
                    }
                ]
            )
            
            topics_text = response.choices[0].message.content.strip()
            
            # Try to parse as JSON
            try:
                topics = json.loads(topics_text)
                return topics if isinstance(topics, list) else []
            except json.JSONDecodeError:
                # Fallback: split by lines or commas
                topics = [topic.strip() for topic in topics_text.replace('[', '').replace(']', '').split(',')]
                return [topic.strip('"').strip("'") for topic in topics if topic.strip()][:10]
            
        except Exception as e:
            self.log_error(f"Topic extraction failed: {str(e)}")
            return []