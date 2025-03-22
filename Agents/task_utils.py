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
    
    # Process conditional sections with {#if param} ... {/if}
    if params:
        # Replace parameters
        for key, value in params.items():
            placeholder = '{' + key + '}'
            description = description.replace(placeholder, str(value) if value is not None else "")
        
        # Handle conditional blocks
        description = process_conditionals(description, params)
    
    return {
        'description': description,
        'expected_output': expected_output
    }

def process_conditionals(text, params):
    """
    Process conditional blocks in the format {#if param}...{/if}
    
    Args:
        text (str): The text containing conditional blocks
        params (dict): Dictionary of parameters
        
    Returns:
        str: Processed text with conditional blocks evaluated
    """
    # Find all conditional blocks
    pattern = r'{#if (\w+)}(.*?){\/if}'
    
    def replace_conditional(match):
        param_name = match.group(1)
        content = match.group(2)
        
        # If parameter exists and has a truthy value, include the content
        if param_name in params and params[param_name]:
            return content
        return ""  # Otherwise, remove the block
    
    # Replace all conditional blocks using regex substitution
    processed_text = re.sub(pattern, replace_conditional, text, flags=re.DOTALL)
    return processed_text 