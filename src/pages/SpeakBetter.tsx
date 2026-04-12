import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, LogOut, Flame, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'https://speakbetter-lgfr.onrender.com'; // Adjust if your FastAPI is elsewhere

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
      toast.error("Your browser does not support audio recording. Use a modern browser like Chrome or Safari over HTTPS.");
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
      toast.success("Recording started... Speak now!");
    } catch (err: any) {
      console.error("Mic error:", err);
      if (err.name === 'NotAllowedError') {
        toast.error("Microphone permission denied. Please enable it in browser settings.");
      } else if (err.name === 'NotFoundError') {
        toast.error("No microphone found on this device.");
      } else {
        toast.error(`Recording error: ${err.message || 'Unknown error'}`);
      }
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
      toast.success("Analysis complete!");
    } catch (err) {
      toast.error("Error analyzing speech");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <motion.div 
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
          >
            <div className="max-w-3xl">
              <motion.h1 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
              >
                Master English <br /> with AI
              </motion.h1>
              <p className="text-xl text-slate-400 mb-12 max-w-xl mx-auto">
                The most advanced AI tutor for mastering spoken English. 
                Get real-time feedback, improve your grammar, and build a daily habit.
              </p>

              <Card className="max-w-md mx-auto bg-slate-900/50 border-slate-800 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>{isLogin ? "Welcome Back" : "Join the Future"}</CardTitle>
                  <CardDescription>
                    {isLogin ? "Log in to continue your journey" : "Create an account to start practicing"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isLogin && (
                    <Input 
                      placeholder="Your Name" 
                      value={name} 
                      onChange={e => setName(e.target.value)}
                      className="bg-slate-800/50 border-slate-700" 
                    />
                  )}
                  <Input 
                    placeholder="Email" 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className="bg-slate-800/50 border-slate-700" 
                  />
                  <Input 
                    placeholder="Password" 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    className="bg-slate-800/50 border-slate-700" 
                  />
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-500" onClick={handleAuth}>
                    {isLogin ? "Sign In" : "Create Account"}
                  </Button>
                  <p className="text-sm text-slate-500">
                    {isLogin ? "New here?" : "Already have an account?"}
                    <button 
                      className="ml-2 text-indigo-400 font-semibold hover:underline"
                      onClick={() => setIsLogin(!isLogin)}
                    >
                      {isLogin ? "Register now" : "Login instead"}
                    </button>
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 md:p-12 max-w-5xl mx-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  SpeakBetter
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full border border-orange-500/20 text-sm font-bold">
                  <Flame size={16} fill="currentColor" /> {streak} Day Streak
                </div>
                <Link to="/progress">
                   <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300">
                      Stats & Progress
                   </Button>
                </Link>
              </div>
              <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={handleLogout}>
                <LogOut size={20} className="mr-2" /> Logout
              </Button>
            </div>

            {/* Daily Task Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <Card className="bg-slate-900/30 border-slate-800 backdrop-blur-md overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{task?.date || "Today"}</span>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-indigo-400 text-sm font-bold uppercase tracking-widest">Today's Topic</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{task?.task_en || "Loading challenge..."}</h2>
                    <p className="text-xl text-slate-400 italic">{task?.task_hi}</p>

                    <div className="mt-12 flex flex-col items-center justify-center p-8 bg-slate-950/50 rounded-3xl border border-slate-800">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
                          isRecording ? 'bg-rose-500 shadow-rose-500/50' : 'bg-indigo-600 shadow-indigo-600/50'
                        }`}
                        onClick={isRecording ? stopRecording : startRecording}
                      >
                        {isRecording ? <div className="w-8 h-8 bg-white rounded-sm" /> : <Mic size={40} className="text-white" />}
                      </motion.button>
                      <p className="mt-6 text-slate-400 font-medium animate-pulse">
                        {isRecording ? "Listening... Tap to end" : isAnalyzing ? "Analyzing speech..." : "Tap to start speaking"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Feedback Display */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">Session Feedback</div>
                        <div className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 font-black text-xl">
                          {feedback.score}/10
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                          <label className="text-xs font-bold text-emerald-400 uppercase mb-2 block">Perfect Version</label>
                          <p className="text-lg leading-relaxed">{feedback.corrected}</p>
                        </div>
                        <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                          <label className="text-xs font-bold text-indigo-400 uppercase mb-2 block">Translation</label>
                          <p className="text-lg leading-relaxed">{feedback.hindi}</p>
                        </div>
                      </div>

                      <div className="p-6 bg-indigo-600/10 rounded-2xl border border-indigo-500/20">
                         <div className="flex gap-3">
                            <CheckCircle2 className="text-indigo-400 shrink-0" />
                            <div>
                                <h4 className="font-bold text-indigo-400 mb-1">Coach Note</h4>
                                <p className="text-slate-300">{feedback.feedback}</p>
                            </div>
                         </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <Card className="bg-slate-900/30 border-slate-800">
                   <CardHeader>
                      <CardTitle className="text-lg">Profile Management</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      <div className="space-y-2">
                         <label className="text-xs text-slate-500 font-bold uppercase">Display Name</label>
                         <div className="flex gap-2">
                            <Input 
                               placeholder="Your Name" 
                               value={name} 
                               onChange={e => setName(e.target.value)}
                               className="bg-slate-800/30 border-slate-700 h-9 text-sm"
                            />
                            <Button 
                               size="sm" 
                               className="bg-indigo-600 hover:bg-indigo-500"
                               onClick={async () => {
                                  try {
                                     const res = await fetch(`${API_BASE_URL}/auth/me`, {
                                        method: 'PUT',
                                        headers: { 
                                           'Authorization': `Bearer ${token}`,
                                           'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ name })
                                     });
                                     if (res.ok) toast.success("Profile updated!");
                                     else throw new Error();
                                  } catch (err) {
                                     toast.error("Failed to update profile");
                                  }
                               }}
                            >
                               Update
                            </Button>
                         </div>
                      </div>
                   </CardContent>
                </Card>

                <Card className="bg-slate-900/30 border-slate-800">
                   <CardHeader>
                      <CardTitle className="text-lg">Tips & Mastery</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-800 flex gap-3">
                         <AlertCircle className="text-amber-400 shrink-0" size={20} />
                         <p className="text-xs text-slate-400">Speak slowly and clearly for better recognition.</p>
                      </div>
                      <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-800 flex gap-3">
                         <AlertCircle className="text-blue-400 shrink-0" size={20} />
                         <p className="text-xs text-slate-400">Try to use full sentences to improve grammar score.</p>
                      </div>
                   </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpeakBetter;
