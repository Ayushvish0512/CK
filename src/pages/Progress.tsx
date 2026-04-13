import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Calendar, Target, Award, Sparkles, Filter, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import WakingUpLoader from '@/components/WakingUpLoader';

const API_BASE_URL = 'https://speakbetter-lgfr.onrender.com';

const Progress = () => {
  const [token] = useState(localStorage.getItem('token'));
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isWakingUp, setIsWakingUp] = useState(false);

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const loadData = async () => {
    setIsWakingUp(true);
    try {
      const [historyRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/progress/history`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/progress/stats`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error("Failed to load progress data", err);
    } finally {
      setIsWakingUp(false);
    }
  };

  const chartData = history.slice().reverse().map((item) => ({
    name: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: item.score
  }));

  const avgScore = history.length > 0 
    ? (history.reduce((acc, curr) => acc + curr.score, 0) / history.length).toFixed(1) 
    : "0.0";

  return (
    <div className="dark min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30 pb-20 overflow-x-hidden">
      {isWakingUp && <WakingUpLoader message="Fetching progress data" />}
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 pt-12 relative z-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div className="flex items-center gap-6">
              <Link to="/speakbetter">
                <Button variant="ghost" size="icon" className="rounded-2xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800 transition-all">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <div>
                 <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Performance Analytics</p>
                 <h1 className="text-4xl md:text-5xl font-black">Your Progress</h1>
              </div>
           </div>
           <div className="flex gap-3">
              <Button variant="outline" className="bg-slate-900/40 border-slate-800 hover:bg-slate-800 gap-2 font-bold px-6">
                 <Filter size={16} /> Filters
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-500 font-bold px-6 shadow-lg shadow-indigo-600/20">
                 Share Progress
              </Button>
           </div>
        </header>

        {/* Stats Carousel-like Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           <StatMetric 
              label="Current Streak" 
              value={`${stats?.streak || 0}`} 
              suffix="Days" 
              icon={<Target className="text-indigo-400" />} 
              sub="Personal Record: 12"
              color="indigo"
           />
           <StatMetric 
              label="Growth Rate" 
              value={`${avgScore}`} 
              suffix="/10" 
              icon={<TrendingUp className="text-emerald-400" />} 
              sub="+12% from last month"
              color="emerald"
           />
           <StatMetric 
              label="Time Invested" 
              value={`${history.length}`} 
              suffix="Lessons" 
              icon={<Calendar className="text-purple-400" />} 
              sub="Avg 8 mins / session"
              color="purple"
           />
           <StatMetric 
              label="Rank" 
              value="Gold" 
              suffix="Level" 
              icon={<Award className="text-amber-400" />} 
              sub="Top 8% worldwide"
              color="amber"
           />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           {/* Chart Section */}
           <div className="lg:col-span-2 space-y-8">
              <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <TrendingUp size={120} />
                </div>
                <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between mb-8">
                  <div>
                    <CardTitle className="text-xl font-bold">Accuracy Trend</CardTitle>
                    <p className="text-sm text-slate-500 font-medium">Visualization of your last {history.length} sessions</p>
                  </div>
                  <div className="flex gap-2">
                     <span className="px-3 py-1 bg-slate-800 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-700">7 Days</span>
                     <span className="px-3 py-1 bg-indigo-500/20 rounded-lg text-[10px] font-black text-indigo-400 uppercase tracking-widest border border-indigo-500/20">30 Days</span>
                  </div>
                </CardHeader>
                <CardContent className="h-[340px] w-full px-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickMargin={15} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={[0, 10]} tickMargin={15} />
                      <Tooltip 
                        contentStyle={{ 
                           backgroundColor: '#0f172a', 
                           border: '1px solid #1e293b', 
                           borderRadius: '16px',
                           padding: '12px',
                           boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                           backdropFilter: 'blur(10px)'
                        }}
                        itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                        labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#6366f1" 
                        strokeWidth={4} 
                        fillOpacity={1} 
                        fill="url(#colorScore)" 
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* History Table */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                       <Sparkles className="text-indigo-400" size={20} /> Activity History
                    </h3>
                    <Button variant="link" className="text-indigo-400 font-bold p-0">View All</Button>
                 </div>
                 
                 <div className="space-y-4">
                    {history.map((session, i) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={i}
                        className="group p-1 bg-gradient-to-r from-transparent hover:from-indigo-500/10 to-transparent transition-all rounded-3xl"
                      >
                         <div className="p-6 bg-slate-900/30 border border-slate-800 hover:border-slate-700 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 translate-x-4 -translate-y-4 opacity-5 group-hover:opacity-10 transition-opacity">
                               <CheckCircle2 size={80} />
                            </div>
                            <div className="relative z-10 flex-1">
                               <div className="flex items-center gap-3 mb-2">
                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-800/80 px-2 py-0.5 rounded-md border border-white/5">
                                     {new Date(session.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                  </span>
                                  {session.score >= 8 && (
                                     <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">Perfect</span>
                                  )}
                               </div>
                               <div className="text-lg font-bold text-slate-200 mb-1 leading-tight line-clamp-1">"{session.user_input}"</div>
                               <div className="text-sm text-indigo-400/80 font-medium overflow-hidden text-ellipsis whitespace-nowrap">→ {session.corrected_text}</div>
                            </div>
                            <div className="flex items-center gap-6 relative z-10">
                               <div className="text-right">
                                  <div className="text-2xl font-black text-white">{session.score}<span className="text-xs text-slate-500 font-bold ml-0.5">/10</span></div>
                                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider mt-1">Consistency</p>
                               </div>
                               <div className="w-10 h-10 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                                  <ChevronRight size={20} />
                               </div>
                            </div>
                         </div>
                      </motion.div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Sidebar Info */}
           <div className="space-y-8">
              <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl p-8 rounded-3xl border-t-indigo-500/50">
                 <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Sparkles className="text-amber-400" size={18} /> AI Insight
                 </h4>
                 <div className="space-y-4">
                    <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                       <p className="text-sm text-slate-300 leading-relaxed">
                          Your accuracy in <strong>pronuncation</strong> has improved by 15% this week. Focus more on pace for the next level.
                       </p>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
                          <span>Grammar</span>
                          <span className="text-indigo-400">82%</span>
                       </div>
                       <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} className="h-full bg-indigo-500" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
                          <span>Vocabulary</span>
                          <span className="text-purple-400">65%</span>
                       </div>
                       <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-purple-500" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
                          <span>Confidence</span>
                          <span className="text-emerald-400">94%</span>
                       </div>
                       <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '94%' }} className="h-full bg-emerald-500" />
                       </div>
                    </div>
                 </div>
              </Card>

              <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl p-8 rounded-3xl">
                 <h4 className="text-lg font-bold mb-6">Upcoming Milestones</h4>
                 <div className="space-y-6">
                    <MilestoneItem 
                       title="Master Speaker" 
                       description="Maintain a 30-day streak" 
                       progress={stats?.streak || 0} 
                       total={30} 
                    />
                    <MilestoneItem 
                       title="Perfect Score" 
                       description="Get 10/10 in 5 lessons" 
                       progress={3} 
                       total={5} 
                    />
                 </div>
              </Card>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatMetric = ({ label, value, suffix, icon, sub, color }: any) => {
   const colors: any = {
      indigo: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5',
      emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
      purple: 'text-purple-400 border-purple-500/20 bg-purple-500/5',
      amber: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
   };

   return (
      <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl hover:bg-slate-900/60 transition-all group shadow-xl">
         <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
               <div className={`p-2.5 rounded-xl border ${colors[color]} group-hover:scale-110 transition-transform`}>
                  {icon}
               </div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
               <span className="text-4xl font-black">{value}</span>
               <span className="text-sm text-slate-500 font-bold uppercase tracking-tighter">{suffix}</span>
            </div>
            <p className="mt-4 text-[11px] font-medium text-slate-500 border-t border-white/5 pt-3">
               {sub}
            </p>
         </CardContent>
      </Card>
   );
};

const MilestoneItem = ({ title, description, progress, total }: any) => (
   <div className="relative">
      <div className="flex justify-between items-center mb-2">
         <div>
            <h5 className="text-sm font-bold text-slate-200">{title}</h5>
            <p className="text-[10px] text-slate-500 font-medium">{description}</p>
         </div>
         <div className="text-xs font-black text-indigo-400">{progress}/{total}</div>
      </div>
      <div className="h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-white/5">
         <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${(progress / total) * 100}%` }} 
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600" 
         />
      </div>
   </div>
)

export default Progress;
