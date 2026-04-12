import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, LogOut, Flame, Play, CheckCircle2, AlertCircle, Sparkles, Volume2, History, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'https://speakbetter-lgfr.onrender.com';

const SpeakBetter = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState<'landing' | 'app'> (token ? 'app' : 'landing');
  const [isLogin, setIsLogin] = useState(true);
  
  // Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Task State
  const [task, setTask] = useState<{task_en: string, task_hi: string, date: string} | null>(null);
  const [streak, setStreak] = useState(0);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (token) {
      loadInitialData();
    }
  }, [token]);

  const loadInitialData = async () => {
    try {
      const [taskRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/task/`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/progress/stats`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (taskRes.ok) setTask(await taskRes.json());
      if (statsRes.ok) {
        const stats = await statsRes.json();
        setStreak(stats.streak);
      }
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  const handleAuth = async () => {
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);
        setView('app');
        toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
      } else {
        toast.error(data.detail || "Authentication failed");
      }
    } catch (err) {
      toast.error("Could not connect to the server");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setView('landing');
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error("Audio recording not supported");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        submitAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Listening...");
    } catch (err: any) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsAnalyzing(true);
    }
  };

  const submitAudio = async (blob: Blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'recording.webm');

    try {
      const res = await fetch(`${API_BASE_URL}/submit/audio`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (!res.ok) throw new Error("Analysis failed");
      
      const result = await res.json();
      setFeedback(result);
      setStreak(result.streak);
      setIsAnalyzing(false);
      
      if (result.audio_data) {
        const audio = new Audio(`data:audio/wav;base64,${result.audio_data}`);
        audio.play();
      }
      toast.success("AI Coach analyzed your speech!");
    } catch (err) {
      toast.error("Error analyzing speech");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6"
          >
            <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-8"
                >
                  <Sparkles size={32} className="text-white" />
                </motion.div>
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-5xl md:text-7xl font-black mb-6 leading-tight"
                >
                  Speak with <br /> 
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Confidence.</span>
                </motion.h1>
                <p className="text-lg text-slate-400 mb-8 max-w-md">
                   Master English through real-time conversations with your personal AI Coach. 
                   Daily challenges, instant corrections, and personalized feedback.
                </p>
                <div className="flex gap-4 items-center">
                   <div className="flex -space-x-3">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800" />
                      ))}
                   </div>
                   <p className="text-sm text-slate-500 font-medium font-mono">JOIN 20,000+ LEARNERS</p>
                </div>
              </div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-2xl shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">{isLogin ? "Welcome back" : "Create Account"}</CardTitle>
                    <CardDescription>
                      {isLogin ? "Ready for your daily session?" : "Start your journey to fluency today."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!isLogin && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                        <Input 
                          placeholder="John Doe" 
                          value={name} 
                          onChange={e => setName(e.target.value)}
                          className="bg-slate-800/50 border-slate-700" 
                        />
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                      <Input 
                        placeholder="email@example.com" 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)}
                        className="bg-slate-800/50 border-slate-700" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
                      <Input 
                        placeholder="••••••••" 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        className="bg-slate-800/50 border-slate-700" 
                      />
                    </div>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-500 h-12 text-lg font-bold shadow-lg shadow-indigo-600/20" onClick={handleAuth}>
                      {isLogin ? "Sign In" : "Get Started"}
                    </Button>
                    <p className="text-sm text-center text-slate-400 pt-2">
                      {isLogin ? "New to SpeakBetter?" : "Already have an account?"}
                      <button 
                        className="ml-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
                        onClick={() => setIsLogin(!isLogin)}
                      >
                        {isLogin ? "Create Account" : "Login Now"}
                      </button>
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 container mx-auto px-6 py-12 pb-24"
          >
            {/* Nav */}
            <nav className="flex justify-between items-center mb-12">
               <div className="flex items-center gap-8">
                  <Link to="/" className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    SpeakBetter
                  </Link>
                  <div className="hidden md:flex items-center gap-4">
                    <Link to="/progress" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                       <History size={16} /> History
                    </Link>
                    <Link to="/profile" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                       <User size={16} /> Profile
                    </Link>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-400 rounded-2xl border border-orange-500/20 text-sm font-black shadow-lg shadow-orange-500/5">
                    <Flame size={16} fill="currentColor" /> {streak} DAY STREAK
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:text-rose-400 rounded-xl bg-slate-900 border border-slate-800">
                    <LogOut size={20} />
                  </Button>
               </div>
            </nav>

            <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-12">
               {/* Main Content */}
               <div className="lg:col-span-8 space-y-8">
                  <header>
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">Daily Challenge</p>
                    <h2 className="text-4xl md:text-5xl font-black">{task?.task_en || "Ready for today?"}</h2>
                    <p className="text-xl text-slate-400 mt-4 leading-relaxed italic">{task?.task_hi}</p>
                  </header>

                  {/* Recording Studio */}
                  <div className="relative aspect-[16/9] md:aspect-[21/9] bg-slate-900/20 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-3xl flex items-center justify-center p-8">
                     <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
                     
                     <div className="flex flex-col items-center gap-8 relative z-10 w-full max-w-sm">
                         {isRecording && (
                            <div className="flex items-center gap-1 h-8 mb-4">
                               {[...Array(12)].map((_, i) => (
                                 <motion.div
                                   key={i}
                                   animate={{ height: [4, 24, 4] }}
                                   transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.05 }}
                                   className="w-1 bg-indigo-400 rounded-full"
                                 />
                               ))}
                            </div>
                         )}
                         
                         <motion.button
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                           onClick={isRecording ? stopRecording : startRecording}
                           disabled={isAnalyzing}
                           className={`relative w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500 group ${
                             isRecording 
                             ? 'bg-rose-500 shadow-rose-500/40' 
                             : 'bg-indigo-600 shadow-indigo-600/40 hover:shadow-indigo-500/60'
                           } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                         >
                            {isAnalyzing ? (
                              <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : isRecording ? (
                              <div className="w-8 h-8 bg-white rounded-lg" />
                            ) : (
                              <Mic size={40} className="text-white group-hover:scale-110 transition-transform" />
                            )}
                            
                            {/* Pulse Rings */}
                            {isRecording && (
                               <div className="absolute inset-0 rounded-3xl animate-ping-slow bg-rose-500/30 -z-10" />
                            )}
                         </motion.button>
                         
                         <div className="text-center">
                            <h4 className="font-bold text-lg mb-1">
                               {isRecording ? "Listening..." : isAnalyzing ? "AI Coach is thinking..." : "Tap to record"}
                            </h4>
                            <p className="text-slate-400 text-sm font-medium">Record yourself speaking the English sentence above.</p>
                         </div>
                     </div>
                  </div>

                  {/* Feedback Section */}
                  <AnimatePresence>
                    {feedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                         <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                               <Sparkles className="text-indigo-400" /> Session Analysis
                            </h3>
                            <div className="flex items-center gap-3">
                               <div className="text-right">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mastery Score</p>
                                  <p className="text-3xl font-black text-emerald-400">{feedback.score}/10</p>
                               </div>
                            </div>
                         </div>

                         <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl hover:border-slate-700 transition-colors group">
                               <div className="flex items-center gap-2 mb-4 text-emerald-400">
                                  <CheckCircle2 size={18} />
                                  <span className="text-xs font-black uppercase tracking-widest">Recommended Version</span>
                               </div>
                               <p className="text-lg leading-relaxed font-medium">{feedback.corrected}</p>
                               <Button variant="ghost" size="sm" className="mt-4 text-slate-400 hover:text-white p-0 gap-2">
                                  <Volume2 size={16} /> Listen to model
                               </Button>
                            </div>
                            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl hover:border-slate-700 transition-colors">
                               <div className="flex items-center gap-2 mb-4 text-indigo-400">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                  <span className="text-xs font-black uppercase tracking-widest">Your Input</span>
                               </div>
                               <p className="text-lg leading-relaxed text-slate-400 italic">"{feedback.user_input || "..."}"</p>
                            </div>
                         </div>

                         <div className="p-8 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 rounded-3xl relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
                                <Sparkles size={80} />
                             </div>
                             <div className="flex gap-4 relative z-10">
                                <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 items-center justify-center shrink-0">
                                   <Sparkles size={24} />
                                </div>
                                <div>
                                   <h4 className="font-bold text-indigo-400 mb-2">Coach's Advice</h4>
                                   <p className="text-slate-300 leading-relaxed text-lg">{feedback.feedback}</p>
                                </div>
                             </div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>

               {/* Sidebar */}
               <div className="lg:col-span-4 space-y-6">
                  <Card className="bg-slate-900/30 border-slate-800 rounded-3xl">
                     <CardHeader>
                        <CardTitle className="text-lg">Coach's Tips</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <TipCard 
                          icon={<Volume2 className="text-blue-400" size={16} />}
                          text="Enunciate every syllable clearly to improve your accuracy score."
                        />
                        <TipCard 
                          icon={<History className="text-amber-400" size={16} />}
                          text="Review your previous sessions in history to track common mistakes."
                        />
                        <TipCard 
                          icon={<AlertCircle className="text-emerald-400" size={16} />}
                          text="Daily practice of just 5 minutes is better than 1 hour weekly."
                        />
                     </CardContent>
                  </Card>

                  <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl text-white shadow-xl shadow-indigo-600/10">
                     <h4 className="font-bold mb-2">Pro Subscription</h4>
                     <p className="text-sm opacity-80 mb-6 font-medium leading-relaxed">Unlock unlimited AI corrections and detailed mastery reports.</p>
                     <Button className="w-full bg-white text-indigo-600 hover:bg-slate-100 font-bold rounded-xl h-12">Upgrade Now</Button>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TipCard = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="flex gap-3 p-4 bg-slate-800/20 border border-white/5 rounded-2xl items-start">
    <div className="mt-1">{icon}</div>
    <p className="text-xs text-slate-400 leading-normal font-medium">{text}</p>
  </div>
);

export default SpeakBetter;
