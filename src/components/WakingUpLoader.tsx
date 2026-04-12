import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';

interface WakingUpLoaderProps {
  message: string;
}

const WakingUpLoader: React.FC<WakingUpLoaderProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-8">
           <Sparkles size={40} className="text-white" />
        </div>
        <motion.div 
           animate={{ rotate: 360 }}
           transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
           className="absolute -inset-4 border-2 border-indigo-500/20 border-t-indigo-500 rounded-[2rem]"
        />
        <motion.div 
           animate={{ rotate: -360 }}
           transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
           className="absolute -inset-8 border border-white/5 border-b-purple-500/30 rounded-[2.5rem]"
        />
      </motion.div>
      
      <div className="text-center mt-12 space-y-6 max-w-xs">
        <div className="space-y-2">
           <h3 className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
             {message}
           </h3>
           <p className="text-slate-400 text-sm font-medium leading-relaxed">
              We're spinning up the AI engines. This usually takes about 30 seconds on Render's free tier.
           </p>
        </div>
        
        <div className="flex items-center justify-center gap-3 py-2 px-4 bg-white/5 rounded-full border border-white/10 w-fit mx-auto">
           <Loader2 size={14} className="animate-spin text-indigo-400" />
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Backend Waking Up...</span>
        </div>
      </div>

      {/* Background Ambience */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export default WakingUpLoader;
