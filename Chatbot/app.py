import os
import sys
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from langchain_google_genai.embeddings import GoogleGenerativeAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore

# Load environment variables from .env file if it exists
load_dotenv()

app = Flask(__name__)

# Verify API keys are available
PINECONE_API_KEY = "pcsk_3JAr77_RM2nkjhgV94WfM1ZCzkME8WRmdeeGvuYPHbGAScgoMhphTHFPaxFYm7KB9kbc8W"
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Print API key status (but not the actual keys for security)
print(f"PINECONE_API_KEY present: {'Yes' if PINECONE_API_KEY else 'No'}")
print(f"GOOGLE_API_KEY present: {'Yes' if GOOGLE_API_KEY else 'No'}")

if not PINECONE_API_KEY:
    print("ERROR: PINECONE_API_KEY environment variable is not set")
    print("Please set your Pinecone API key by using:")
    print("    set PINECONE_API_KEY=your-api-key (Windows CMD)")
    print("    export PINECONE_API_KEY=your-api-key (Linux/Mac/Windows Bash)")
    print("Or create a .env file with PINECONE_API_KEY=your-api-key")
    sys.exit(1)

if not GOOGLE_API_KEY:
    print("ERROR: GOOGLE_API_KEY environment variable is not set")
    print("Please set your Google API key by using:")
    print("    set GOOGLE_API_KEY=your-api-key (Windows CMD)")
    print("    export GOOGLE_API_KEY=your-api-key (Linux/Mac/Windows Bash)")
    print("Or create a .env file with GOOGLE_API_KEY=your-api-key")
    sys.exit(1)

# Initialize embedding model
try:
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=GOOGLE_API_KEY
    )
    print("Successfully initialized Google Embeddings model")
except Exception as e:
    print(f"Error initializing Google Embeddings: {str(e)}")
    sys.exit(1)

# Initialize Pinecone with the new API style
try:
    print("Attempting to connect to Pinecone...")
    pc = Pinecone(api_key=PINECONE_API_KEY)
    
    # Check if index exists
    index_name = "d2k"
    available_indexes = pc.list_indexes().names()
    print(f"Available Pinecone indexes: {available_indexes}")
    
    if index_name not in available_indexes:
        print(f"Error: Index '{index_name}' not found in your Pinecone account")
        print("Available indexes:", available_indexes)
        print("Please create the index first or use an existing one")
        sys.exit(1)
    
    # Connect to the index
    index = pc.Index(index_name)
    
    # Initialize vector store
    db = PineconeVectorStore(
        index=index,
        embedding=embeddings,
        text_key="text"
    )
    print(f"Successfully connected to Pinecone index: {index_name}")
    
except Exception as e:
    print(f"Error connecting to Pinecone: {str(e)}")
    sys.exit(1)

@app.route('/upload', methods=['POST'])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    # Create uploads directory if it doesn't exist
    os.makedirs("uploads", exist_ok=True)
    
    file_path = os.path.join("uploads", file.filename)
    file.save(file_path)
    
    try:
        loader = PyPDFLoader(file_path)
        documents = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        texts = text_splitter.split_documents(documents)
        
        # Add documents to the vector store
        db.add_documents(texts)
        
        return jsonify({"message": f"File {file.filename} uploaded and processed successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up the uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)

@app.route('/query', methods=['POST'])
def query():
    data = request.json
    if not data:
        return jsonify({"error": "Request body is required"}), 400
        
    query_text = data.get("query")
    if not query_text:
        return jsonify({"error": "Query text is required"}), 400
    
    try:
        results = db.similarity_search(query_text, k=5)
        return jsonify({
            "results": [doc.page_content for doc in results]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/status', methods=['GET'])
def status():
    return jsonify({
        "status": "online",
        "pinecone_index": "d2k",
        "pinecone_api_key_present": bool(PINECONE_API_KEY),
        "google_api_key_present": bool(GOOGLE_API_KEY)
    })

if __name__ == '__main__':
    print("Starting Flask app on port 5551 with Pinecone")
    app.run(debug=True, port=5551)