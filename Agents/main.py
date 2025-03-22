import os
from dotenv import load_dotenv
from crewai import Crew, Task, Agent
from crewai import LLM
from agents import CorporateAgents, MarketingAgents
from tasks import CorporateTasks, MarketingTasks
from datetime import datetime
import json

# Load environment variables
load_dotenv()

class AgentNode:
    """Represents a node in the agent network graph."""
    
    def __init__(self, id, agent_type, domain="corporate", params=None):
        """Initialize the agent node.
        
        Args:
            id (str): The unique identifier for the agent.
            agent_type (str): The type of the agent.
            domain (str): The domain of the agent.
            params (dict): Parameters for the agent.
        """
        self.id = id
        self.agent_type = agent_type
        self.domain = domain
        self.params = params or {}
        self.agent_instance = None
    
    def __str__(self):
        return f"AgentNode({self.id}, {self.agent_type})"

class TaskNode:
    """Represents a node in the task network graph."""
    
    def __init__(self, id, task_type, agent_node, domain="corporate", params=None):
        """Initialize the task node.
        
        Args:
            id (str): The unique identifier for the task.
            task_type (str): The type of the task.
            agent_node (AgentNode): The agent that will perform the task.
            domain (str): The domain of the task.
            params (dict): Parameters for the task.
        """
        self.id = id
        self.task_type = task_type
        self.agent_node = agent_node
        self.domain = domain
        self.params = params or {}
        self.dependencies = []
        self.task_instance = None
    
    def add_dependency(self, task_node):
        """Add a dependency to this task.
        
        Args:
            task_node (TaskNode): The task node that this task depends on.
        """
        self.dependencies.append(task_node)
    
    def __str__(self):
        return f"TaskNode({self.id}, {self.task_type}, agent={self.agent_node.id})"

class CrewNetwork:
    """A network of agents and tasks that can be dynamically created."""
    
    def __init__(self):
        """Initialize the crew network."""
        self.agent_nodes = {}
        self.task_nodes = {}
        self.domain_factories = {
            "corporate": {
                "agents": CorporateAgents(),
                "tasks": CorporateTasks()
            },
            "marketing": {
                "agents": MarketingAgents(),
                "tasks": MarketingTasks()
            }
        }
    
    def add_agent_node(self, id, agent_type, domain="corporate", params=None):
        """Add an agent node to the network.
        
        Args:
            id (str): The unique identifier for the agent.
            agent_type (str): The type of the agent.
            domain (str): The domain of the agent.
            params (dict): Parameters for the agent.
        """
        node = AgentNode(id, agent_type, domain, params)
        self.agent_nodes[id] = node
        return node
    
    def add_task_node(self, id, task_type, agent_id, domain="corporate", params=None):
        """Add a task node to the network.
        
        Args:
            id (str): The unique identifier for the task.
            task_type (str): The type of the task.
            agent_id (str): The ID of the agent that will perform the task.
            domain (str): The domain of the task.
            params (dict): Parameters for the task.
        """
        if agent_id not in self.agent_nodes:
            raise ValueError(f"Agent {agent_id} not found.")
        
        node = TaskNode(id, task_type, self.agent_nodes[agent_id], domain, params)
        self.task_nodes[id] = node
        return node
    
    def add_task_dependency(self, task_id, depends_on_task_id):
        """Add a dependency between tasks.
        
        Args:
            task_id (str): The ID of the task.
            depends_on_task_id (str): The ID of the task that task_id depends on.
        """
        if task_id not in self.task_nodes:
            raise ValueError(f"Task {task_id} not found.")
        if depends_on_task_id not in self.task_nodes:
            raise ValueError(f"Task {depends_on_task_id} not found.")
        
        self.task_nodes[task_id].add_dependency(self.task_nodes[depends_on_task_id])
    
    def instantiate_agents(self):
        """Instantiate all agents in the network."""
        for agent_id, node in self.agent_nodes.items():
            factory = self.domain_factories.get(node.domain, {}).get("agents")
            if not factory:
                raise ValueError(f"No agent factory found for domain {node.domain}")
            
            # Get the method for creating this type of agent
            method_name = f"create_{node.agent_type}_agent"
            if not hasattr(factory, method_name):
                raise ValueError(f"No method {method_name} found in factory for domain {node.domain}")
            
            # Create the agent
            create_method = getattr(factory, method_name)
            node.agent_instance = create_method()
    
    def instantiate_tasks(self):
        """Instantiate all tasks in the network."""
        for task_id, node in self.task_nodes.items():
            factory = self.domain_factories.get(node.domain, {}).get("tasks")
            if not factory:
                raise ValueError(f"No task factory found for domain {node.domain}")
            
            # Ensure the agent is instantiated
            if not node.agent_node.agent_instance:
                raise ValueError(f"Agent {node.agent_node.id} is not instantiated.")
            
            # Get the method for creating this type of task
            method_name = f"create_{node.task_type}_task"
            if not hasattr(factory, method_name):
                raise ValueError(f"No method {method_name} found in factory for domain {node.domain}")
            
            # Create the task
            create_method = getattr(factory, method_name)
            
            # Create the task with the agent and parameters
            node.task_instance = create_method(
                agent=node.agent_node.agent_instance, 
                **node.params
            )
    
    def get_all_agents(self):
        """Get all instantiated agents in the network."""
        return [node.agent_instance for node in self.agent_nodes.values() if node.agent_instance]
    
    def get_all_tasks(self):
        """Get all instantiated tasks in the network in topological order.
        
        Returns:
            list: A list of tasks in the order they should be executed.
        """
        # Implement topological sort to get tasks in order
        visited = set()
        task_ordering = []
        
        def dfs(task_id):
            if task_id in visited:
                return
            visited.add(task_id)
            
            # Visit all dependencies first
            for dep in self.task_nodes[task_id].dependencies:
                dfs(dep.id)
            
            # Add the task after all dependencies
            task_ordering.append(self.task_nodes[task_id].task_instance)
        
        # Start DFS from tasks with no dependent tasks
        for task_id in self.task_nodes:
            if not any(task_id in [dep.id for dep in node.dependencies] 
                     for node in self.task_nodes.values()):
                dfs(task_id)
        
        # For any remaining tasks (in case of cycles, though we should avoid them)
        for task_id in self.task_nodes:
            if task_id not in visited:
                dfs(task_id)
        
        return task_ordering
    
    def build_crew(self, name="Dynamic Crew", description=None):
        """Build a crew from the network."""
        # Make sure agents and tasks are instantiated
        if not all(node.agent_instance for node in self.agent_nodes.values()):
            self.instantiate_agents()
        
        if not all(node.task_instance for node in self.task_nodes.values()):
            self.instantiate_tasks()
        
        # Get all agents and tasks in order
        agents = self.get_all_agents()
        tasks = self.get_all_tasks()
        
        # Create the crew with a callback to combine outputs
        crew = Crew(
            agents=agents,
            tasks=tasks,
            verbose=True,
            process='sequential',
            name=name,
            description=description or f"A crew of {len(agents)} agents working on {len(tasks)} tasks.",
            output_handler=self.combine_outputs
        )
        
        return crew

    def combine_outputs(self, outputs):
        """Combine sequential task outputs into a single coherent report."""
        combined_report = {
            "workflow_name": self.name,
            "execution_time": datetime.now().isoformat(),
            "sequential_results": [],
            "final_summary": {}
        }

        # Process each task output in sequence
        for task_id, output in outputs.items():
            task_node = self.task_nodes[task_id]
            task_result = {
                "task_id": task_id,
                "task_type": task_node.task_type,
                "agent": task_node.agent_node.id,
                "output": output
            }
            combined_report["sequential_results"].append(task_result)
            
            # Merge relevant data into final summary
            if isinstance(output, dict):
                combined_report["final_summary"].update(output)
            else:
                try:
                    # Try to parse string output as JSON if possible
                    output_dict = json.loads(output)
                    combined_report["final_summary"].update(output_dict)
                except:
                    # If not JSON, store as text
                    combined_report["final_summary"][f"task_{task_id}_output"] = output

        return combined_report

def example_corporate_network():
    """Create an example corporate network.
    
    Returns:
        CrewNetwork: A network with corporate agents and tasks.
    """
    network = CrewNetwork()
    
    # Add agent nodes
    summarizer = network.add_agent_node("summarizer", "meeting_summarizer")
    email_manager = network.add_agent_node("email_manager", "smart_email_manager")
    
    # Add task nodes
    task1 = network.add_task_node(
        "summarize_meeting", 
        "meeting_summarization", 
        "summarizer",
        params={"meeting_text": "Discussion about Q3 results..."}
    )
    
    task2 = network.add_task_node(
        "manage_email", 
        "smart_email_management", 
        "email_manager",
        params={"email_content": "Draft email about Q3 results..."}
    )
    
    # Add dependencies
    network.add_task_dependency("manage_email", "summarize_meeting")
    
    return network

def from_frontend_data(data):
    """Create a network from data structured as it would be sent from a frontend interface.
    
    Args:
        data (dict): The data from the frontend.
    
    Returns:
        CrewNetwork: A network with the specified agents and tasks.
    """
    network = CrewNetwork()
    
    # Add agent nodes
    for agent_data in data.get("agents", []):
        network.add_agent_node(
            agent_data["id"],
            agent_data["type"],
            agent_data.get("domain", "corporate"),
            agent_data.get("params", {})
        )
    
    # Add task nodes
    for task_data in data.get("tasks", []):
        network.add_task_node(
            task_data["id"],
            task_data["type"],
            task_data["agent_id"],
            task_data.get("domain", "corporate"),
            task_data.get("params", {})
        )
    
    # Add dependencies
    for connection in data.get("connections", []):
        network.add_task_dependency(connection["to"], connection["from"])
    
    return network

if __name__ == "__main__":
    # Example 1: Create a network programmatically
    network = example_corporate_network()
    
    # Example 2: Create a network from frontend data
    frontend_data = {
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
    
    network = from_frontend_data(frontend_data)
    
    # Instantiate agents and tasks
    network.instantiate_agents()
    network.instantiate_tasks()
    
    # Build the crew
    crew = network.build_crew(name="Corporate Team")
    
    # Run the crew
    # Note: This requires API keys to be set up
    # result = crew.kickoff()
