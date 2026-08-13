from fastapi import FastAPI
from pydantic import BaseModel
from database import cache_collection

from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer

app = FastAPI()

# Qdrant connection
qdrant = QdrantClient(url="http://localhost:6333")

# Embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Create Qdrant collection
if not qdrant.collection_exists("llm_cache"):
    qdrant.create_collection(
        collection_name="llm_cache",
        vectors_config={
            "size": 384,
            "distance": "Cosine"
        }
    )


class ChatRequest(BaseModel):
    question: str


@app.get("/")
def home():
    return {"message": "LLM Cache Proxy is running!"}


@app.post("/chat")
def chat(request: ChatRequest):

    # Check exact question in MongoDB
    cached = cache_collection.find_one({
        "question": request.question
    })

    if cached:
        return {
            "answer": cached["answer"],
            "cached": True
        }

    # Temporary answer
    answer = "This is a sample LLM answer."

    # Save in MongoDB
    cache_collection.insert_one({
        "question": request.question,
        "answer": answer
    })

    return {
        "answer": answer,
        "cached": False
    }