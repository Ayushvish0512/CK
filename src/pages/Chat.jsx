import { useState } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    const res = await fetch(
      "https://your-cloudflare-url/chat",
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
    <div>
      {messages.map((m, i) => (
        <p key={i}><b>{m.role}:</b> {m.text}</p>
      ))}

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
