import { useState } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
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

    setMessages([
      ...messages,
      { role: "user", text: message },
      { role: "ai", text: data.response }
    ]);

    setMessage("");
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
          <b>{m.role}:</b> {m.text}
        </p>
      ))}
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
    >
      Send
    </button>
  </div>
  );
}