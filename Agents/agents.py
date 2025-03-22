import os
from textwrap import dedent
from crewai import Agent, LLM
from crewai_tools import SerperDevTool, ScrapeWebsiteTool
from agent_utils import load_agent_definition

class CorporateAgents:
    def __init__(self):
        # Initialize LLM
        self.llm = LLM(
            model="gemini/gemini-2.0-flash",
            api_key=os.getenv("GEMINI_API_KEY")
        )
        # Instantiate tools 
        self.serper_tool = SerperDevTool()
        self.scraper_tool = ScrapeWebsiteTool()
    
    def create_meeting_summarizer_agent(self):
        definition = load_agent_definition('corporate_agents', 'meeting_summarizer')
        return Agent(
            role=definition['role'],
            goal=definition['goal'],
            backstory=dedent(definition['backstory']),
            verbose=True,
            llm=self.llm
        )
    
    def create_smart_email_manager_agent(self):
        definition = load_agent_definition('corporate_agents', 'smart_email_manager')
        return Agent(
            role=definition['role'],
            goal=definition['goal'],
            backstory=dedent(definition['backstory']),
            tools=[self.serper_tool, self.scraper_tool],
            verbose=True,
            llm=self.llm
        )
    
    def create_competitor_watchdog_agent(self):
        definition = load_agent_definition('corporate_agents', 'competitor_watchdog')
        return Agent(
            role=definition['role'],
            goal=definition['goal'],
            backstory=dedent(definition['backstory']),
            tools=[self.serper_tool, self.scraper_tool],
            verbose=True,
            llm=self.llm
        )
    
    def create_customer_feedback_analyzer_agent(self):
        definition = load_agent_definition('corporate_agents', 'customer_feedback_analyzer')
        return Agent(
            role=definition['role'],
            goal=definition['goal'],
            backstory=dedent(definition['backstory']),
            tools=[self.serper_tool, self.scraper_tool],
            verbose=True,
            llm=self.llm
        )
