import os
import re

def load_agent_definition(domain, agent_type, params=None):
    """
    Load agent definition from markdown file
    
    Args:
        domain (str): The domain of the agent (e.g., corporate_agents, education_agents)
        agent_type (str): The type of agent within the domain (e.g., meeting_summarizer)
        params (dict, optional): Dictionary of parameters to inject into the goal. Defaults to None.
            Example: {'company': 'TechCorp Inc.', 'competitor': 'RivalCorp'}
        
    Returns:
        dict: A dictionary with role, goal, and backstory keys
    """
    file_path = os.path.join(os.path.dirname(__file__), 'agent_definitions', domain, f'{agent_type}_agent.md')
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Agent definition file not found: {file_path}")
    
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Extract role, goal, and backstory using regex
    role_match = re.search(r'## Role\s*\n(.*?)(?=\n##|\Z)', content, re.DOTALL)
    goal_match = re.search(r'## Goal\s*\n(.*?)(?=\n##|\Z)', content, re.DOTALL)
    backstory_match = re.search(r'## Backstory\s*\n(.*?)(?=\n##|\Z)', content, re.DOTALL)
    
    role = role_match.group(1).strip() if role_match else ""
    goal = goal_match.group(1).strip() if goal_match else ""
    backstory = backstory_match.group(1).strip() if backstory_match else ""
    
    # Replace parameters if provided
    if params:
        for key, value in params.items():
            placeholder = '{' + key + '}'
            goal = goal.replace(placeholder, value)
    
    return {
        'role': role,
        'goal': goal,
        'backstory': backstory
    } 