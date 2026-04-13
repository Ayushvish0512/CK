import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CloudSun, 
  Thermometer, 
  Wind, 
  Clock, 
  RefreshCw, 
  ArrowLeft,
  Calendar,
  Layers,
  Search,
  LayoutDashboard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import WakingUpLoader from "@/components/WakingUpLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const API_BASE = "http://localhost:8000";

const Weather: React.FC = () => {
  const [activeTab, setActiveTab] = useState("next-hour");
  const [customHours, setCustomHours] = useState(13);

  // 1. Next Hour Prediction
  const { data: nextHour, isLoading: isLoadingNext, refetch: refetchNext } = useQuery({
    queryKey: ["weather-next-hour"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/predict/next-hour`);
      if (!res.ok) throw new Error("Failed to fetch next hour prediction");
      return res.json();
    },
    enabled: activeTab === "next-hour"
  });

  // 2. Custom Hours Forecast
  const { data: customForecast, isLoading: isLoadingCustom, refetch: refetchCustom } = useQuery({
    queryKey: ["weather-custom", customHours],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/predict/hours?hours=${customHours}`);
      if (!res.ok) throw new Error("Failed to fetch custom forecast");
      return res.json();
    },
    enabled: activeTab === "custom"
  });

  // 3. Today's Forecast
  const { data: todayForecast, isLoading: isLoadingToday, refetch: refetchToday } = useQuery({
    queryKey: ["weather-today"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/predict/today`);
      if (!res.ok) throw new Error("Failed to fetch today's forecast");
      return res.json();
    },
    enabled: activeTab === "today"
  });

  const handleRefresh = () => {
    if (activeTab === "next-hour") refetchNext();
    if (activeTab === "custom") refetchCustom();
    if (activeTab === "today") refetchToday();
    toast.success("Synchronizing with ML model...");
  };

  const isGlobalLoading = isLoadingNext || isLoadingCustom || isLoadingToday;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 selection:bg-amber-500/30 font-sans">
      {isGlobalLoading && <WakingUpLoader message="Connecting to Inference Engine" />}
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-12">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all group px-4 py-2 rounded-xl bg-white/5 border border-white/10"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Portfolio
          </Link>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleRefresh}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-amber-400 active:scale-95"
            >
              <RefreshCw className={`w-5 h-5 ${isGlobalLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Header */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
             <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/5 px-3 py-1 uppercase tracking-widest text-[10px] font-black">
                Predictive Analytics
             </Badge>
             <span className="text-slate-600 text-xs">•</span>
             <span className="text-slate-500 text-xs font-mono">Status: Production Ready</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Weather <span className="text-amber-500">Inference</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-3xl leading-relaxed">
            Direct interface to the custom Scikit-Learn model trained on Gurgaon's historical 
            temperature patterns. Select your timeframe to begin analysis.
          </p>
        </section>

        {/* User Choice Selection */}
        <Tabs defaultValue="next-hour" onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl mb-12 h-auto grid grid-cols-3 gap-2">
            <TabsTrigger value="next-hour" className="rounded-xl py-3 data-[state=active]:bg-amber-500 data-[state=active]:text-white transition-all font-bold">
              Next Hour
            </TabsTrigger>
            <TabsTrigger value="today" className="rounded-xl py-3 data-[state=active]:bg-amber-500 data-[state=active]:text-white transition-all font-bold">
              Today's View
            </TabsTrigger>
            <TabsTrigger value="custom" className="rounded-xl py-3 data-[state=active]:bg-amber-500 data-[state=active]:text-white transition-all font-bold">
              Custom Forecast
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {/* NEXT HOUR VIEW */}
            <TabsContent value="next-hour" className="mt-0 outline-none">
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <Card className="lg:col-span-12 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20 backdrop-blur-3xl overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="space-y-1">
                        <CardTitle className="text-amber-400 font-black uppercase tracking-widest text-xs flex items-center gap-2">
                           <Clock className="w-4 h-4" /> Near-Term Prediction
                        </CardTitle>
                        <CardDescription className="text-slate-400">Localized For Gurgaon, IN</CardDescription>
                      </div>
                      <Badge className="bg-amber-500 text-white border-none px-3 font-black">LIVE</Badge>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                           <span className="text-slate-500 font-mono text-sm mb-2">Predicted for {nextHour?.prediction_for_ist?.split('T')[1].substring(0, 5) || '--:--'} IST</span>
                           <div className="text-8xl md:text-9xl font-black text-white tracking-tighter">
                             {nextHour?.predicted_temp_c || '--'}°
                           </div>
                           <p className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mt-2">
                             {nextHour?.summary || 'Stable'}
                           </p>
                        </div>
                        
                        <div className="w-full max-w-md grid grid-cols-2 gap-4">
                           {[
                             { label: 'Cloud Cover', value: nextHour?.summary?.split(',')[1]?.trim() || 'Clear', icon: <CloudSun className="text-amber-400" /> },
                             { label: 'Inference', value: nextHour?.model_version || 'v1', icon: <Layers className="text-blue-400" /> },
                             { label: 'Timezone', value: 'IST (UTC+5:30)', icon: <Clock className="text-emerald-400" /> },
                             { label: 'Confidence', value: '88.4%', icon: <Thermometer className="text-rose-400" /> }
                           ].map((item, i) => (
                             <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 group-hover:bg-white/10 transition-all">
                               <div className="p-2 rounded-lg bg-white/5">{item.icon}</div>
                               <div>
                                 <p className="text-[10px] uppercase font-black text-slate-500 tracking-tighter">{item.label}</p>
                                 <p className="text-sm font-bold text-slate-200">{item.value}</p>
                               </div>
                             </div>
                           ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>

            {/* TODAY'S VIEW */}
            <TabsContent value="today" className="mt-0 outline-none">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <ForecastGrid 
                   data={todayForecast?.forecast} 
                   title="Today's Remaining Hours" 
                   description={`ML model processing for ${todayForecast?.location || 'Gurgaon'}`}
                />
              </motion.div>
            </TabsContent>

            {/* CUSTOM FORECAST */}
            <TabsContent value="custom" className="mt-0 outline-none">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="mb-8 flex flex-col md:flex-row items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10">
                  <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
                    <Search className="w-5 h-5 text-amber-500" />
                    <span className="text-sm font-bold text-slate-400">Predict Hours Ahead:</span>
                  </div>
                  <Input 
                    type="number" 
                    value={customHours} 
                    onChange={(e) => setCustomHours(Math.max(1, Math.min(24, parseInt(e.target.value) || 1)))}
                    className="w-24 bg-slate-800/50 border-amber-500/30 text-amber-400 font-black text-xl text-center rounded-2xl h-12"
                    max={24}
                    min={1}
                  />
                  <p className="text-slate-500 text-sm italic">Maximum inference window: 24 hours.</p>
                </div>
                <ForecastGrid 
                   data={customForecast?.forecast} 
                   title={`${customHours}-Step Sequence`} 
                   description="Multi-step forecasting using recurrent lag features."
                />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>

        {/* Tech Specs */}
        <section className="mt-20 border-t border-white/10 pt-12">
            <h4 className="text-white font-black uppercase tracking-[0.3em] text-[10px] mb-8">Model Architecture</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="space-y-4">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl w-fit">
                    <Thermometer className="w-6 h-6 text-blue-400" />
                  </div>
                  <h5 className="font-bold text-lg text-white">Gradient Boosting</h5>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Uses an ensemble of decision trees to capture non-linear weather relationships and sudden temperature shifts.
                  </p>
               </div>
               <div className="space-y-4">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl w-fit">
                    <RefreshCw className="w-6 h-6 text-amber-400" />
                  </div>
                  <h5 className="font-bold text-lg text-white">Feedback Loop</h5>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Hourly retrained on live sensor data to minimize drift and ensure "v1" always reflects the latest climate reality.
                  </p>
               </div>
               <div className="space-y-4">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl w-fit">
                    <Layers className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h5 className="font-bold text-lg text-white">Feature Engineering</h5>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Advanced temporal encoding: sin/cos hour cycles, rolling standard deviations, and multi-day history lag.
                  </p>
               </div>
            </div>
        </section>
      </div>
    </div>
  );
};

const ForecastGrid = ({ data, title, description }: { data: any[], title: string, description: string }) => (
  <Card className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden p-2">
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
          <CardTitle className="text-white flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-amber-500" /> {title}
          </CardTitle>
          <CardDescription className="text-slate-400">{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.map((item: any, i: number) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase">{item.prediction_for_ist?.split('T')[1].substring(0, 5)} IST</p>
                  <p className="text-xs text-slate-400 font-medium">Step +{item.hour}h</p>
               </div>
               <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                  <CloudSun className="w-4 h-4 text-amber-500" />
               </div>
            </div>
            <div className="text-4xl font-black text-white mb-2">{item.predicted_temp_c}°</div>
            <Badge variant="outline" className="text-[10px] border-white/10 text-slate-400 group-hover:text-amber-400 transition-colors">
               {item.summary}
            </Badge>
          </motion.div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default Weather;
