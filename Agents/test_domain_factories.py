import os
from dotenv import load_dotenv
from crewai import LLM
from agents import CorporateAgents, MarketingAgents
from tasks import CorporateTasks, MarketingTasks

# Load environment variables
load_dotenv()

# Set Google API key for embeddings if not already set
if os.getenv("GEMINI_API_KEY") and not os.getenv("GOOGLE_API_KEY"):
    os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")

def test_marketing_domain():
    """Test that the marketing domain factory is working correctly."""
    try:
        print("Testing Marketing Agents class...")
        marketing_agents = MarketingAgents()
        print("✅ Successfully created MarketingAgents instance")
        
        print("Testing SEO Optimizer agent creation...")
        seo_agent = marketing_agents.create_seo_optimizer_agent()
        print(f"✅ Successfully created SEO Optimizer agent: {seo_agent}")
        
        print("Testing Marketing Tasks class...")
        marketing_tasks = MarketingTasks()
        print("✅ Successfully created MarketingTasks instance")
        
        print("Testing SEO Optimization task creation...")
        seo_task = marketing_tasks.create_seo_optimization_task(
            agent=seo_agent,
            website_url="https://example.com",
            keywords=["test", "keywords"]
        )
        print(f"✅ Successfully created SEO Optimization task: {seo_task}")
        
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_corporate_domain():
    """Test that the corporate domain factory is working correctly."""
    try:
        print("Testing Corporate Agents class...")
        corporate_agents = CorporateAgents()
        print("✅ Successfully created CorporateAgents instance")
        
        print("Testing Meeting Summarizer agent creation...")
        meeting_agent = corporate_agents.create_meeting_summarizer_agent()
        print(f"✅ Successfully created Meeting Summarizer agent: {meeting_agent}")
        
        print("Testing Corporate Tasks class...")
        corporate_tasks = CorporateTasks()
        print("✅ Successfully created CorporateTasks instance")
        
        print("Testing Meeting Summarization task creation...")
        meeting_task = corporate_tasks.create_meeting_summarization_task(
            agent=meeting_agent,
            meeting_text="Test meeting text"
        )
        print(f"✅ Successfully created Meeting Summarization task: {meeting_task}")
        
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("\n=== Testing Corporate Domain ===")
    corporate_success = test_corporate_domain()
    
    print("\n=== Testing Marketing Domain ===")
    marketing_success = test_marketing_domain()
    
    if corporate_success and marketing_success:
        print("\n✅ All tests passed! Domain factories are working correctly.")
    else:
        print("\n❌ Tests failed. Please check the errors above.") 