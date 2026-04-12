import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Calendar, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const API_BASE_URL = 'https://speakbetter-lgfr.onrender.com';

const Progress = () => {
  const [token] = useState(localStorage.getItem('token'));
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const loadData = async () => {
    try {
      const [historyRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/progress/history`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/progress/stats`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (historyRes.ok) setHistory(await historyRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error("Failed to load progress data", err);
    }
  };

  const chartData = history.slice().reverse().map((item, index) => ({
    name: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: item.score
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <Link to="/practice">
            <Button variant="ghost" size="icon" className="rounded-full bg-slate-900 border border-slate-800">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-4xl font-black">Your Progress</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Target size={14} className="text-indigo-400" /> Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-indigo-400">{stats?.streak || 0} Days</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={14} className="text-emerald-400" /> Avg Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-emerald-400">
                {(history.reduce((acc, curr) => acc + curr.score, 0) / (history.length || 1)).toFixed(1)}/10
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} className="text-purple-400" /> Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-purple-400">{history.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Award size={14} className="text-amber-400" /> Mastery Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-amber-400">Intermediate</div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <Card className="bg-slate-900/30 border-slate-800 mb-12 p-6">
          <CardHeader>
            <CardTitle>Score History</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#6366f1' }}
                />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* History List */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
          {history.map((session, i) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="p-6 bg-slate-900/30 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="text-xs text-slate-500 font-bold mb-1 uppercase">
                  {new Date(session.date).toLocaleDateString()}
                </div>
                <div className="text-lg font-medium">"{session.user_input}"</div>
                <div className="text-sm text-emerald-400 mt-1">→ {session.corrected_text}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="px-4 py-1 bg-slate-950 rounded-full border border-slate-800 font-bold">
                  Score: {session.score}/10
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progress;
