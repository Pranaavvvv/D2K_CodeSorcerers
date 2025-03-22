import os
import re

def load_task_definition(domain, task_type, params=None):
    """
    Load task definition from markdown file
    
    Args:
        domain (str): The domain of the task (e.g., corporate, education, legal)
        task_type (str): The type of task within the domain (e.g., meeting_summarization)
        params (dict, optional): Dictionary of parameters to inject into the description. Defaults to None.
            Example: {'company': 'TechCorp Inc.', 'competitor': 'RivalCorp'}
        
    Returns:
        dict: A dictionary with description and expected_output keys
    """
    folder_name = f"{domain}_tasks"
    file_path = os.path.join(os.path.dirname(__file__), 'task_definitions', folder_name, f'{task_type}.md')
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Task definition file not found: {file_path}")
    
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Extract description and expected_output using regex
    description_match = re.search(r'## Description\s*\n(.*?)(?=\n##|\Z)', content, re.DOTALL)
    expected_output_match = re.search(r'## Expected Output\s*\n(.*?)(?=\n##|\Z)', content, re.DOTALL)
    
    description = description_match.group(1).strip() if description_match else ""
    expected_output = expected_output_match.group(1).strip() if expected_output_match else ""
    
    # Replace parameters if provided
    if params:
        for key, value in params.items():
            placeholder = '{' + key + '}'
            description = description.replace(placeholder, value)
    
    return {
        'description': description,
        'expected_output': expected_output
    } 