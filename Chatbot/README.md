# PDF Vectorization and Query API

A simple Flask API that handles PDF vectorization using Pinecone and allows querying via Google's Gemini language models.

## Setup

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Create a `.env` file with the following variables:
   ```
   GOOGLE_API_KEY=your_google_api_key
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_ENVIRONMENT=your_pinecone_environment
   PINECONE_INDEX_NAME=your_pinecone_index_name
   ```

3. Run the application:
   ```
   python app.py
   ```

## API Endpoints

### Upload PDF
- **URL**: `/upload_pdf`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Form Data**: `file`: PDF file
- **Response**: 
  ```json
  {
    "success": true,
    "message": "PDF processed successfully",
    "pdf_id": "unique-id-for-this-pdf"
  }
  ```

### Query PDF
- **URL**: `/query`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "query": "Your question about the PDF",
    "pdf_id": "id-returned-from-upload"
  }
  ```
- **Response**:
  ```json
  {
    "answer": "Response based on PDF content",
    "pdf_id": "id-of-the-queried-pdf"
  }
  ```

### Health Check
- **URL**: `/health`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "healthy"
  }
  ```

## Example Usage with cURL

1. Upload a PDF:
   ```bash
   curl -X POST -F "file=@/path/to/your/document.pdf" http://localhost:5000/upload_pdf
   ```

2. Query the PDF (replace `YOUR_PDF_ID` with the ID returned from the upload):
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"query":"What is the main topic of this document?", "pdf_id":"YOUR_PDF_ID"}' http://localhost:5000/query
   ```

## Note
- The API uses Google's Gemini model (gemini-1.5-flash) for generating responses
- The API uses conversation history to provide context-aware responses
- Each PDF is stored in its own namespace in Pinecone for isolation
- The PDF ID must be included in each query request 