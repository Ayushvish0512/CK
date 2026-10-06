import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Code, Rocket, AlertCircle, CheckCircle2, Zap, Globe } from "lucide-react";

const timeline = [
  {
    phase: "01 — Ideation",
    title: "Why TinyLlama?",
    icon: Sparkles,
    color: "text-emerald-400",
    border: "border-emerald-500/30",
    gradient: "from-emerald-500/20 to-teal-500/20",
    body: "Wanted a local LLM that runs on constrained hardware (≤ 400MB RAM). TinyLlama-1.1B is the sweet spot: small enough to quantize, large enough to chat.",
  },
  {
    phase: "02 — Model Prep",
    title: "Quantization & GGUF",
    icon: Code,
    color: "text-blue-400",
    border: "border-blue-500/30",
    gradient: "from-blue-500/20 to-cyan-500/20",
    body: "Used llama.cpp to convert the original PyTorch weights to GGUF format. Applied Q4_K_M quantization — cuts model size from ~2.2GB down to ~700MB while retaining most reasoning ability.",
  },
  {
    phase: "03 — Backend",
    title: "FastAPI + Streaming",
    icon: Rocket,
    color: "text-purple-400",
    border: "border-purple-500/30",
    gradient: "from-purple-500/20 to-pink-500/20",
    body: "Built a minimal FastAPI service with async streaming. The /chat endpoint streams tokens one-by-one for instant perceived speed. CORS enabled for cross-origin frontend access.",
  },
  {
    phase: "04 — Deployment",
    title: "Render Free Tier",
    icon: Globe,
    color: "text-amber-400",
    border: "border-amber-500/30",
    gradient: "from-amber-500/20 to-orange-500/20",
    body: "Deployed on Render's free tier. Cold starts take 40–80 seconds. The wake-up page monitors the /health endpoint and auto-launches once the backend is ready.",
  },
];

const challenges = [
  {
    title: "Cold Start Latency",
    description: "Render free-tier instances spin down after 15 minutes of inactivity. First request blocks for 40–80s.",
    solution: "Implemented a dedicated wake-up page with exponential back-off polling on the /health endpoint.",
    icon: AlertCircle,
  },
  {
    title: "Memory Pressure",
    description: "TinyLlama-1.1B even quantized needs ~400MB. Render free tier has only 512MB RAM.",
    solution: "Used Q4_K_M quantization and removed all non-essential dependencies from the FastAPI service.",
  },
  {
    title: "Streaming Overhead",
    description: "The model generates tokens one at a time; slow streaming kills UX on Render's limited CPU.",
    solution: "Reduced max_tokens default to 128 and added a clean_chunk filter to strip artifacts mid-stream.",
  },
  {
    title: "Prompt Engineering",
    description: "TinyLlama has limited context. Long prompts exhaust its tiny window and degrade responses.",
    solution: "Built a compact chat-template prompt with system prefix, keeping each turn under 300 chars.",
  },
];

const HowItsMakeTinyLLM: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 selection:bg-emerald-500/30 relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.1),transparent_60%)]" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#030712]/85 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link
            to="/wake/tinyllm"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-all px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Wake-Up
          </Link>
          <span className="text-xs font-code text-slate-500">C:\web\Tiny-LLM</span>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-mono mb-4">
            <Sparkles className="w-3 h-3" />
            Engineering Build Log
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
            How It's Made — <span className="text-emerald-400">TinyLLM</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
            Building a private, offline-capable LLM chat on Render's free tier required solving cold starts,
            memory pressure, and streaming latency. Here's the full engineering story.
          </p>
        </motion.section>

        {/* Timeline */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <Zap className="w-5 h-5 text-emerald-400" />
            Build Timeline
          </h2>
          <div className="grid gap-6">
            {timeline.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`relative rounded-3xl border ${step.border} bg-gradient-to-br ${step.gradient} backdrop-blur-xl p-6 sm:p-8`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <step.icon className={`w-5 h-5 ${step.color}`} />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">{step.phase}</span>
                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{step.body}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Challenges */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            Challenges & Solutions
          </h2>
          <div className="grid gap-5">
            {challenges.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <item.icon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                </div>
                <div className="ml-8 space-y-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">Problem</span>
                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{item.description}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Solution</span>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5">{item.solution}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <Code className="w-5 h-5 text-blue-400" />
            Tech Stack
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["TinyLlama-1.1B", "FastAPI", "llama.cpp", "GGUF Q4_K_M", "Render", "Streaming", "Pydantic", "CORS"].map((tech) => (
              <div key={tech} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
                <span className="text-xs font-bold text-slate-200">{tech}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="bg-gradient-to-br from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <Sparkles size={120} />
            </div>
            <div className="relative z-10 max-w-2xl">
              <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold">Try It Live</span>
              <h3 className="text-xl sm:text-3xl font-bold text-white mt-1 mb-3">
                Ready to chat with TinyLLM?
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Open the chat interface and start a private, offline-capable conversation with TinyLlama-1.1B running on Render.
              </p>
              <Link
                to="/tinyllm"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                Open TinyLLM Chat <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-6 text-center text-xs text-slate-500 font-code">
        TinyLLM Build Log · C:\web\Tiny-LLM · 2026
      </footer>
    </div>
  );
};

export default HowItsMakeTinyLLM;