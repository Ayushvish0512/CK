import React from "react";
import { motion } from "framer-motion";
import { 
  HeartPulse, 
  MessageSquareText, 
  CloudSun, 
  Zap, 
  Mic2, 
  Mail, 
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Globe
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const projects = [
  {
    title: "SpeakBetter",
    icon: <Mic2 className="w-8 h-8 text-blue-400" />,
    description: "AI-Powered English Speech Coach for Hindi speakers.",
    status: "Live",
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
    threeWs: {
      why: "To bridge the gap between understanding and speaking English for Hindi speakers by providing a judgment-free practice environment.",
      what: "A multimodal AI coach using Gemini 1.5/2.0 that provides real-time corrections, native-audio imprinting (shadowing), and contextual Hindi explanations.",
      whom: "Hindi-speaking ESL learners looking to build speaking confidence and fluency through daily active practice."
    },
    link: "/speakbetter"
  },
  {
    title: "Wellness AI",
    icon: <HeartPulse className="w-8 h-8 text-rose-400" />,
    description: "Your Digital Health & Wellness Companion.",
    status: "Completed",
    color: "from-rose-500/20 to-orange-500/20",
    border: "border-rose-500/30",
    threeWs: {
      why: "To democratize access to personalized health guidance while solving information overload and protecting user privacy with offline-first tech.",
      what: "An intelligent, context-aware health mentor that tracks lifestyle goals (sleep, nutrition, stress) using a persistent local memory system.",
      whom: "Individuals seeking affordable, private, 24/7 wellness coaching without the high cost of personal trainers or cloud privacy risks."
    }
  },
  {
    title: "Meta Ads AI Agent",
    icon: <Zap className="w-8 h-8 text-purple-400" />,
    description: "Multi-agent AI Growth system for performance marketing.",
    status: "Hold (Vector DB)",
    color: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/30",
    threeWs: {
      why: "To automate complex Meta Ads optimization and reporting while ensuring strict compliance in sensitive sectors like women’s health.",
      what: "A multi-agent system (n8n + Gemini) that ingests performance data, generates audits, creates compliant copy, and executes approved scaling actions.",
      whom: "Performance marketers and brand founders looking to increase learning velocity and decrease CPA through AI-driven decision making."
    }
  },
  {
    title: "Text AI",
    icon: <MessageSquareText className="w-8 h-8 text-emerald-400" />,
    description: "Lightweight Local LLM API (TinyLlama).",
    status: "Completed",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
    threeWs: {
      why: "To demonstrate the feasibility of running powerful language models on extremely constrained hardware (≤ 400 MB RAM) without internet dependency.",
      what: "A high-speed FastAPI service serving a quantized TinyLlama-1.1B model for private, offline chat capabilities.",
      whom: "Developers and privacy enthusiasts needing a local, low-resource AI backend for embedded or secure applications."
    }
  },
  {
    title: "Weather Prediction ML",
    icon: <CloudSun className="w-8 h-8 text-amber-400" />,
    description: "Localized temperature forecasting system.",
    status: "Completed",
    color: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/30",
    threeWs: {
      why: "To provide specialized, local weather predictions that outperform generic global models by training on specific city-level data history.",
      what: "An end-to-end ML pipeline that collects historical data via OpenWeather API, trains a Scikit-learn model, and serves predictions via FastAPI.",
      whom: "Local businesses or developers needing precise, API-driven temperature forecasts for logistical or operational planning."
    }
  }
];

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl -z-10" />
        
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-1 border-blue-500/30 text-blue-400 bg-blue-500/5 backdrop-blur-sm">
              AI & Automation Expert
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-500">
              Building the Future <br /> of Intelligent Systems
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              I specialize in creating high-performance AI agents, localized LLM systems, 
              and automated marketing pipelines that drive real-world impact.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#projects" 
                className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center gap-2"
              >
                View Projects <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="mailto:ayushvishwakarma0512@gmail.com"
                className="px-8 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-medium transition-all border border-slate-700 flex items-center gap-2"
              >
                Let's Talk <Mail className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Projects Section */}
      <section id="projects" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Portfolio</h2>
              <p className="text-slate-400 text-lg">
                A selection of AI projects focusing on large language models, 
                multimodal interaction, and production-grade automation.
              </p>
            </div>
            <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-slate-500 font-bold">
              <span>01 / Why</span>
              <span>02 / What</span>
              <span>03 / Whom</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative rounded-3xl overflow-hidden border ${project.border} bg-gradient-to-br ${project.color} backdrop-blur-xl p-8 md:p-12`}
              >
                {/* Visual Accent */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700" />
                
                <div className="flex flex-col md:flex-row gap-8 relative z-10">
                  <div className="md:w-1/3">
                    <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit border border-white/10">
                      {project.icon}
                    </div>
                    <Badge variant="secondary" className="mb-4 bg-white/10 hover:bg-white/20 text-slate-200 border-none">
                      {project.status}
                    </Badge>
                    <h3 className="text-3xl font-bold mb-4 text-white">{project.title}</h3>
                    <p className="text-slate-400 mb-6 text-lg">
                      {project.description}
                    </p>
                    {project.link && (
                      <Link 
                        to={project.link} 
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/10 group/btn"
                      >
                        Launch App 
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    )}
                  </div>
                  
                  <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8 md:border-l md:border-white/10 md:pl-8">
                    <div className="space-y-3">
                      <div className="text-xs font-black uppercase tracking-[0.2em] text-blue-400/80 flex items-center gap-2">
                        <BrainCircuit className="w-3 h-3" /> Why
                      </div>
                      <p className="text-sm leading-relaxed text-slate-300">
                        {project.threeWs.why}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400/80 flex items-center gap-2">
                        <Zap className="w-3 h-3" /> What
                      </div>
                      <p className="text-sm leading-relaxed text-slate-300">
                        {project.threeWs.what}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-xs font-black uppercase tracking-[0.2em] text-rose-400/80 flex items-center gap-2">
                        <Globe className="w-3 h-3" /> Whom
                      </div>
                      <p className="text-sm leading-relaxed text-slate-300">
                        {project.threeWs.whom}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 italic">"Building bridges between data and decisions."</h2>
          <div className="flex justify-center gap-8 text-slate-500">
            <span className="hover:text-blue-400 transition-colors cursor-pointer">GitHub</span>
            <span className="hover:text-blue-400 transition-colors cursor-pointer">LinkedIn</span>
            <span className="hover:text-blue-400 transition-colors cursor-pointer">Twitter</span>
          </div>
          <p className="mt-12 text-sm text-slate-600">
            © 2025 CK AI Labs. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

