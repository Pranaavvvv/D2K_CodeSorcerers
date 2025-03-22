import os
from dotenv import load_dotenv
from crewai import LLM
from main import CrewNetwork, from_frontend_data
from task_utils import load_task_definition

# Load environment variables
load_dotenv()

# Set Google API key for embeddings if not already set
if os.getenv("GEMINI_API_KEY") and not os.getenv("GOOGLE_API_KEY"):
    os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")

# Get the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))
# Define the path to the PDF file
pdf_path = os.path.join(current_dir, 'uploads', 'Resume_mercari_1.pdf')

# Verify PDF file exists
if os.path.exists(pdf_path):
    print(f"PDF file found: {pdf_path}")
    print(f"File size: {os.path.getsize(pdf_path) / 1024:.2f} KB")
else:
    print(f"WARNING: PDF file not found at {pdf_path}")

def test_conditional_rendering():
    """Test that conditional rendering in task definitions works correctly."""
    
    print("\n" + "="*50)
    print("Testing Conditional Rendering in Task Definitions")
    print("="*50 + "\n")
    
    # Test meeting summarization with just text
    print("1. Testing meeting summarization with just text:")
    meeting_def = load_task_definition('corporate', 'meeting_summarization', {
        'meeting_text': 'This is a test meeting text.'
    })
    print("Description includes conditional text for meeting_text:", 
          'This is a test meeting text.' in meeting_def['description'])
    
    # Test meeting summarization with just PDF
    print("\n2. Testing meeting summarization with just PDF:")
    meeting_def = load_task_definition('corporate', 'meeting_summarization', {
        'pdf_path': pdf_path
    })
    print("Description includes conditional text for pdf_path:", 
          pdf_path in meeting_def['description'])
    print("Description includes PDFSearchTool:", 
          'PDFSearchTool' in meeting_def['description'])
    
    # Test SEO optimization with PDF
    print("\n3. Testing SEO optimization with PDF:")
    seo_def = load_task_definition('marketing', 'seo_optimization', {
        'website_url': 'https://example.com',
        'keywords': 'test, keywords',
        'pdf_path': pdf_path
    })
    print("Description includes conditional text for pdf_path:", 
          pdf_path in seo_def['description'])
    print("Description includes PDFSearchTool:", 
          'PDFSearchTool' in seo_def['description'])
    
    return True

def create_pdf_seo_workflow():
    """Create and run a workflow that processes a PDF and creates an SEO plan based on it."""
    
    # First, test conditional rendering
    test_conditional_rendering()
    
    # Define the network configuration
    network_config = {
        "agents": [
            {"id": "agent1", "type": "meeting_summarizer", "domain": "corporate"},
            {"id": "agent2", "type": "seo_optimizer", "domain": "marketing"}
        ],
        "tasks": [
            {
                "id": "task1", 
                "type": "meeting_summarization", 
                "domain": "corporate", 
                "agent_id": "agent1",
                "params": {
                    "pdf_path": pdf_path
                }
            },
            {
                "id": "task2", 
                "type": "seo_optimization", 
                "domain": "marketing", 
                "agent_id": "agent2",
                "params": {
                    "website_url": "https://example.com",
                    "keywords": ["resume", "skills", "experience", "career"],
                    "pdf_path": pdf_path
                }
            }
        ],
        "connections": [
            {"from": "task1", "to": "task2"}
        ]
    }
    
    print("\n" + "="*50)
    print("Creating PDF to SEO Workflow")
    print("="*50 + "\n")
    
    # Create the network from the configuration
    network = from_frontend_data(network_config)
    
    # Instantiate agents and tasks
    print("Instantiating agents...")
    network.instantiate_agents()
    
    print("Instantiating tasks...")
    network.instantiate_tasks()
    
    # Get and print task descriptions to verify PDF path is included
    task1 = network.task_nodes["task1"].task_instance
    task2 = network.task_nodes["task2"].task_instance
    
    print("\nMeeting Summarization Task Description (excerpt):")
    print(task1.description[:500] + "...\n")
    
    print("SEO Optimization Task Description (excerpt):")
    print(task2.description[:500] + "...\n")
    
    # Build and run the crew
    crew = network.build_crew(
        name="PDF to SEO Workflow",
        description="A workflow that extracts information from a PDF resume and creates an SEO optimization plan"
    )
    
    print("\n" + "="*50)
    print("Running PDF to SEO Workflow")
    print("="*50 + "\n")
    
    # Run the crew
    result = crew.kickoff()
    
    print("\n" + "="*50)
    print("Workflow Result:")
    print("="*50 + "\n")
    print(result)
    
    return result

if __name__ == "__main__":
    create_pdf_seo_workflow() 