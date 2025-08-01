from abc import ABC, abstractmethod
from typing import Any, Dict, List
import asyncio
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BaseAgent(ABC):
    """Base class for all agents in the StockGPT agentic framework"""
    
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        self.logger = logging.getLogger(f"Agent.{name}")
        
    @abstractmethod
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the agent's main functionality"""
        pass
    
    def log_info(self, message: str):
        """Log information message"""
        self.logger.info(f"[{self.name}] {message}")
    
    def log_error(self, message: str):
        """Log error message"""
        self.logger.error(f"[{self.name}] {message}")
    
    def log_warning(self, message: str):
        """Log warning message"""
        self.logger.warning(f"[{self.name}] {message}")

class AgentOrchestrator:
    """Orchestrates multiple agents to work together"""
    
    def __init__(self):
        self.agents: List[BaseAgent] = []
        self.logger = logging.getLogger("AgentOrchestrator")
    
    def add_agent(self, agent: BaseAgent):
        """Add an agent to the orchestrator"""
        self.agents.append(agent)
        self.logger.info(f"Added agent: {agent.name}")
    
    async def run_agents_sequential(self, initial_context: Dict[str, Any]) -> Dict[str, Any]:
        """Run agents sequentially, passing context between them"""
        context = initial_context.copy()
        
        for agent in self.agents:
            try:
                self.logger.info(f"Executing agent: {agent.name}")
                result = await agent.execute(context)
                context.update(result)
                self.logger.info(f"Agent {agent.name} completed successfully")
            except Exception as e:
                self.logger.error(f"Agent {agent.name} failed: {str(e)}")
                context[f"{agent.name}_error"] = str(e)
        
        return context
    
    async def run_agents_parallel(self, initial_context: Dict[str, Any]) -> Dict[str, Any]:
        """Run agents in parallel for independent tasks"""
        context = initial_context.copy()
        
        # Create tasks for all agents
        tasks = []
        for agent in self.agents:
            task = asyncio.create_task(agent.execute(context.copy()))
            tasks.append((agent.name, task))
        
        # Wait for all tasks to complete
        results = {}
        for agent_name, task in tasks:
            try:
                result = await task
                results.update(result)
                self.logger.info(f"Agent {agent_name} completed successfully")
            except Exception as e:
                self.logger.error(f"Agent {agent_name} failed: {str(e)}")
                results[f"{agent_name}_error"] = str(e)
        
        context.update(results)
        return context