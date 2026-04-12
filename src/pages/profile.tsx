import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Award, Flame, Target, BookOpen, LogOut, Camera, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://speakbetter-lgfr.onrender.com';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [name, setName] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/practice');
            return;
        }
        loadUserData();
    }, [token]);

    const loadUserData = async () => {
        try {
            const [userRes, statsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/auth/me`, { 
                    headers: { 'Authorization': `Bearer ${token}` } 
                }),
                fetch(`${API_BASE_URL}/progress/stats`, { 
                    headers: { 'Authorization': `Bearer ${token}` } 
                })
            ]);

            if (userRes.ok) {
                const userData = await userRes.json();
                setUser(userData);
                setName(userData.name);
            }
            if (statsRes.ok) {
                setStats(await statsRes.json());
            }
        } catch (err) {
            toast.error("Failed to load profile data");
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/me`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name })
            });

            if (res.ok) {
                toast.success("Profile updated successfully!");
                setIsEditing(false);
                loadUserData();
            } else {
                toast.error("Update failed");
            }
        } catch (err) {
            toast.error("Error updating profile");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        navigate('/practice');
    };

    if (!user) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    return (
        <div className="dark min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30 pb-20">
            {/* Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 pt-12 relative z-10">
                {/* Header */}
                <header className="flex justify-between items-center mb-12">
                    <Link to="/practice" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        SpeakBetter
                    </Link>
                    <Button variant="ghost" onClick={handleLogout} className="text-slate-400 hover:text-rose-400 gap-2">
                        <LogOut size={18} /> Logout
                    </Button>
                </header>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left Column - User Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-4 space-y-6"
                    >
                        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl overflow-hidden shadow-2xl">
                            <div className="h-24 bg-gradient-to-r from-indigo-600 to-purple-600" />
                            <CardContent className="relative pt-0">
                                <div className="flex flex-col items-center -mt-12">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-2xl bg-slate-800 border-4 border-slate-950 flex items-center justify-center overflow-hidden shadow-2xl">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={40} className="text-slate-400" />
                                            )}
                                        </div>
                                        <button className="absolute bottom-0 right-0 p-1.5 bg-indigo-500 rounded-lg border-2 border-slate-950 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera size={14} />
                                        </button>
                                    </div>
                                    
                                    <div className="mt-4 text-center w-full">
                                        {isEditing ? (
                                            <div className="space-y-3 mt-4">
                                                <Input 
                                                    value={name} 
                                                    onChange={e => setName(e.target.value)}
                                                    className="bg-slate-800/50 border-slate-700 text-center"
                                                    placeholder="Enter your name"
                                                />
                                                <div className="flex gap-2 justify-center">
                                                    <Button size="sm" onClick={handleUpdateProfile} className="bg-indigo-600">Save</Button>
                                                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <h2 className="text-2xl font-bold">{user.name}</h2>
                                                <p className="text-slate-400 text-sm mb-4">{user.email}</p>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => setIsEditing(true)}
                                                    className="border-slate-800 hover:bg-slate-800"
                                                >
                                                    <Settings size={14} className="mr-2" /> Edit Profile
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-800 space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400 flex items-center gap-2">
                                            <Mail size={14} /> Email
                                        </span>
                                        <span className="font-medium">{user.email}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400 flex items-center gap-2">
                                            <Shield size={14} /> Level
                                        </span>
                                        <span className="text-indigo-400 font-bold">Intermediate</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400 flex items-center gap-2">
                                            <Target size={14} /> Daily Goal
                                        </span>
                                        <span className="font-medium text-emerald-400">10/10 mins</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Achievements */}
                        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Achievements</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-4 gap-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className={`aspect-square rounded-xl flex items-center justify-center ${i < 3 ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-500/10' : 'bg-slate-800 text-slate-600 border border-slate-700'}`}>
                                            <Award size={24} />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-center text-slate-500 mt-4">2 more to reach Master level</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Right Column - Stats & Activity */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-8 space-y-8"
                    >
                        {/* Stats Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard 
                                icon={<Flame className="text-orange-500" />}
                                label="Current Streak"
                                value={stats?.streak || 0}
                                suffix="Days"
                                trend="+2 today"
                            />
                            <StatCard 
                                icon={<Target className="text-indigo-500" />}
                                label="Avg Score"
                                value={8.4}
                                suffix="/10"
                                trend="+0.5 this week"
                            />
                            <StatCard 
                                icon={<BookOpen className="text-purple-500" />}
                                label="Total Sessions"
                                value={stats?.total_sessions || 0}
                                suffix="Lessons"
                                trend="Top 5% of users"
                            />
                        </div>

                        {/* Activity Graph Placeholder */}
                        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl p-8 shadow-2xl">
                            <div className="flex justify-between items-center mb-8">
                                <CardTitle>Learning Progress</CardTitle>
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Accuracy</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[240px] flex items-end gap-2 px-4">
                                {[40, 65, 45, 85, 55, 95, 75, 40, 60, 80, 50, 90].map((h, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ delay: i * 0.05, duration: 0.8, ease: "easeOut" }}
                                        className="flex-1 bg-gradient-to-t from-indigo-600/50 via-indigo-500/80 to-indigo-400 rounded-t-lg relative group"
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                            {h}% Score
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 text-[10px] text-slate-500 uppercase tracking-widest px-4 font-bold">
                                <span>Jan</span>
                                <span>Feb</span>
                                <span>Mar</span>
                                <span>Apr</span>
                                <span>May</span>
                                <span>Jun</span>
                                <span>Jul</span>
                                <span>Aug</span>
                                <span>Sep</span>
                                <span>Oct</span>
                                <span>Nov</span>
                                <span>Dec</span>
                            </div>
                        </Card>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Link to="/practice" className="group">
                                <Card className="bg-indigo-600/10 border-indigo-500/20 hover:border-indigo-500/50 transition-all cursor-pointer group-hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4 -translate-y-4">
                                        <BookOpen size={120} />
                                    </div>
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold text-indigo-400 mb-2 group-hover:translate-x-1 transition-transform flex items-center gap-2">
                                            Start Practice <span className="text-indigo-500/50">→</span>
                                        </h3>
                                        <p className="text-sm text-slate-400">Jump back into your daily English session and keep the streak alive.</p>
                                    </CardContent>
                                </Card>
                            </Link>
                            <Link to="/progress" className="group">
                                <Card className="bg-purple-600/10 border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer group-hover:shadow-[0_0_30px_rgba(147,51,234,0.15)] overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4 -translate-y-4">
                                        <Target size={120} />
                                    </div>
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold text-purple-400 mb-2 group-hover:translate-x-1 transition-transform flex items-center gap-2">
                                            Detailed Stats <span className="text-purple-500/50">→</span>
                                        </h3>
                                        <p className="text-sm text-slate-400">Analyze your speech history, common mistakes and AI recommendations.</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number, suffix?: string, trend?: string }> = ({ icon, label, value, suffix, trend }) => (
    <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl hover:bg-slate-900/60 transition-colors shadow-lg">
        <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-800/80 rounded-lg border border-slate-700 shadow-inner">
                    {icon}
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black">{value}</span>
                {suffix && <span className="text-sm text-slate-500">{suffix}</span>}
            </div>
            {trend && <p className="text-[10px] text-emerald-400 mt-2 font-bold uppercase tracking-tighter flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400" /> {trend}
            </p>}
        </CardContent>
    </Card>
);

export default Profile;
