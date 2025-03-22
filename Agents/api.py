import os
import sys
from dotenv import load_dotenv
import json

# Add the current directory to the path so imports work correctly
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

# Import from main module
from main import CrewNetwork, from_frontend_data

# Load environment variables
load_dotenv()

class CrewAPI:
    """API wrapper for the CrewNetwork to be used by the frontend"""
    
    def __init__(self):
        """Initialize the API"""
        self.active_networks = {}
        
    def create_network(self, network_id=None):
        """Create a new empty network"""
        network = CrewNetwork()
        network_id = network_id or f"network_{len(self.active_networks) + 1}"
        self.active_networks[network_id] = network
        return {"network_id": network_id, "status": "created"}
    
    def get_available_agent_types(self, domain=None):
        """Get the available agent types for a domain"""
        agent_types = {
            'corporate': [
                'meeting_summarizer',
                'smart_email_manager',
                'competitor_watchdog',
                'customer_feedback_analyzer'
            ],
            'education': [],
            'legal': [],
            'marketing': []
        }
        
        if domain:
            return agent_types.get(domain, [])
        return agent_types
    
    def get_available_task_types(self, domain=None):
        """Get the available task types for a domain"""
        task_types = {
            'corporate': [
                'meeting_summarization',
                'smart_email_management',
                'competitor_watchdog',
                'customer_feedback_analysis'
            ],
            'education': [],
            'legal': [],
            'marketing': []
        }
        
        if domain:
            return task_types.get(domain, [])
        return task_types
    
    def get_agent_params(self, domain, agent_type):
        """Get the parameters required for an agent type"""
        # This would typically load from a config or schema file
        params = {
            'corporate': {
                'meeting_summarizer': [],
                'smart_email_manager': [],
                'competitor_watchdog': [],
                'customer_feedback_analyzer': []
            }
        }
        
        return params.get(domain, {}).get(agent_type, [])
    
    def get_task_params(self, domain, task_type):
        """Get the parameters required for a task type"""
        # This would typically load from a config or schema file
        params = {
            'corporate': {
                'meeting_summarization': ['meeting_text', 'pdf_path'],
                'smart_email_management': ['email_content'],
                'competitor_watchdog': ['competitors'],
                'customer_feedback_analysis': ['feedback_data', 'reviews_url', 'pdf_path']
            },
            'marketing': {
                'seo_optimization': ['website_url', 'keywords', 'pdf_path'],
                'competitor_watchdog': ['competitors', 'market_segment', 'pdf_path'],
                'product_recommendation': ['customer_data', 'product_catalog', 'pdf_path'],
                'social_media_post_creation': ['platform', 'topic', 'audience', 'objectives', 'pdf_path'],
                'email_campaign': ['campaign_objective', 'audience_segment', 'previous_performance', 'pdf_path']
            }
        }
        
        return params.get(domain, {}).get(task_type, [])
    
    def update_network(self, network_id, data):
        """Update a network with data from the frontend"""
        if network_id not in self.active_networks:
            return {"error": f"Network {network_id} not found"}
        
        # Create a new network from the data
        network = from_frontend_data(data)
        self.active_networks[network_id] = network
        
        return {"network_id": network_id, "status": "updated"}
    
    def save_network(self, network_id, filepath=None):
        """Save a network configuration to a file"""
        if network_id not in self.active_networks:
            return {"error": f"Network {network_id} not found"}
        
        network = self.active_networks[network_id]
        
        # Convert network to serializable format
        data = {
            "agents": [],
            "tasks": [],
            "connections": []
        }
        
        # Serialize agent nodes
        for agent_id, agent_node in network.agent_nodes.items():
            data["agents"].append({
                "id": agent_node.id,
                "type": agent_node.agent_type,
                "domain": agent_node.domain,
                "params": agent_node.params
            })
        
        # Serialize task nodes
        for task_id, task_node in network.task_nodes.items():
            data["tasks"].append({
                "id": task_node.id,
                "type": task_node.task_type,
                "domain": task_node.domain,
                "agent_id": task_node.agent_node.id,
                "params": task_node.params
            })
        
        # Serialize connections
        for task_id, task_node in network.task_nodes.items():
            for dep in task_node.dependencies:
                data["connections"].append({
                    "from": dep.id,
                    "to": task_id
                })
        
        # Save to file if specified
        if filepath:
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=2)
        
        return {"network_id": network_id, "config": data}
    
    def load_network(self, network_id, filepath=None, data=None):
        """Load a network configuration from a file or data"""
        if filepath:
            with open(filepath, 'r') as f:
                data = json.load(f)
        
        if not data:
            return {"error": "No data or filepath provided"}
        
        network = from_frontend_data(data)
        self.active_networks[network_id] = network
        
        return {"network_id": network_id, "status": "loaded"}
    
    def run_network(self, network_id, name=None, description=None):
        """Run a network and return the result"""
        if network_id not in self.active_networks:
            return {"error": f"Network {network_id} not found"}
        
        network = self.active_networks[network_id]
        
        try:
            # Instantiate agents and tasks
            network.instantiate_agents()
            network.instantiate_tasks()
            
            # Build the crew
            crew = network.build_crew(
                name=name or f"Crew {network_id}",
                description=description
            )
            
            # Run the crew
            result = crew.kickoff()
            
            # Convert CrewOutput to dictionary
            if hasattr(result, 'dict'):
                result_dict = result.dict()
            elif hasattr(result, '__dict__'):
                result_dict = result.__dict__
            else:
                # If it's a string or primitive type
                result_dict = {"output": str(result)}
            
            return {"network_id": network_id, "result": result_dict}
        except Exception as e:
            return {"error": str(e)}

# Example usage
if __name__ == "__main__":
    api = CrewAPI()
    
    # Create a new network
    response = api.create_network("test_network")
    network_id = response["network_id"]
    
    # Get available agent types
    agent_types = api.get_available_agent_types("corporate")
    print(f"Available corporate agent types: {agent_types}")
    
    # Get available task types
    task_types = api.get_available_task_types("corporate")
    print(f"Available corporate task types: {task_types}")
    
    # Create a test network configuration
    test_config = {
        "agents": [
            {"id": "agent1", "type": "meeting_summarizer", "domain": "corporate"},
            {"id": "agent2", "type": "smart_email_manager", "domain": "corporate"}
        ],
        "tasks": [
            {"id": "task1", "type": "meeting_summarization", "domain": "corporate", 
             "agent_id": "agent1", "params": {"meeting_text": "Discussion about Q3 results..."}},
            {"id": "task2", "type": "smart_email_management", "domain": "corporate", 
             "agent_id": "agent2", "params": {"email_content": "Draft email about Q3 results..."}}
        ],
        "connections": [
            {"from": "task1", "to": "task2"}
        ]
    }
    
    # Update the network with the configuration
    api.update_network(network_id, test_config)
    
    # Save the network configuration
    api.save_network(network_id, "test_network.json")
    
    # Run the network
    # This is commented out to prevent actual execution which requires API keys
    # result = api.run_network(network_id, "Test Crew")
    # print(result) 