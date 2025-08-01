import asyncio
from typing import Dict, Any
import logging
from datetime import datetime

from agents.base_agent import AgentOrchestrator
from agents.web_search_agent import WebSearchAgent
from agents.market_analysis_agent import MarketAnalysisAgent
from agents.earnings_agent import EarningsAgent
from agents.recommendation_synthesizer import RecommendationSynthesizer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class StockRecommendationService:
    """Service that orchestrates all agents to generate stock recommendations"""
    
    def __init__(self, openai_client=None):
        self.openai_client = openai_client
        self.orchestrator = AgentOrchestrator()
        self._setup_agents()
    
    def _setup_agents(self):
        """Setup and configure all agents"""
        # Initialize agents
        web_agent = WebSearchAgent(self.openai_client)
        market_agent = MarketAnalysisAgent()
        earnings_agent = EarningsAgent()
        synthesizer = RecommendationSynthesizer(self.openai_client)
        
        # Add agents to orchestrator in execution order
        self.orchestrator.add_agent(web_agent)
        self.orchestrator.add_agent(market_agent)
        self.orchestrator.add_agent(earnings_agent)
        self.orchestrator.add_agent(synthesizer)
    
    async def generate_recommendations(self, use_parallel_execution: bool = True) -> Dict[str, Any]:
        """Generate stock recommendations using the agentic framework"""
        try:
            logger.info("Starting stock recommendation generation")
            start_time = datetime.now()
            
            # Initial context
            initial_context = {
                "request_timestamp": start_time.isoformat(),
                "analysis_type": "comprehensive_stock_screening"
            }
            
            # Execute agents
            if use_parallel_execution:
                # Run market data agents in parallel (independent tasks)
                parallel_orchestrator = AgentOrchestrator()
                parallel_orchestrator.add_agent(WebSearchAgent(self.openai_client))
                parallel_orchestrator.add_agent(MarketAnalysisAgent())
                parallel_orchestrator.add_agent(EarningsAgent())
                
                parallel_results = await parallel_orchestrator.run_agents_parallel(initial_context)
                
                # Then run synthesizer with collected data
                synthesizer = RecommendationSynthesizer(self.openai_client)
                final_results = await synthesizer.execute(parallel_results)
                results = {**parallel_results, **final_results}
            else:
                # Run all agents sequentially
                results = await self.orchestrator.run_agents_sequential(initial_context)
            
            # Calculate execution time
            execution_time = (datetime.now() - start_time).total_seconds()
            
            # Format final response
            response = self._format_response(results, execution_time)
            
            logger.info(f"Stock recommendations generated in {execution_time:.2f} seconds")
            return response
            
        except Exception as e:
            logger.error(f"Failed to generate recommendations: {str(e)}")
            return self._create_error_response(str(e))
    
    def _format_response(self, results: Dict[str, Any], execution_time: float) -> Dict[str, Any]:
        """Format the final response"""
        
        # Extract recommendations
        stock_recs = results.get("stock_recommendations", {})
        recommendations = stock_recs.get("recommendations", [])
        
        # Extract market context
        web_results = results.get("web_search_results", {})
        market_results = results.get("market_analysis", {})
        earnings_results = results.get("earnings_analysis", {})
        
        # Create comprehensive response
        response = {
            "success": True,
            "timestamp": datetime.now().isoformat(),
            "execution_time_seconds": execution_time,
            "recommendations": recommendations,
            "market_context": {
                "sentiment": web_results.get("market_sentiment", "neutral"),
                "trending_topics": web_results.get("trending_topics", [])[:5],
                "volatility_level": market_results.get("volatility_metrics", {}).get("volatility_level", "moderate"),
                "top_performing_sectors": market_results.get("sector_analysis", {}).get("top_performing_sectors", [])[:3],
                "upcoming_earnings_count": len(earnings_results.get("upcoming_earnings", []))
            },
            "methodology": stock_recs.get("methodology", "AI-powered multi-factor analysis"),
            "disclaimer": stock_recs.get("disclaimer", "For informational purposes only"),
            "agent_status": self._get_agent_status(results)
        }
        
        return response
    
    def _get_agent_status(self, results: Dict[str, Any]) -> Dict[str, str]:
        """Get status of each agent execution"""
        status = {}
        
        # Check if each agent completed successfully
        status["web_search"] = "success" if "web_search_results" in results else "failed"
        status["market_analysis"] = "success" if "market_analysis" in results else "failed"
        status["earnings_analysis"] = "success" if "earnings_analysis" in results else "failed"
        status["recommendation_synthesis"] = "success" if "stock_recommendations" in results else "failed"
        
        return status
    
    def _create_error_response(self, error_message: str) -> Dict[str, Any]:
        """Create error response"""
        return {
            "success": False,
            "error": error_message,
            "timestamp": datetime.now().isoformat(),
            "recommendations": [],
            "market_context": {
                "sentiment": "unknown",
                "trending_topics": [],
                "volatility_level": "unknown",
                "top_performing_sectors": [],
                "upcoming_earnings_count": 0
            }
        }

# Singleton instance for the application
_recommendation_service = None

def get_recommendation_service(openai_client=None) -> StockRecommendationService:
    """Get or create the recommendation service instance"""
    global _recommendation_service
    if _recommendation_service is None:
        _recommendation_service = StockRecommendationService(openai_client)
    return _recommendation_service