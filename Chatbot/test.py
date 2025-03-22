import pinecone

pinecone.init(api_key="your-api-key", environment="your-environment")
index = pinecone.Index("your-index-name")
print(index.describe_index_stats())
