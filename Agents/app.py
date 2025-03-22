import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from main import CrewNetwork, from_frontend_data
from agents import CorporateAgents, MarketingAgents

# Add the current directory to the path so imports work correctly
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

from api import CrewAPI

# Load environment variables
load_dotenv()

# Initialize app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes

# Initialize the CrewAPI
api = CrewAPI()

@app.route('/', methods=['GET'])
def index():
    """Simple test route to check if the server is running"""
    return jsonify({"status": "API is running", "available_routes": [
        "/networks [POST]",
        "/agents/types [GET]",
        "/tasks/types [GET]",
        "/agents/params [GET]",
        "/tasks/params [GET]",
        "/networks/<network_id> [PUT]",
        "/networks/<network_id>/save [POST]",
        "/networks/<network_id>/load [POST]",
        "/networks/<network_id>/run [POST]"
    ]})

@app.route('/networks', methods=['POST'])
def create_network():
    """Create a new network"""
    data = request.json
    network_id = data.get('network_id')
    response = api.create_network(network_id)
    return jsonify(response)

@app.route('/agents/types', methods=['GET'])
def get_agent_types():
    """Get available agent types"""
    domain = request.args.get('domain')
    types = api.get_available_agent_types(domain)
    return jsonify(types)

@app.route('/tasks/types', methods=['GET'])
def get_task_types():
    """Get available task types"""
    domain = request.args.get('domain')
    types = api.get_available_task_types(domain)
    return jsonify(types)

@app.route('/agents/params', methods=['GET'])
def get_agent_params():
    """Get parameters for an agent type"""
    domain = request.args.get('domain')
    agent_type = request.args.get('type')
    
    if not domain or not agent_type:
        return jsonify({"error": "Domain and type are required"}), 400
    
    params = api.get_agent_params(domain, agent_type)
    return jsonify(params)

@app.route('/tasks/params', methods=['GET'])
def get_task_params():
    """Get parameters for a task type"""
    domain = request.args.get('domain')
    task_type = request.args.get('type')
    
    if not domain or not task_type:
        return jsonify({"error": "Domain and type are required"}), 400
    
    params = api.get_task_params(domain, task_type)
    return jsonify(params)

@app.route('/networks/<network_id>', methods=['PUT'])
def update_network(network_id):
    """Update a network with data from the frontend"""
    data = request.json
    response = api.update_network(network_id, data)
    
    if 'error' in response:
        return jsonify(response), 404
    
    return jsonify(response)

@app.route('/networks/<network_id>/save', methods=['POST'])
def save_network(network_id):
    """Save a network configuration"""
    data = request.json
    filepath = data.get('filepath')
    response = api.save_network(network_id, filepath)
    
    if 'error' in response:
        return jsonify(response), 404
    
    return jsonify(response)

@app.route('/networks/<network_id>/load', methods=['POST'])
def load_network(network_id):
    """Load a network configuration"""
    data = request.json
    filepath = data.get('filepath')
    config = data.get('config')
    
    response = api.load_network(network_id, filepath, config)
    
    if 'error' in response:
        return jsonify(response), 400
    
    return jsonify(response)

@app.route('/networks/<network_id>/run', methods=['POST'])
def run_network(network_id):
    """Run a network and return the result"""
    data = request.json
    name = data.get('name')
    description = data.get('description')
    
    response = api.run_network(network_id, name, description)
    
    if 'error' in response:
        return jsonify(response), 400
    
    return jsonify(response)

@app.route('/agents', methods=['GET'])
def get_agents():
    try:
        corporate_agents = CorporateAgents()
        marketing_agents = MarketingAgents()
        
        agents = []
        agents.extend(corporate_agents.get_available_agents())
        agents.extend(marketing_agents.get_available_agents())
        
        return jsonify(agents)
    except Exception as e:
        print(f"Error getting agents: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/execute', methods=['POST'])
def execute_network():
    network_config = request.json
    network = from_frontend_data(network_config)
    crew = network.build_crew()
    result = crew.run()
    return jsonify({'results': result})

if __name__ == '__main__':
    print("Starting server on http://localhost:4000")
    app.run(debug=True, host='0.0.0.0', port=4000)