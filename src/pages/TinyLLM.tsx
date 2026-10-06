import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Sparkles, RefreshCw, Command, Cpu, Terminal, Zap, MessageSquare } from "lucide-react";
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
  const [healthStatus, setHealthStatus] = useState<string>("checking");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const userId = getUserId();
  const wakeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const stopWakeCheck = () => {
    if (wakeTimerRef.current) {
      clearInterval(wakeTimerRef.current);
      wakeTimerRef.current = null;
    }
  };

  const checkHealth = async () => {
    try {
      const res = await fetch(`${TINYLLM_BACKEND}/health`, {
        signal: AbortSignal.timeout(5000),
      } as any);
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
      checkHealth();
      wakeTimerRef.current = setInterval(checkHealth, 8000);
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
    } catch (error) {
      console.error("TinyLLM error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Could not connect to TinyLLM. The server may still be waking up." },
      ]);
      setIsWakingUp(true);
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
    <div className="dark min-h-screen bg-[#020617] text-slate-200 selection:bg-emerald-500/30 overflow-x-hidden relative font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        body { 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          background-color: #020617; 
          -webkit-font-smoothing: antialiased; 
        }
        .font-code { font-family: 'Space Mono', monospace; }
        
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #1e293b; 
          border-radius: 10px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }

        /* Gradient Text */
        .text-gradient {
          background: linear-gradient(to right, #34d399, #2dd4bf);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        /* Glass Effect */
        .glass-panel {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
      `}</style>

      {/* Waking Up Overlay */}
      <AnimatePresence>
        {isWakingUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[100] bg-[#020617]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"></div>
              <div className="relative flex flex-col items-center justify-center gap-6 p-8 rounded-3xl glass-panel shadow-2xl shadow-emerald-900/20">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-500/30 border-t-emerald-400"></div>
                  <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                </div>
                
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {healthStatus === "checking" ? "Initializing Neural Net..." : "Waking TinyLLM Backend..."}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono bg-slate-900/50 px-3 py-1 rounded-full inline-block">
                    tinny-llm-latest.onrender.com
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Cpu className="w-3 h-3" />
                  <span>Loading TinyLlama-1.1B Model</span>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="absolute bottom-16 flex flex-col items-center gap-4"
            >
              <p className="text-slate-500 text-xs text-center max-w-xs px-6 leading-relaxed">
                First request can take 40–80 seconds on Render free tier.
                <br />Please wait while we spin up the instance.
              </p>
              <button
                onClick={() => setIsWakingUp(false)}
                className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-emerald-500/30 transition-all text-sm font-semibold active:scale-95"
              >
                Enter Chat Anyway
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-panel border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all px-3 py-1.5 rounded-lg hover:bg-white/5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            
            <div className="h-6 w-px bg-white/10 hidden sm:block" />
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white leading-none">TinyLLM</span>
                <span className="text-[10px] text-slate-500 font-mono leading-none mt-1">v1.1 Beta</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
              healthStatus === "ready" 
                ? "bg-emerald-500/10 border-emerald-500/20" 
                : "bg-amber-500/10 border-amber-500/20"
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                healthStatus === "ready" 
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" 
                  : "bg-amber-400 animate-pulse"
              }`}></span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${
                healthStatus === "ready" ? "text-emerald-400" : "text-amber-400"
              }`}>
                {healthStatus === "ready" ? "Online" : "Waking"}
              </span>
            </div>

            <button
              onClick={resetChat}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-xs font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Chat Area */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto space-y-6 pb-6 custom-scrollbar pr-2">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-center px-4"
              >
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"></div>
                  <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center shadow-2xl shadow-emerald-500/10">
                    <Terminal className="w-12 h-12 text-emerald-400" />
                  </div>
                </div>
                
                <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
                  Tiny<span className="text-gradient">LLM</span> Chat
                </h1>
                
                <p className="text-base text-slate-400 max-w-lg mb-10 leading-relaxed">
                  Running TinyLlama-1.1B locally on Render. 
                  <span className="block mt-2 text-slate-500 text-sm">
                    Private, offline-capable AI chat — no data leaves this isolated backend.
                  </span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md w-full">
                  {[
                    { icon: MessageSquare, text: "Hello!" },
                    { icon: Sparkles, text: "Tell me a fun fact" },
                    { icon: Cpu, text: "What can you do?" },
                    { icon: Terminal, text: "Explain quantum computing" },
                  ].map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMessage(suggestion.text)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 hover:text-white hover:bg-white/10 hover:border-emerald-500/30 transition-all font-medium text-left group"
                    >
                      <suggestion.icon className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                      {suggestion.text}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 shadow-lg ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-br-none shadow-emerald-900/20"
                        : "bg-slate-900/80 border border-white/10 text-slate-100 rounded-bl-none shadow-black/20 backdrop-blur-sm"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2 opacity-70">
                      {msg.role === "user" ? (
                        <>
                          <span className="text-[10px] font-black uppercase tracking-widest">You</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">TinyLlama</span>
                        </>
                      )}
                    </div>
                    
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words font-light">
                      {msg.text || (
                        <span className="inline-flex gap-1.5 items-center h-5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0ms]"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:150ms]"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:300ms]"></span>
                        </span>
                      )}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/5 pt-6">
            <div className="relative group">
              {/* Glow effect on focus */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
              
              {/* Input container */}
              <div className="relative flex items-center bg-slate-900/90 border border-white/10 rounded-2xl focus-within:border-violet-500/50 focus-within:bg-slate-900 transition-all duration-300 shadow-xl shadow-black/20">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message TinyLLM..."
                  disabled={loading}
                  className="flex-1 bg-transparent border-0 rounded-2xl pl-5 pr-14 py-4 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-0 disabled:opacity-50"
                />
                
                {/* Right side controls */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <kbd className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-[10px] text-slate-400 font-mono">
                    <Command className="w-3 h-3" />
                    <span>↵</span>
                  </kbd>
                  
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim() || loading}
                    className="shrink-0 w-10 h-10 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-600 text-white flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-4 h-4 ml-0.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom info bar */}
            <div className="flex items-center justify-between mt-3 px-1">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5">
                  <Cpu className="w-3 h-3 text-slate-500" />
                  <span className="text-[10px] text-slate-500 font-mono">TinyLlama-1.1B</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5">
                  <Terminal className="w-3 h-3 text-slate-500" />
                  <span className="text-[10px] text-slate-500 font-mono">GGUF Q4_K_M</span>
                </div>
                {message.length > 0 && (
                  <span className="text-[10px] text-slate-600 font-mono ml-2">
                    {message.length}/500 chars
                  </span>
                )}
              </div>
              
              <Link
                to="/how-its-make-tiny-llm"
                className="text-[10px] text-violet-400/80 hover:text-violet-400 font-mono transition-colors flex items-center gap-1.5 group"
              >
                How It's Made 
                <ArrowLeft className="w-3 h-3 rotate-180 group-hover:translate-x-1 transition-transform text-violet-400" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
            <span>TinyLLM</span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <span>Render Free Tier</span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <span>2026</span>
          </div>
          <p className="text-[10px] text-slate-700">
            Powered by TinyLlama · Built with React & Tailwind
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TinyLLM;