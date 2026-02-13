import { useState } from "react";

export default function Chat() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // ✅ 1️⃣ Loading state
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {

    if (!message.trim()) return;

    // show user message immediately
    setMessages([
      ...messages,
      { role: "user", text: message }
    ]);

    setLoading(true); // ✅ 2️⃣ START loading

    const res = await fetch(
      "https://workplace-sells-brick-gradually.trycloudflare.com/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: "demo_user",
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
    setLoading(false); // ✅ 3️⃣ STOP loading
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

        {/* ✅ SHOW WHILE AI IS RESPONDING */}
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
