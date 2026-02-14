import { useState } from "react";

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

  // ✅ loading state
  const [loading, setLoading] = useState(false);

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

    const res = await fetch(
      "https://discounted-jump-dad-seconds.trycloudflare.com/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: userId,   // ✅ UPDATED HERE
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

    setMessage("");
    setLoading(false);
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
