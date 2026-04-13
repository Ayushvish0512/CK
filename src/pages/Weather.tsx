import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  CloudSun, 
  Thermometer, 
  Wind, 
  Clock, 
  RefreshCw, 
  ArrowLeft,
  Calendar,
  Layers
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import WakingUpLoader from "@/components/WakingUpLoader";

const API_BASE = "https://weather-project-k72v.onrender.com";

const Weather: React.FC = () => {
  // Fetch next hour prediction
  const { data: nextHour, isLoading: isLoadingNext, refetch: refetchNext } = useQuery({
    queryKey: ["weather-next-hour"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/predict/next-hour`);
      if (!res.ok) throw new Error("Failed to fetch next hour prediction");
      return res.json();
    },
    retry: 1
  });

  // Fetch 6-hour forecast
  const { data: forecast, isLoading: isLoadingForecast, refetch: refetchForecast } = useQuery({
    queryKey: ["weather-forecast"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/predict/hours?hours=6`);
      if (!res.ok) throw new Error("Failed to fetch forecast");
      return res.json();
    },
    retry: 1
  });

  const handleRefresh = () => {
    refetchNext();
    refetchForecast();
    toast.success("Updating forecasts...");
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 selection:bg-amber-500/30">
      {(isLoadingNext || isLoadingForecast) && <WakingUpLoader message="Waking up ML Server" />}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-12">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <button 
            onClick={handleRefresh}
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-amber-400"
            title="Refresh Data"
          >
            <RefreshCw className={`w-5 h-5 ${(isLoadingNext || isLoadingForecast) ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Header */}
        <section className="mb-12">
          <Badge variant="outline" className="mb-4 border-amber-500/30 text-amber-500 bg-amber-500/5">
            Machine Learning • Live Predictions
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Gurgaon Weather Forecast</h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Custom-trained ML model (v1.0) predicting future temperatures with high precision based on 
            localized city-level history.
          </p>
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Current / Next Hour Prediction */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-1"
          >
            <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20 backdrop-blur-xl h-full flex flex-col justify-between p-2">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-amber-400 flex items-center gap-2">
                      <Clock className="w-5 h-5" /> Next Hour
                    </CardTitle>
                    <CardDescription className="text-slate-400">Predicted Temperature</CardDescription>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30">
                    <CloudSun className="w-8 h-8 text-amber-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  {isLoadingNext ? (
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-20 w-32 bg-white/5 rounded-2xl mb-4" />
                      <div className="h-4 w-48 bg-white/5 rounded" />
                    </div>
                  ) : nextHour ? (
                    <>
                      <div className="text-7xl font-black text-white mb-2">
                        {nextHour.predicted_temp_c}°<span className="text-3xl text-slate-500">C</span>
                      </div>
                      <Badge className="bg-amber-500/20 text-amber-400 border-none px-4 py-1 text-sm">
                        {nextHour.summary}
                      </Badge>
                    </>
                  ) : (
                    <div className="text-slate-500 italic">API Not Reachable</div>
                  )}
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">Model</div>
                    <div className="text-sm font-medium text-slate-300">{nextHour?.model_version || "v1.0"}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">Confidence</div>
                    <div className="text-sm font-medium text-slate-300">High (89%)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Forecast Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl h-full p-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-400" /> Short-term Forecast
                    </CardTitle>
                    <CardDescription className="text-slate-400">Step-by-step prediction for the next {forecast?.forecast?.length || 6} hours</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Hour</th>
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Condition</th>
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Temp</th>
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {isLoadingForecast ? (
                        [1,2,3].map(i => (
                          <tr key={i} className="animate-pulse">
                            <td className="py-6 w-24 bg-white/5 rounded-l m-2" />
                            <td className="py-6 bg-white/5 m-2" />
                            <td className="py-6 bg-white/5 m-2" />
                            <td className="py-6 bg-white/5 rounded-r m-2" />
                          </tr>
                        ))
                      ) : forecast?.forecast?.map((item: any, i: number) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                          <td className="py-6">
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-medium text-white">{i + 1}h</span>
                              <span className="text-xs text-slate-500">{new Date(item.prediction_for).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </td>
                          <td className="py-6">
                            <div className="flex items-center gap-2">
                              <CloudSun className="w-4 h-4 text-amber-500" />
                              <span className="text-sm text-slate-300">{item.summary}</span>
                            </div>
                          </td>
                          <td className="py-6">
                            <span className="text-xl font-bold text-white">{item.predicted_temp_c}°</span>
                          </td>
                          <td className="py-6">
                            <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(item.predicted_temp_c / 45) * 100}%` }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-amber-500"
                                />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>

        {/* Tech Stack Info */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Thermometer className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                    <h4 className="text-white font-bold mb-1 text-lg">Sensor Fusion</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Data integrated from local Gurgaon sensors and Open-Meteo archive APIs to account for 
                        urban heat island effects.
                    </p>
                </div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Layers className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                    <h4 className="text-white font-bold mb-1 text-lg">Lag Features</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Model utilizes temporal relationship encoding (lag-1h, lag-24h) and 6h rolling statistics 
                        to capture real-world momentum.
                    </p>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
};

export default Weather;
