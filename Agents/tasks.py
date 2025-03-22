# tasks.py
from crewai import Task
from textwrap import dedent
from task_utils import load_task_definition

class CorporateTasks:
    def __init__(self):
        self.default_params = {'company': 'Default Company'}
    
    def create_meeting_summarization_task(self, agent, meeting_text=None, pdf_path=None, **kwargs):
        params = self.default_params.copy()
        params.update(kwargs)
        if meeting_text:
            params['meeting_text'] = meeting_text
        if pdf_path:
            params['pdf_path'] = pdf_path
            
        task_def = load_task_definition('corporate', 'meeting_summarization', params)
        return Task(
            description=dedent(task_def['description']),
            agent=agent,
            expected_output=task_def['expected_output']
        )
    
    def create_smart_email_management_task(self, agent, email_content=None, **kwargs):
        params = self.default_params.copy()
        params.update(kwargs)
        if email_content:
            params['email_content'] = email_content
            
        task_def = load_task_definition('corporate', 'smart_email_management', params)
        return Task(
            description=dedent(task_def['description']),
            agent=agent,
            expected_output=task_def['expected_output']
        )
    
    def create_competitor_watchdog_task(self, agent, competitors=None, **kwargs):
        params = self.default_params.copy()
        params.update(kwargs)
        if competitors:
            if isinstance(competitors, list):
                params['competitors'] = ', '.join(competitors)
            else:
                params['competitors'] = competitors
        
        task_def = load_task_definition('corporate', 'competitor_watchdog', params)
        return Task(
            description=dedent(task_def['description']),
            agent=agent,
            expected_output=task_def['expected_output']
        )
    
    def create_customer_feedback_analysis_task(self, agent, feedback_data=None, reviews_url=None, pdf_path=None, **kwargs):
        params = self.default_params.copy()
        params.update(kwargs)
        if feedback_data:
            params['feedback_data'] = feedback_data
        if reviews_url:
            params['reviews_url'] = reviews_url
        if pdf_path:
            params['pdf_path'] = pdf_path
            
        task_def = load_task_definition('corporate', 'customer_feedback_analysis', params)
        return Task(
            description=dedent(task_def['description']),
            agent=agent,
            expected_output=task_def['expected_output']
        )

 
class MarketingTasks:
    def __init__(self):
        self.default_params = {'company': 'Default Company'}
    
    def create_seo_optimization_task(self, agent, website_url=None, keywords=None, pdf_path=None, **kwargs):
        params = self.default_params.copy()
        params.update(kwargs)
        if website_url:
            params['website_url'] = website_url
        if keywords:
            if isinstance(keywords, list):
                params['keywords'] = ', '.join(keywords)
            else:
                params['keywords'] = keywords
        if pdf_path:
            params['pdf_path'] = pdf_path
            
        task_def = load_task_definition('marketing', 'seo_optimization', params)
        return Task(
            description=dedent(task_def['description']),
            agent=agent,
            expected_output=task_def['expected_output']
        )
    
    def create_competitor_watchdog_task(self, agent, competitors=None, market_segment=None, pdf_path=None, **kwargs):
        params = self.default_params.copy()
        params.update(kwargs)
        if competitors:
            if isinstance(competitors, list):
                params['competitors'] = ', '.join(competitors)
            else:
                params['competitors'] = competitors
        if market_segment:
            params['market_segment'] = market_segment
        if pdf_path:
            params['pdf_path'] = pdf_path
            
        task_def = load_task_definition('marketing', 'competitor_watchdog', params)
        return Task(
            description=dedent(task_def['description']),
            agent=agent,
            expected_output=task_def['expected_output']
        )
    
    def create_product_recommendation_task(self, agent, customer_data=None, product_catalog=None, pdf_path=None, **kwargs):
        params = self.default_params.copy()
        params.update(kwargs)
        if customer_data:
            params['customer_data'] = customer_data
        if product_catalog:
            params['product_catalog'] = product_catalog
        if pdf_path:
            params['pdf_path'] = pdf_path
            
        task_def = load_task_definition('marketing', 'product_recommendation', params)
        return Task(
            description=dedent(task_def['description']),
            agent=agent,
            expected_output=task_def['expected_output']
        )
    
    def create_post_creation_task(self, agent, platform=None, topic=None, audience=None, objectives=None, pdf_path=None, **kwargs):
        params = self.default_params.copy()
        params.update(kwargs)
        if platform:
            params['platform'] = platform
        if topic:
            params['topic'] = topic
        if audience:
            params['audience'] = audience
        if objectives:
            params['objectives'] = objectives
        if pdf_path:
            params['pdf_path'] = pdf_path
            
        task_def = load_task_definition('marketing', 'post_creation', params)
        return Task(
            description=dedent(task_def['description']),
            agent=agent,
            expected_output=task_def['expected_output']
        )
    
    def create_email_campaign_task(self, agent, campaign_objective=None, audience_segment=None, previous_performance=None, pdf_path=None, **kwargs):
        params = self.default_params.copy()
        params.update(kwargs)
        if campaign_objective:
            params['campaign_objective'] = campaign_objective
        if audience_segment:
            params['audience_segment'] = audience_segment
        if previous_performance:
            params['previous_performance'] = previous_performance
        if pdf_path:
            params['pdf_path'] = pdf_path
            
        task_def = load_task_definition('marketing', 'email_campaign', params)
        return Task(
            description=dedent(task_def['description']),
            agent=agent,
            expected_output=task_def['expected_output']
        )