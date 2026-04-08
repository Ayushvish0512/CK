import { useState, useEffect } from "react";

/* 
  ✅ TRULY INSTANT UPDATES (No Redeployments):
  To avoid a Netlify build every time your URL changes, host your 'url.json' 
  OUTSIDE of this repository. 
  
  Options: 
  1. A separate GitHub Repo (e.g., https://yourname.github.io/my-config/url.json)
  2. A GitHub Gist (Get the 'Raw' URL to the JSON file)
*/
const EXTERNAL_CONFIG_URL = "https://your-username.github.io/config-repo/url.json"; 
const DEFAULT_API_URL = "https://wellness-ai-i94p.onrender.com/chat";

/* ✅ CREATE UNIQUE USER ID (runs once per device) */
function getUserId() {
  let userId = localStorage.getItem("wellness_user_id");

  if (!userId) {
    userId =
      "user_" +
      Date.now() +
      "_" +
      Math.random().toString(36).substring(2, 8);

    localStorage.setItem("wellness_user_id", userId);
  }

  return userId;
}

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch API URL dynamically on mount
  useEffect(() => {
    const fetchApiUrl = async () => {
      try {
        const response = await fetch(EXTERNAL_CONFIG_URL);
        if (response.ok) {
          const data = await response.json();
          if (data.apiUrl) {
            // Ensure the URL ends correctly for the /chat endpoint if needed
            const url = data.apiUrl.endsWith("/chat") ? data.apiUrl : `${data.apiUrl}/chat`;
            setApiUrl(url);
          }
        }
      } catch (error) {
        console.error("Error fetching dynamic API URL:", error);
        // Fallback to default is already handled by initial state
      }
    };

    fetchApiUrl();
  }, []);

  // ✅ unique user id for this device
  const userId = getUserId();

  const sendMessage = async () => {
    if (!message.trim()) return;

    // show user message immediately
    setMessages([
      ...messages,
      { role: "user", text: message }
    ]);

    setLoading(true);

    try {
      const res = await fetch(
        apiUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id: userId,
            message: message,
            lifestyle_area: "energy"
          })
        }
      );

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: "ai", text: data.response }
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "Sorry, I'm having trouble connecting to the server. Please check your connection." }
      ]);
    } finally {
      setMessage("");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Wellness Chat</h2>

      <div style={{
        minHeight: "300px",
        border: "1px solid #ccc",
        padding: "10px",
        marginBottom: "10px"
      }}>
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.role === "user" ? "You" : "AI"}:</b> {m.text}
          </p>
        ))}

        {/* AI typing indicator */}
        {loading && (
          <p><b>AI:</b> Typing...</p>
        )}
      </div>

      <input
        style={{
          width: "100%",
          padding: "10px",
          border: "1px solid #ccc",
          marginBottom: "10px"
        }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />

      <button
        style={{
          padding: "10px 20px",
          cursor: "pointer"
        }}
        onClick={sendMessage}
        disabled={loading}
      >
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
}
