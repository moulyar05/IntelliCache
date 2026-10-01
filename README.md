# IntelliCache – Intelligent LLM Cache Proxy

IntelliCache is an intelligent LLM caching system that reduces unnecessary AI API calls by reusing previously generated responses.

It combines exact-match caching with semantic similarity search, allowing similar questions to retrieve cached answers instead of generating a new response.

## 🚀 Features

* ⚡ Exact question caching using MongoDB
* 🧠 Semantic caching using Qdrant vector search
* 🤖 Gemini-powered AI responses
* 🔍 Sentence-transformer embeddings
* 📊 Real-time cache statistics
* ⏱️ Response-time monitoring
* 💻 React-based dashboard
* 🔄 Automatic cache updates
* 🌐 FastAPI backend

## 🏗️ Architecture

```text
React Dashboard
       ↓
    FastAPI
       ↓
 ┌───────────────┐
 │ Exact Cache   │ → MongoDB
 └───────────────┘
       ↓
 ┌───────────────┐
 │ Semantic Cache│ → Qdrant
 └───────────────┘
       ↓
   Cache Miss
       ↓
   Gemini API
       ↓
 MongoDB + Qdrant
```

## 🔄 How It Works

1. User submits a question through the React dashboard.
2. FastAPI checks MongoDB for an exact question match.
3. If found, the cached answer is returned immediately.
4. If not found, the question is converted into a vector embedding.
5. Qdrant searches for semantically similar questions.
6. If a sufficiently similar question is found, its cached answer is returned.
7. Otherwise, Gemini generates a new answer.
8. The new question and answer are stored in MongoDB.
9. The question embedding is stored in Qdrant for future semantic searches.

## 🛠️ Tech Stack

| Technology            | Purpose                  |
| --------------------- | ------------------------ |
| Python                | Backend development      |
| FastAPI               | API and LLM proxy        |
| React                 | Frontend dashboard       |
| MongoDB               | Exact cache and metadata |
| Qdrant                | Vector database          |
| Sentence Transformers | Text embeddings          |
| Gemini API            | AI response generation   |
| Docker                | Qdrant container         |

## 📁 Project Structure

```text
llm-cache-proxy/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── .env
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   └── App.jsx
│   ├── package.json
│   └── ...
│
└── README.md
```

## ⚙️ Running Locally

### Backend

```bash
cd backend
uvicorn main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

### Qdrant

Qdrant runs locally using Docker:

```bash
docker run -p 6333:6333 qdrant/qdrant
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## 📊 Dashboard

The dashboard displays:

* Response time
* Cache status
* Total cached questions
* Exact cache hits
* Semantic cache hits
* AI-generated responses

## 🔐 Environment Variables

Create a `.env` file inside the backend directory:

```env
GEMINI_API_KEY=your_api_key
MONGO_URI=your_mongodb_connection_string
```

## 🔮 Future Improvements

* Cache expiration and automatic cleanup
* Advanced cache analytics
* Authentication
* Deployment to a cloud platform
* More detailed performance monitoring

## 👩‍💻 Author

Moulya R

Built as a practical project exploring LLM APIs, semantic search, vector databases, caching, and full-stack development.
