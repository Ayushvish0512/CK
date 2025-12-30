import { motion } from "motion/react";
import { Ghost, Search, House, ArrowLeft } from "lucide-react";

export default function App() {
  // Floating animation variants
  const floatingVariants = {
    animate: {
      y: [-20, 20, -20],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Rotating animation
  const rotatingVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  // Pulse animation
  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Background particles
  const particles = Array.from({ length: 15 }, (_, i) => i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden relative flex items-center justify-center">
      {/* Animated background particles */}
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-white rounded-full opacity-30"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Rotating gradient circles */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full opacity-30 blur-3xl"
        variants={rotatingVariants}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full opacity-30 blur-3xl"
        variants={rotatingVariants}
        animate="animate"
        style={{ animationDelay: "1s" }}
      />

      {/* Glass Card Container */}
      <motion.div
        className="relative z-10 backdrop-blur-xl bg-white/10 rounded-3xl p-12 shadow-2xl border border-white/20 max-w-2xl mx-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Inner glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        
        <div className="relative text-center">
          {/* Animated Ghost Icon with glass background */}
          <motion.div
            className="flex justify-center mb-8"
            variants={floatingVariants}
            animate="animate"
          >
            <motion.div
              className="backdrop-blur-lg bg-white/20 rounded-full p-8 border border-white/30 shadow-lg"
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Ghost className="w-24 h-24 text-white" />
            </motion.div>
          </motion.div>

          {/* 404 Text with staggered animation and glass background */}
          <div className="flex justify-center items-center gap-6 mb-8">
            <motion.div
              className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="text-8xl text-white">4</span>
            </motion.div>
            <motion.div
              className="backdrop-blur-md bg-purple-400/20 rounded-2xl p-6 border border-purple-300/30"
              variants={pulseVariants}
              animate="animate"
              initial={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
            >
              <span className="text-8xl text-purple-100">0</span>
            </motion.div>
            <motion.div
              className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <span className="text-8xl text-white">4</span>
            </motion.div>
          </div>

          {/* Subtitle with fade in */}
          <motion.h2
            className="text-3xl text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Oops! Page Not Found
          </motion.h2>

          <motion.p
            className="text-lg text-purple-100 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            The page you're looking for seems to have vanished into the digital void.
          </motion.p>

          {/* Animated buttons with glass effect */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <motion.button
              className="px-8 py-4 backdrop-blur-lg bg-white/90 text-purple-900 rounded-full flex items-center gap-2 shadow-xl border border-white/50 hover:bg-white transition-colors"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(255, 255, 255, 0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = "/"}
            >
              <House className="w-5 h-5" />
              Go Home
            </motion.button>

            <motion.button
              className="px-8 py-4 backdrop-blur-lg bg-white/20 text-white rounded-full flex items-center gap-2 shadow-xl border border-white/30 hover:bg-white/30 transition-colors"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(168, 85, 247, 0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </motion.button>
          </div>

          {/* Animated search suggestion with glass pill */}
          <motion.div
            className="backdrop-blur-md bg-white/10 rounded-full px-6 py-3 inline-flex items-center gap-2 text-white border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <motion.div
              animate={{
                x: [0, 5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Search className="w-5 h-5" />
            </motion.div>
            <span>Try searching for what you need</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating decorative glass elements */}
      <motion.div
        className="absolute top-1/4 left-10 w-20 h-20 backdrop-blur-sm bg-white/10 rounded-2xl border border-white/20"
        animate={{
          rotate: [0, 180, 360],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/3 right-16 w-24 h-24 backdrop-blur-sm bg-white/10 rounded-full border border-white/20"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-16 h-16 backdrop-blur-sm bg-purple-400/20 rounded-xl border border-purple-300/30"
        animate={{
          rotate: [0, 90, 180, 270, 360],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Additional floating glass cards */}
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-32 h-32 backdrop-blur-md bg-white/5 rounded-3xl border border-white/20"
        animate={{
          rotate: [0, -180, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}