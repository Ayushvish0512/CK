import { motion, easeInOut } from "framer-motion";
import { Ghost, Search, House, ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

function DesktopNotFound() {
  // Floating animation variants
  const floatingVariants = {
    animate: {
      y: [-20, 20, -20],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: easeInOut,
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
        ease: easeInOut,
      },
    },
  };

  // Background particles
  const particles = Array.from({ length: 15 }, (_, i) => i);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030712] via-[#050c1c] to-[#030712] text-slate-200 selection:bg-blue-500/30 overflow-hidden relative flex items-center justify-center">
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
          }}
        />
      ))}

      {/* Rotating gradient circles */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full opacity-20 blur-3xl"
        variants={rotatingVariants}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"
        variants={rotatingVariants}
        animate="animate"
        style={{ animationDelay: "1s" }}
      />

      {/* Glass Card Container */}
      <motion.div
        className="relative z-10 backdrop-blur-xl bg-white/5 rounded-3xl p-12 shadow-2xl border border-white/10 max-w-2xl mx-4"
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
              className="backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="text-8xl text-white">4</span>
            </motion.div>
            <motion.div
              className="backdrop-blur-md bg-blue-500/20 rounded-2xl p-6 border border-blue-400/30"
              variants={pulseVariants}
              animate="animate"
              initial={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
            >
              <span className="text-8xl text-blue-300">0</span>
            </motion.div>
            <motion.div
              className="backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10"
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
            className="text-lg text-slate-400 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            The page you're looking for seems to have vanished into the digital void.
          </motion.p>

          {/* Animated buttons with glass effect */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <motion.button
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-blue-500/40 hover:border-blue-400 transition-colors"
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
                boxShadow: "0 0 30px rgba(37, 99, 235, 0.6)",
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
                ease: easeInOut,
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
          ease: easeInOut,
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
          ease: easeInOut,
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-16 h-16 backdrop-blur-sm bg-blue-500/20 rounded-xl border border-blue-400/30"
        animate={{
          rotate: [0, 90, 180, 270, 360],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
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

function MobileNotFound() {
  const floatingVariants = {
    animate: {
      y: [-12, 12, -12],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: easeInOut,
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.08, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: easeInOut,
      },
    },
  };

  // Fewer particles for mobile performance
  const particles = Array.from({ length: 8 }, (_, i) => i);

  const particlePositions = [
    { x: 30, y: 10 }, { x: 70, y: 5 }, { x: 10, y: 40 },
    { x: 85, y: 30 }, { x: 20, y: 70 }, { x: 65, y: 80 },
    { x: 90, y: 65 }, { x: 45, y: 90 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030712] via-[#050c1c] to-[#030712] text-slate-200 selection:bg-blue-500/30 overflow-hidden relative flex items-center justify-center px-4 py-8">
      {/* Ambient glow blobs */}
      <motion.div
        className="absolute top-0 left-0 w-56 h-56 bg-blue-500 rounded-full opacity-20 blur-3xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Background particles — fixed % positions, no window references */}
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full opacity-25"
          style={{
            left: `${particlePositions[i].x}%`,
            top: `${particlePositions[i].y}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{
            duration: 4 + i * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Floating corner decorations — sized for mobile */}
      <motion.div
        className="absolute top-16 left-3 w-12 h-12 backdrop-blur-sm bg-white/10 rounded-xl border border-white/20"
        animate={{ rotate: [0, 180, 360], y: [0, -16, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-24 right-4 w-10 h-10 backdrop-blur-sm bg-white/10 rounded-full border border-white/20"
        animate={{ scale: [1, 1.2, 1], x: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-6 w-8 h-8 backdrop-blur-sm bg-blue-500/20 rounded-lg border border-blue-400/30"
        animate={{ rotate: [0, 90, 180, 270, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Main glass card */}
      <motion.div
        className="relative z-10 backdrop-blur-xl bg-white/5 rounded-3xl p-6 shadow-2xl border border-white/10 w-full max-w-sm"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 120 }}
      >
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

        <div className="relative text-center">
          {/* Ghost icon */}
          <motion.div
            className="flex justify-center mb-5"
            variants={floatingVariants}
            animate="animate"
          >
            <motion.div
              className="backdrop-blur-lg bg-white/20 rounded-full p-5 border border-white/30 shadow-lg"
              whileTap={{ scale: 1.15, rotate: 12 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Ghost className="w-14 h-14 text-white" />
            </motion.div>
          </motion.div>

          {/* 404 digits */}
          <div className="flex justify-center items-center gap-3 mb-5">
            <motion.div
              className="backdrop-blur-md bg-white/5 rounded-2xl px-4 py-3 border border-white/10"
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="text-6xl font-bold text-white">4</span>
            </motion.div>

            <motion.div
              className="backdrop-blur-md bg-blue-500/20 rounded-2xl px-4 py-3 border border-blue-400/30"
              variants={pulseVariants}
              animate="animate"
              initial={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
            >
              <span className="text-6xl font-bold text-blue-300">0</span>
            </motion.div>

            <motion.div
              className="backdrop-blur-md bg-white/5 rounded-2xl px-4 py-3 border border-white/10"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <span className="text-6xl font-bold text-white">4</span>
            </motion.div>
          </div>

          {/* Heading */}
          <motion.h2
            className="text-xl font-semibold text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Oops! Page Not Found
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-sm text-slate-400 mb-7 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            The page you&apos;re looking for seems to have vanished into the digital void.
          </motion.p>

          {/* CTA buttons — stacked on mobile */}
          <div className="flex flex-col gap-3 mb-5">
            <motion.button
              className="w-full py-4 bg-blue-600 active:bg-blue-500 text-white rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-blue-500/40 font-medium"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => (window.location.href = "/")}
            >
              <House className="w-5 h-5" />
              Go Home
            </motion.button>

            <motion.button
              className="w-full py-4 backdrop-blur-lg bg-white/20 text-white rounded-2xl flex items-center justify-center gap-2 shadow-xl border border-white/30 active:bg-white/30 font-medium"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </motion.button>
          </div>

          {/* Search hint pill */}
          <motion.div
            className="backdrop-blur-md bg-white/10 rounded-full px-5 py-2.5 inline-flex items-center gap-2 text-white border border-white/20 text-sm"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Search className="w-4 h-4" />
            </motion.div>
            <span>Try searching for what you need</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileNotFound /> : <DesktopNotFound />;
}
