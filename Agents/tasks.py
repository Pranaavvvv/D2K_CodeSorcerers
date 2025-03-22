# tasks.py
from crewai import Task
from textwrap import dedent
from task_utils import load_task_definition

class CorporateTasks:
    def __init__(self):
        self.default_params = {'company': 'Default Company'}
    
    def create_meeting_summarization_task(self, agent, meeting_text=None, **kwargs):
        params = self.default_params.copy()
        params.update(kwargs)
        if meeting_text:
            params['meeting_text'] = meeting_text
            
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
    
    def create_customer_feedback_analysis_task(self, agent, feedback_data=None, **kwargs):
        params = self.default_params.copy()
        params.update(kwargs)
        if feedback_data:
            params['feedback_data'] = feedback_data
            
        task_def = load_task_definition('corporate', 'customer_feedback_analysis', params)
        return Task(
            description=dedent(task_def['description']),
            agent=agent,
            expected_output=task_def['expected_output']
        )
