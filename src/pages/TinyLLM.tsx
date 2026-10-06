import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Send, Sparkles, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TINYLLM_BACKEND = "https://tinny-llm-latest.onrender.com";

function getUserId() {
  let userId = localStorage.getItem("tinyllm_user_id");
  if (!userId) {
    userId = "user_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);
    localStorage.setItem("tinyllm_user_id", userId);
  }
  return userId;
}

type Message = { role: "user" | "ai"; text: string };

const TinyLLM: React.FC = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(true);
  const [healthStatus, setHealthStatus] = useState<string>("checking...");
  const [chatError, setChatError] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const userId = getUserId();
  const wakeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const stopWakeCheck = () => {
    if (wakeIntervalRef.current) {
      clearInterval(wakeIntervalRef.current);
      wakeIntervalRef.current = null;
    }
  };

  const startWakeCheck = () => {
    stopWakeCheck();
    checkHealth();
    wakeIntervalRef.current = setInterval(checkHealth, 8000);
  };

  const checkHealth = async () => {
    try {
      const res = await fetch(`${TINYLLM_BACKEND}/health`, { signal: AbortSignal.timeout?.(5000) as any });
      if (res.ok) {
        const data = await res.json();
        const ready = data.status === "running";
        setHealthStatus(ready ? "ready" : "loading");
        if (ready && isWakingUp) {
          setIsWakingUp(false);
          stopWakeCheck();
        }
      } else {
        setHealthStatus("waking");
      }
    } catch {
      setHealthStatus("waking");
    }
  };

  useEffect(() => {
    if (isWakingUp) {
      startWakeCheck();
    }
    return () => stopWakeCheck();
  }, [isWakingUp]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage: Message = { role: "user", text: message.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${TINYLLM_BACKEND}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage.text,
          max_tokens: 128,
        }),
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const aiMessage: Message = { role: "ai", text: "" };
      setMessages((prev) => [...prev, aiMessage]);

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last.role === "ai") {
              last.text += chunk;
            }
            return updated;
          });
        }
        setChatError("");
      } catch (error) {
        console.error("TinyLLM stream error:", error);
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "ai") {
            last.text = "⚠️ Stream interrupted. Backend may have gone to sleep.";
          }
          return updated;
        });
        setIsWakingUp(true);
        startWakeCheck();
      }
    } catch (error) {
      console.error("TinyLLM error:", error);
      setChatError("⚠️ Could not connect to TinyLLM. The server may still be waking up.");
      setIsWakingUp(true);
      startWakeCheck();
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ Could not connect to TinyLLM. The server may still be waking up." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([]);
    localStorage.removeItem("tinyllm_user_id");
  };

  return (
    <div className="dark min-h-screen bg-[#030712] text-slate-50 selection:bg-emerald-500/30 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #030712; -webkit-font-smoothing: antialiased; }
        .font-code { font-family: 'Space Mono', monospace; }
        .typing-dot { animation: blink 1.2s infinite ease-in-out; }
        @keyframes blink { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .35; transform: scale(.9); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>

      {/* Backend Waking Up Overlay */}
      <AnimatePresence>
        {isWakingUp && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[100] bg-[#030712] flex flex-col items-center justify-center p-6"
          >
            <div className="flex flex-col items-center justify-center gap-4 text-emerald-200">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500/30 border-t-emerald-500"></div>
              <span className="text-xs font-code">
                {healthStatus === "checking" ? "Checking TinyLLM status..." : "Waking TinyLLM backend..."}
              </span>
              <span className="text-[10px] text-slate-500">tinny-llm-latest.onrender.com</span>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="absolute bottom-12 flex flex-col items-center gap-4"
            >
              <p className="text-slate-500 text-xs text-center max-w-xs px-6">
                First request can take 40–80 seconds on Render free tier.
              </p>
              <button
                onClick={() => setIsWakingUp(false)}
                className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all text-sm font-bold active:scale-95"
              >
                Enter Chat Anyway
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#030712]/85 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-all px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Home
            </Link>
            <div className="h-5 w-px bg-white/10 hidden sm:block" />
            <span className="text-sm font-bold text-white hidden sm:inline">TinyLLM</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
              <span className={`w-1.5 h-1.5 rounded-full ${healthStatus === "ready" ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`}></span>
              <span className="text-emerald-400 hidden sm:inline">{healthStatus === "ready" ? "Backend Ready" : "Waking Up"}</span>
            </div>
            <button
              onClick={resetChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all text-xs font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Chat Area */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pb-4">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-center px-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-emerald-400" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white mb-3">TinyLLM Chat</h1>
                <p className="text-sm text-slate-400 max-w-md mb-8">
                  Running TinyLlama-1.1B locally on Render. Ask me anything — no data leaves this isolated backend.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["Hello!", "Tell me a fun fact", "What can you do?", "Explain quantum computing"].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setMessage(suggestion)}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-all font-medium"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-emerald-600 text-white rounded-br-md"
                        : "bg-slate-900/60 border border-white/10 text-slate-200 rounded-bl-md"
                    }`}
                  >
                    <p className="text-xs font-black uppercase tracking-widest mb-1 opacity-60">
                      {msg.role === "user" ? "You" : "TinyLlama"}
                    </p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text || <span className="typing-dot">.</span>}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && messages[messages.length - 1]?.role !== "ai" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-slate-900/60 border border-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 typing-dot"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 typing-dot" style={{ animationDelay: "0.2s" }}></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 typing-dot" style={{ animationDelay: "0.4s" }}></span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/5 pt-4">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message TinyLLM..."
                  disabled={loading}
                  className="w-full bg-slate-900/90 border border-white/20 rounded-2xl px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-code">Enter ↵</span>
              </div>
              <button
                onClick={sendMessage}
                disabled={!message.trim() || loading}
                className="shrink-0 w-12 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-emerald-600/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 px-1">
              <span className="text-[10px] text-slate-500 font-code">TinyLlama-1.1B · GGUF Quantized</span>
              <Link to="/how-its-make-tiny-llm" className="text-[10px] text-emerald-400 hover:text-emerald-300 font-code transition-colors">
                How It's Made →
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-4 border-t border-white/5 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 font-code">
        <span>TinyLLM · Render Free Tier · 2026</span>
        <a href="https://github.com/Ayushvish0512/tiny-llm" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
          GitHub
        </a>
      </footer>
    </div>
  );
};

export default TinyLLM;
