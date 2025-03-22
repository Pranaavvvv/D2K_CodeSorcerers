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

    def get_available_agents(self):
        return [
            {
                'id': 'meeting_summarizer',
                'name': 'Meeting Summarizer',
                'description': 'Summarizes meeting content and extracts key points',
                'type': 'corporate',
                'parameters': {
                    'meeting_text': '',
                    'pdf_path': ''
                }
            },
            {
                'id': 'smart_email_manager',
                'name': 'Smart Email Manager',
                'description': 'Manages and drafts professional emails',
                'type': 'corporate',
                'parameters': {
                    'email_content': ''
                }
            },
            {
                'id': 'competitor_watchdog',
                'name': 'Competitor Watchdog',
                'description': 'Monitors and analyzes competitor activities',
                'type': 'corporate',
                'parameters': {
                    'competitors': []
                }
            },
            {
                'id': 'customer_feedback_analyzer',
                'name': 'Customer Feedback Analyzer',
                'description': 'Analyzes customer feedback and reviews',
                'type': 'corporate',
                'parameters': {
                    'feedback_data': '',
                    'reviews_url': ''
                }
            }
        ]


class MarketingAgents:
    def __init__(self):
        # Initialize LLM
        self.llm = LLM(
            model="gemini/gemini-2.0-flash",
            api_key=os.getenv("GEMINI_API_KEY")
        )
        # Instantiate tools 
        self.serper_tool = SerperDevTool()
        self.scraper_tool = ScrapeWebsiteTool()
    
    def create_seo_optimizer_agent(self):
        definition = load_agent_definition('marketing_agents', 'seo_optimizer')
        return Agent(
            role=definition['role'],
            goal=definition['goal'],
            backstory=dedent(definition['backstory']),
            tools=[self.serper_tool, self.scraper_tool],
            verbose=True,
            llm=self.llm
        )
    
    def create_competitor_watchdog_agent(self):
        definition = load_agent_definition('marketing_agents', 'competitor_watchdog')
        return Agent(
            role=definition['role'],
            goal=definition['goal'],
            backstory=dedent(definition['backstory']),
            tools=[self.serper_tool, self.scraper_tool],
            verbose=True,
            llm=self.llm
        )
    
    def create_product_recommendation_agent(self):
        definition = load_agent_definition('marketing_agents', 'product_recommendation')
        return Agent(
            role=definition['role'],
            goal=definition['goal'],
            backstory=dedent(definition['backstory']),
            tools=[self.serper_tool, self.scraper_tool],
            verbose=True,
            llm=self.llm
        )
    
    def create_post_creator_agent(self):
        definition = load_agent_definition('marketing_agents', 'post_creator')
        return Agent(
            role=definition['role'],
            goal=definition['goal'],
            backstory=dedent(definition['backstory']),
            tools=[self.serper_tool, self.scraper_tool],
            verbose=True,
            llm=self.llm
        )
    
    def create_smart_email_manager_agent(self):
        definition = load_agent_definition('marketing_agents', 'smart_email_manager')
        return Agent(
            role=definition['role'],
            goal=definition['goal'],
            backstory=dedent(definition['backstory']),
            tools=[self.serper_tool, self.scraper_tool],
            verbose=True,
            llm=self.llm
        )

    def get_available_agents(self):
        return [
            {
                'id': 'seo_optimizer',
                'name': 'SEO Optimizer',
                'description': 'Optimizes content for search engines',
                'type': 'marketing',
                'parameters': {
                    'website_url': '',
                    'keywords': []
                }
            }
        ]