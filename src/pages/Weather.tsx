import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudSun,
  Thermometer,
  Clock,
  RefreshCw,
  ArrowLeft,
  Layers,
  Search,
  LayoutDashboard,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import WakingUpLoader from "@/components/WakingUpLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

// Fetching directly from the production Render backend.
const API_BASE = "https://weather-project-k72v.onrender.com";

const Weather: React.FC = () => {
  const [activeTab, setActiveTab] = useState("next-hour");
  const [customHours, setCustomHours] = useState(6);
  const [isWakingUp, setIsWakingUp] = useState(true);

  // 1. Next Hour Prediction
  const {
    data: nextHour,
    isLoading: isLoadingNext,
    isFetching: isFetchingNext,
    error: errorNext,
    refetch: refetchNext
  } = useQuery({
    queryKey: ["weather-next-hour"],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_BASE}/predict/next-hour`);
        const contentType = res.headers.get("content-type");
        
        if (!res.ok) {
           console.error(`Next hour fetch failed: ${res.status}`);
           throw new Error(`Server returned ${res.status}`);
        }
        
        if (!contentType || !contentType.includes("application/json")) {
           console.error("Non-JSON response received:", contentType);
           throw new Error("API routing error: Server returned HTML instead of JSON");
        }
        
        const data = await res.json();
        
        // Validate if data has the expected prediction key
        if (!data || typeof data.predicted_temp_c === 'undefined') {
          console.error("Malformed next-hour response:", data);
          throw new Error("Invalid data structure");
        }
        return data;
      } catch (err: any) {
        console.error("Fetch Exception:", err);
        throw err;
      }
    },
    // Prevent request storm
    placeholderData: (old) => old,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 60000, // 1 minute
  });

  // 2. Custom Hours Forecast
  const {
    data: customForecast,
    isLoading: isLoadingCustom,
    isFetching: isFetchingCustom,
    refetch: refetchCustom
  } = useQuery({
    queryKey: ["weather-custom", customHours],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_BASE}/predict/hours?hours=${customHours}`);
        const contentType = res.headers.get("content-type");
        
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        
        if (!contentType || !contentType.includes("application/json")) {
           throw new Error("Local routing error: Received HTML instead of API data");
        }
        
        const data = await res.json();
        if (!data || !Array.isArray(data.forecast)) {
           console.error("Malformed custom forecast response:", data);
           throw new Error("Invalid forecast structure");
        }
        return data;
      } catch (err: any) {
        console.error("Custom Fetch Error:", err);
        throw err;
      }
    },
    placeholderData: (old) => old,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 60000,
    enabled: activeTab === "custom"
  });

  // 3. Today's Forecast
  const {
    data: todayForecast,
    isLoading: isLoadingToday,
    isFetching: isFetchingToday,
    refetch: refetchToday
  } = useQuery({
    queryKey: ["weather-today"],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_BASE}/predict/today`);
        const contentType = res.headers.get("content-type");
        
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        
        if (!contentType || !contentType.includes("application/json")) {
           throw new Error("Local routing error: Received HTML instead of API data");
        }
        
        const data = await res.json();
        if (!data || !Array.isArray(data.forecast)) {
           console.error("Malformed today forecast response:", data);
           throw new Error("Invalid today structure");
        }
        return data;
      } catch (err: any) {
        console.error("Today Fetch Error:", err);
        throw err;
      }
    },
    placeholderData: (old) => old,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 60000,
    enabled: activeTab === "today"
  });

  // Waking up logic: Show big loader only on initial visit until first data arrives
  useEffect(() => {
    if (nextHour) {
      const timer = setTimeout(() => setIsWakingUp(false), 500);
      return () => clearTimeout(timer);
    }
  }, [nextHour]);

  // Error recovery: If request fails, we still want to let the user in
  useEffect(() => {
    if (errorNext) {
      const timer = setTimeout(() => setIsWakingUp(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorNext]);

  const handleRefresh = () => {
    if (activeTab === "next-hour") refetchNext();
    if (activeTab === "custom") refetchCustom();
    if (activeTab === "today") refetchToday();
    toast.info("Updating ML Model state...");
  };

  const isGlobalFetching = isFetchingNext || isFetchingCustom || isFetchingToday;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 selection:bg-amber-500/30 font-sans overflow-x-hidden">

      {/* 1st Screen: Backend Waking Up Animation */}
      <AnimatePresence>
        {isWakingUp && !nextHour && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[100] bg-[#030712] flex flex-col items-center justify-center p-6"
          >
            <WakingUpLoader message={errorNext ? "Engine Error" : "Starting ML Engine"} />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 10 }}
              className="absolute bottom-12 flex flex-col items-center gap-4"
            >
              <p className="text-slate-500 text-xs text-center max-w-xs px-6">
                Still waiting? The server might be deep-sleeping.
                You can enter early, but data might take a moment to sync.
              </p>
              <button
                onClick={() => setIsWakingUp(false)}
                className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all text-sm font-bold active:scale-95"
              >
                Force Entry to Dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2nd Screen: Dashboard (Visible immediately, cards show internal loading) */}
      <div className="max-w-6xl mx-auto px-6 py-12 relative z-0">

        {/* Navigation */}
        <div className="flex justify-between items-center mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all group px-4 py-2 rounded-xl bg-white/5 border border-white/10"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-amber-400 active:scale-95 flex items-center gap-2"
            >
              <RefreshCw className={`w-5 h-5 ${isGlobalFetching ? "animate-spin" : ""}`} />
              {isGlobalFetching && <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Syncing...</span>}
            </button>
          </div>
        </div>

        {/* Header */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/5 px-3 py-1 uppercase tracking-widest text-[10px] font-black">
              Neural Forecast v1.0
            </Badge>
            <div className="h-1 w-1 rounded-full bg-slate-700" />
            <span className="text-slate-500 text-xs font-mono uppercase tracking-tighter">Render Free Tier Ready</span>
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Gurgaon <span className="text-amber-500">Weather.</span>
          </h1>
        </section>

        {/* User Choice Tabs */}
        <Tabs defaultValue="next-hour" onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl mb-12 h-auto grid grid-cols-3 gap-2">
            <TabsTrigger value="next-hour" className="rounded-xl py-3 data-[state=active]:bg-amber-500 data-[state=active]:text-white transition-all font-bold">
              Immediate
            </TabsTrigger>
            <TabsTrigger value="today" className="rounded-xl py-3 data-[state=active]:bg-amber-500 data-[state=active]:text-white transition-all font-bold">
              Today
            </TabsTrigger>
            <TabsTrigger value="custom" className="rounded-xl py-3 data-[state=active]:bg-amber-500 data-[state=active]:text-white transition-all font-bold">
              Custom
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {/* NEXT HOUR VIEW */}
            <TabsContent value="next-hour" className="mt-0 outline-none">
              <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20 backdrop-blur-3xl overflow-hidden min-h-[300px] flex flex-col justify-center">
                <CardContent className="py-12">
                  {isLoadingNext && !nextHour ? (
                    <div className="flex flex-col items-center gap-6 animate-pulse">
                      <div className="w-48 h-24 bg-white/5 rounded-3xl" />
                      <div className="w-32 h-6 bg-white/5 rounded-xl" />
                    </div>
                  ) : nextHour ? (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 px-6">
                      <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <span className="text-amber-500/60 font-mono text-sm mb-2 uppercase tracking-widest">Next Hour Logic</span>
                        <div className="text-8xl md:text-9xl font-black text-white tracking-tighter relative">
                          {nextHour.predicted_temp_c}°
                          {isFetchingNext && <RefreshCw className="absolute -top-4 -right-8 w-6 h-6 animate-spin text-amber-500/30" />}
                        </div>
                        <p className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mt-2 uppercase">
                          {nextHour.summary}
                        </p>
                      </div>
                      <div className="w-full max-w-sm grid grid-cols-2 gap-4">
                        <InfoTile label="Time (IST)" value={nextHour.prediction_for_ist?.split('T')[1].substring(0, 5)} icon={<Clock className="text-amber-400" />} />
                        <InfoTile label="ML Version" value={nextHour.model_version} icon={<Layers className="text-blue-400" />} />
                      </div>
                    </div>
                  ) : (
                    <ErrorState message="Could not fetch inference data. Ensure backend is live." />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TODAY'S VIEW */}
            <TabsContent value="today" className="mt-0 outline-none">
              <ForecastGrid
                data={todayForecast?.forecast}
                isLoading={isLoadingToday && !todayForecast}
                title="Remaining Day Predictions"
                description={`Model analysis for ${todayForecast?.location || 'Gurgaon'}`}
              />
            </TabsContent>

            {/* CUSTOM FORECAST */}
            <TabsContent value="custom" className="mt-0 outline-none">
              <div className="mb-8 flex flex-col md:flex-row items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10">
                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-sm font-bold text-slate-400">Step Radius:</span>
                </div>
                <Input
                  type="number"
                  value={customHours}
                  onChange={(e) => setCustomHours(Math.max(1, Math.min(24, parseInt(e.target.value) || 1)))}
                  className="w-24 bg-slate-800/50 border-amber-500/30 text-amber-400 font-black text-xl text-center rounded-2xl h-12"
                />
                <p className="text-slate-500 text-sm hidden md:block italic">Maximum window: 24h.</p>
              </div>
              <ForecastGrid
                data={customForecast?.forecast}
                isLoading={isLoadingCustom && !customForecast}
                title={`${customHours} Hour Multi-Step`}
                description="Recurrent feature mapping for future projections."
              />
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
};

const InfoTile = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
    <div className="p-2 rounded-lg bg-white/5">{icon}</div>
    <div>
      <p className="text-[10px] uppercase font-black text-slate-500 tracking-tighter">{label}</p>
      <p className="text-sm font-bold text-slate-200">{value || '--'}</p>
    </div>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center text-center gap-4 py-12">
    <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500">
      <AlertCircle className="w-8 h-8" />
    </div>
    <div>
      <p className="text-lg font-bold text-white">Inference Interrupted</p>
      <p className="text-slate-500 text-sm">{message}</p>
    </div>
  </div>
);

const ForecastGrid = ({ data, isLoading, title, description }: { data: any[], isLoading: boolean, title: string, description: string }) => (
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
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-white/5 rounded-2xl" />)}
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map((item: any, i: number) => (
            <motion.div
              key={i}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-black text-slate-500 uppercase">{item.prediction_for_ist?.split('T')[1].substring(0, 5)} IST</p>
                <CloudSun className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-4xl font-black text-white mb-2">{item.predicted_temp_c}°</div>
              <Badge variant="outline" className="text-[10px] border-white/10 text-slate-400">
                {item.summary}
              </Badge>
            </motion.div>
          ))}
        </div>
      ) : (
        <ErrorState message="No forecast sequence available." />
      )}
    </CardContent>
  </Card>
);

export default Weather;
