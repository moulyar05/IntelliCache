from fastapi import FastAPI
from pydantic import BaseModel
from database import cache_collection

from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
from sentence_transformers import SentenceTransformer
from qdrant_client.models import PointStruct
import time
import os
from dotenv import load_dotenv
from google import genai

app = FastAPI()
load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# Qdrant connection
qdrant = QdrantClient(url="http://localhost:6333")

# Embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Create Qdrant collection
if not qdrant.collection_exists("llm_cache"):
    qdrant.create_collection(
        collection_name="llm_cache",
        vectors_config=VectorParams(
            size=384,
            distance=Distance.COSINE
        )
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
    # Convert question into embedding
    vector = model.encode(request.question).tolist()
    results = qdrant.query_points(
        collection_name="llm_cache",
        query=vector,
        limit=1
    ).points
    if results:
        print("Result:", results[0])
        print("Score:", results[0].score)
        print("Payload:", results[0].payload)

        print("Similarity score:", results[0].score)

        if results[0].score >= 0.80:
            print("Semantic cache hit!")
            similar_question = results[0].payload["question"]

            cached = cache_collection.find_one({
                "question": similar_question
            })

            if cached:
                return {
                    "answer": cached["answer"],
                    "cached": True
                }
    print("Embedding created!")
    print("Vector length:", len(vector))

    qdrant.upsert(
    collection_name="llm_cache",
    points=[
        PointStruct(
            id=int(time.time()),
            vector=vector,
            payload={
                "question": request.question
            }
        )
    ]
)

    # Temporary answer
    response = client.models.generate_content(
    model="gemini-3.8-flash",
    contents=request.question
    )

    answer = response.text

    # Save in MongoDB
    cache_collection.insert_one({
        "question": request.question,
        "answer": answer
    })

    return {
        "answer": answer,
        "cached": False
    }