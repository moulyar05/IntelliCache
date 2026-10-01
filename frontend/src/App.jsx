import { useState } from "react";
import { useEffect } from "react";
function App() {
  
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [cached, setCached] = useState(false);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("");
  const [responseTime, setResponseTime] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
const [cacheHits, setCacheHits] = useState(0);
const [totalCached, setTotalCached] = useState(0);
useEffect(() => {
  fetch("http://127.0.0.1:8000/stats")
    .then((response) => response.json())
    .then((data) => setTotalCached(data.total_cached));
}, []);


  const askQuestion = async () => {
  if (!question.trim()) return;

  setLoading(true);
  setAnswer("");

  const startTime = performance.now();

  try {
    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();

    const endTime = performance.now();
    setResponseTime(Math.round(endTime - startTime));
    setTotalRequests((prev) => prev + 1);

if (data.cached) {
  setCacheHits((prev) => prev + 1);
}
    setAnswer(data.answer);
    setCached(data.cached);
    setSource(data.source);
    fetch("http://127.0.0.1:8000/stats")
    .then((response) => response.json())
    .then((data) => setTotalCached(data.total_cached));
  } catch {
    setAnswer("Unable to connect to the backend.");
  }

  setLoading(false);
};

  return (
    <div style={styles.page}>

      {/* Background decoration */}
      <div style={styles.glowOne}></div>
      <div style={styles.glowTwo}></div>

      <nav style={styles.navbar}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          IntelliCache
        </div>

        <div style={styles.navStatus}>
          <span style={styles.greenDot}></span>
          System Online
        </div>

        <div style={{ color: "#737b98", fontSize: "12px", marginBottom: "15px" }}>
          Response time: {responseTime} ms
        </div>
      </nav>

      <main style={styles.main}>

        <div style={styles.badge}>
          ⚡ Intelligent LLM Caching
        </div>

        <h1 style={styles.title}>
          Ask anything.
          <br />
          <span style={styles.gradientText}>Get answers faster.</span>
        </h1>

        <p style={styles.subtitle}>
          IntelliCache uses semantic caching to deliver previously generated
          answers instantly and reduce unnecessary LLM requests.
        </p>

        <div style={styles.stats}>
  <div style={styles.statCard}>
    <span>⚡</span>
    <div>
      <small>Response Time</small>
      <strong>{responseTime ? `${responseTime} ms` : "--"}</strong>
    </div>
  </div>

  <div style={styles.statCard}>
    <span>◈</span>
    <div>
      <small>Cache Status</small>
      <strong>
        {source === "exact_cache"
          ? "Exact Hit"
          : source === "semantic_cache"
          ? "Semantic Hit"
          : source === "ai"
          ? "AI"
          : "--"}
      </strong>
    </div>
  </div>

  <div style={styles.statCard}>
  <span>🗂️</span>
<div>
  <small>Cached Questions</small>
  <strong>{totalCached}</strong>
</div>
</div>
</div>

        {/* Search box */}
        <div style={styles.searchCard}>
          <input
            type="text"
            placeholder="Ask your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") askQuestion();
            }}
            style={styles.input}
          />

          <button
            onClick={askQuestion}
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Thinking..." : "Ask AI →"}
          </button>
        </div>

        {/* Answer */}
        {answer && (
          <div style={styles.answerCard}>

            <div style={styles.answerHeader}>
              <span style={cached ? styles.cachedBadge : styles.aiBadge}>
                {source === "exact_cache"
                    ? "⚡ EXACT CACHE"
                    : source === "semantic_cache"
                    ? "🧠 SEMANTIC CACHE"
                    : "✦ AI GENERATED"}
              </span>

              <span style={styles.responseLabel}>
                Response
              </span>
            </div>

            <p style={styles.answer}>
              {answer}
            </p>
          </div>
        )}

        {/* Feature cards */}
        <div style={styles.features}>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>⚡</div>
            <h3>Instant Cache</h3>
            <p>Repeated questions receive cached responses instantly.</p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>◈</div>
            <h3>Semantic Search</h3>
            <p>Similar questions are detected using vector embeddings.</p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>◉</div>
            <h3>Smart Storage</h3>
            <p>MongoDB and Qdrant work together to manage cached data.</p>
          </div>

        </div>

      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 20% 20%, #18204a 0%, #080b18 35%, #05060d 100%)",
    color: "#ffffff",
    fontFamily: "Inter, Arial, sans-serif",
    position: "relative",
    overflow: "hidden",
  },

  glowOne: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "#5b5cf0",
    filter: "blur(180px)",
    opacity: 0.18,
    top: "-150px",
    left: "-100px",
  },

  glowTwo: {
    position: "absolute",
    width: "350px",
    height: "350px",
    background: "#00c6ff",
    filter: "blur(180px)",
    opacity: 0.12,
    bottom: "-150px",
    right: "-100px",
  },

  navbar: {
    height: "70px",
    padding: "0 7%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(5,6,13,0.55)",
    backdropFilter: "blur(15px)",
    position: "relative",
    zIndex: 2,
  },

  logo: {
    fontSize: "21px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },

  logoIcon: {
    marginRight: "9px",
    color: "#7c7cff",
  },

  navStatus: {
    fontSize: "13px",
    color: "#a8afc7",
  },

  greenDot: {
    display: "inline-block",
    width: "7px",
    height: "7px",
    background: "#35e69a",
    borderRadius: "50%",
    marginRight: "7px",
    boxShadow: "0 0 10px #35e69a",
  },

  main: {
    maxWidth: "900px",
    margin: "auto",
    padding: "80px 25px",
    textAlign: "center",
    position: "relative",
    zIndex: 1,
  },

  badge: {
    display: "inline-block",
    padding: "8px 15px",
    borderRadius: "30px",
    background: "rgba(124,124,255,0.12)",
    border: "1px solid rgba(124,124,255,0.25)",
    color: "#a7a7ff",
    fontSize: "13px",
    marginBottom: "25px",
  },

  title: {
    fontSize: "58px",
    lineHeight: "1.05",
    letterSpacing: "-2.5px",
    margin: "0",
  },

  gradientText: {
    background: "linear-gradient(90deg, #7c7cff, #31d6ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    maxWidth: "650px",
    margin: "25px auto 40px",
    color: "#9ca3bd",
    lineHeight: "1.7",
    fontSize: "16px",
  },

  searchCard: {
    display: "flex",
    padding: "8px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "16px",
    backdropFilter: "blur(20px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  },

  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#ffffff",
    padding: "16px",
    fontSize: "16px",
  },

  button: {
    border: "none",
    borderRadius: "11px",
    padding: "0 25px",
    background: "linear-gradient(135deg, #6969ff, #3bbfff)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },

  answerCard: {
    marginTop: "30px",
    padding: "25px",
    textAlign: "left",
    background: "rgba(255,255,255,0.055)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    backdropFilter: "blur(20px)",
  },

  answerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },

  cachedBadge: {
    color: "#35e69a",
    fontSize: "11px",
    fontWeight: "700",
  },

  aiBadge: {
    color: "#7c7cff",
    fontSize: "11px",
    fontWeight: "700",
  },

  responseLabel: {
    color: "#737b98",
    fontSize: "12px",
  },

  answer: {
    color: "#d9dced",
    lineHeight: "1.7",
    margin: 0,
  },

  features: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "15px",
    marginTop: "70px",
  },

  featureCard: {
    padding: "22px",
    textAlign: "left",
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "14px",
  },

  featureIcon: {
    color: "#7c7cff",
    fontSize: "22px",
  },
  stats: {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "12px",
  marginBottom: "25px",
},

statCard: {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "16px",
  textAlign: "left",
  background: "rgba(255,255,255,0.045)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
},

};

export default App;