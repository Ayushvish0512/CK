import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Challenge {
  title: string;
  description: string;
}

interface WakeupConfig {
  appName: string;
  title: string;
  description: string;
  healthEndpoint: string;
  launchUrl: string;
  challenges: Challenge[];
}

interface WakeupMetric {
  label: string;
  value: string;
}

interface PipelineStage {
  title: string;
  description: string;
  id: string;
}

/* ------------------------------------------------------------------
 * App registry — add new Render apps here. Each entry is fully
 * self-contained: title, description, health endpoint, launch URL
 * and the per-app cold-start engineering challenges.
 * ------------------------------------------------------------------ */
const WAKEUP_CONFIG: Record<string, WakeupConfig> = {
  speakbetter: {
    appName: "SpeakBetter",
    title: "Render Server Wake-Up",
    description: "SpeakBetter backend · FastAPI · Gemini 2.5 Flash · MongoDB Atlas (Render free tier)",
    healthEndpoint: "/api/speakbetter/ping",
    launchUrl: "/speakbetter",
    challenges: [
      { title: "Cold Start Latency", description: "Container spin-up blocks the first request (40–80s)." },
      { title: "Database Pooling", description: "MongoDB Atlas connection must re-establish on wake." },
      { title: "API Rate Limits", description: "Gemini quota resets per minute; burst on boot." },
      { title: "State Sync", description: "In-memory caches rebuild after instance restart." },
    ],
  },
  weather: {
    appName: "Weather AI",
    title: "Render Server Wake-Up",
    description: "Weather Prediction ML · Scikit-learn · FastAPI (Render free tier)",
    healthEndpoint: "/api/weather/",
    launchUrl: "/weather",
    challenges: [
      { title: "Cold Start Latency", description: "Python ML imports extend spin-up time." },
      { title: "Model Loading", description: "Scikit-learn model deserializes on first request." },
      { title: "Cache Warm-Up", description: "Forecast cache must repopulate on boot." },
      { title: "Concurrency", description: "Worker pre-loading before serving traffic." },
    ],
  },
};

/* ------------------------------------------------------------------
 * Tunables
 * ------------------------------------------------------------------ */
const INITIAL_INTERVAL_MS = 10000; // ping every 10s
const FAST_INTERVAL_MS = 5000; // after 50s of waiting, ping every 5s
const FAST_INTERVAL_AT_MS = 50000; // 50 second threshold for fast polling
const REQUEST_TIMEOUT_MS = 8000; // per-ping timeout
const ESTIMATED_WAKE_MS = 80000; // progress ramps 4% -> 95% across ~80s

type Phase = "idle" | "waking" | "ready";

/* ------------------------------------------------------------------
 * Main component
 * ------------------------------------------------------------------ */
const Wakeup: React.FC = () => {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const config = WAKEUP_CONFIG[appId || ""] ?? WAKEUP_CONFIG.speakbetter;

  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(4);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [lastPingMs, setLastPingMs] = useState<number | null>(null);
  const [remainingSec, setRemainingSec] = useState(INITIAL_INTERVAL_MS / 1000);
  const [statusLabel, setStatusLabel] = useState("SLEEPING");
  const [errorMsg, setErrorMsg] = useState("");

  // Mutable refs so the single polling loop never hits stale closures
  const phaseRef = useRef<Phase>(phase);
  const startTsRef = useRef<number>(0);
  const intervalMsRef = useRef(INITIAL_INTERVAL_MS);
  const inFlightRef = useRef(false);
  const loopTimerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // ---- helpers --------------------------------------------------------
  const formatElapsed = (ms: number) => {
    const total = (ms / 1000).toFixed(1);
    const mins = String(Math.floor(+total / 60)).padStart(2, "0");
    const secs = String(+total % 60).padStart(4, "0");
    return mins + ":" + secs + "s";
  };

  const countdownLabel = "Next ping in " + Math.max(0, remainingSec) + "s";
  const telemetry: WakeupMetric[] = [
    { label: "Server Status", value: statusLabel },
    { label: "Time Elapsed", value: formatElapsed(elapsedMs) },
    { label: "Last Ping", value: lastPingMs == null ? "— ms" : lastPingMs + " ms" },
    { label: "Next Ping In", value: phase === "idle" ? "—" : countdownLabel },
  ];

  const pipelineStages: PipelineStage[] = [
    { id: "stage-1", title: "Dispatch wake-up request", description: "Send the first health ping to the Render free-tier instance immediately." },
    { id: "stage-2", title: "Spinning up container instance", description: "Render boots the sleeping container; the first ping may time out or 502." },
    { id: "stage-3", title: "Establishing database connection", description: "Connection pool and auth middleware re-initialize with the boot." },
    { id: "stage-4", title: "Health check passing", description: "The /ping endpoint returns 200 OK — the app is ready to serve traffic." },
  ];

  // ---- real health check ---------------------------------------------
  const pingServer = async () => {
    if (phaseRef.current !== "waking" || inFlightRef.current) return;
    inFlightRef.current = true;
    setStatusLabel("PINGING SERVER");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const t0 = performance.now();

    try {
      const res = await fetch(config.healthEndpoint, { signal: controller.signal });
      const rt = Math.round(performance.now() - t0);
      setLastPingMs(rt);
      if (res.ok) {
        onServerReady(rt);
      } else {
        // non-200: instance still cold-starting
        setErrorMsg("Server is taking longer than expected. Try again.");
      }
    } catch {
      const rt = Math.round(performance.now() - t0);
      if (rt > 0) setLastPingMs(rt);
      setErrorMsg("Server is taking longer than expected. Try again.");
    } finally {
      clearTimeout(timeout);
      inFlightRef.current = false;
      // go back to a waiting status label unless we succeeded
      if (phaseRef.current === "waking") setStatusLabel("WAKING SERVER");
    }
  };

  const onServerReady = (rt: number) => {
    setPhase("ready");
    setProgress(100);
    setStatusLabel("SERVER READY");
    setLastPingMs(rt);
    setErrorMsg("");
    clearInterval(loopTimerRef.current);
  };

  // ---- flow control ---------------------------------------------------
  const startWaking = () => {
    if (phase === "waking" || phase === "ready") return;
    setPhase("waking");
    setProgress(4);
    setStatusLabel("WAKING SERVER");
    setElapsedMs(0);
    setRemainingSec(INITIAL_INTERVAL_MS / 1000);
    setLastPingMs(null);
    setErrorMsg("");
    startTsRef.current = Date.now();
    intervalMsRef.current = INITIAL_INTERVAL_MS;

    // immediate first health check
    pingServer();

    // single loop drives elapsed timer, progress ramp, interval switch, countdown
    loopTimerRef.current = setInterval(() => {
      if (phaseRef.current !== "waking") return;

      const elapsed = Date.now() - (startTsRef.current || Date.now());
      setElapsedMs(elapsed);
      // ramp capsule bar 4% -> 95% across the estimated wake window
      const frac = Math.min(1, elapsed / ESTIMATED_WAKE_MS);
      setProgress(Math.round(4 + frac * 91));

      // after 50s of no success, tighten polling to every 5s
      if (intervalMsRef.current === INITIAL_INTERVAL_MS && elapsed >= FAST_INTERVAL_AT_MS) {
        intervalMsRef.current = FAST_INTERVAL_MS;
        const fast = FAST_INTERVAL_MS / 1000;
        setRemainingSec(fast);
      }

      setRemainingSec((s) => {
        const next = s - 1;
        if (next <= 0) {
          pingServer();
          return intervalMsRef.current / 1000;
        }
        return next;
      });
    }, 1000);
  };

  const resetWaking = () => {
    clearInterval(loopTimerRef.current);
    inFlightRef.current = false;
    setPhase("idle");
    setProgress(4);
    setStatusLabel("SLEEPING");
    setElapsedMs(0);
    setRemainingSec(INITIAL_INTERVAL_MS / 1000);
    setLastPingMs(null);
    setErrorMsg("");
    startTsRef.current = 0;
    intervalMsRef.current = INITIAL_INTERVAL_MS;
  };

  const launchApp = () => {
    if (config.launchUrl.match(/^https?:\/\//)) {
      window.location.href = config.launchUrl;
    } else {
      navigate(config.launchUrl);
    }
  };

  const handleCta = () => {
    if (phase === "ready") {
      launchApp();
    } else if (phase === "idle") {
      startWaking();
    }
  };

  // keep refs in sync with latest render
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    return () => clearInterval(loopTimerRef.current);
  }, []);

  const isWarmingUp = phase === "waking";
  const isReady = phase === "ready";

  return (
    <>
      {/* Custom typography + capsule bar + spinner keyframes (mirrors reference CSS) */}
      <style data-purpose="wake-styling">
        {`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f5f4f0; color: #0f0f10; -webkit-font-smoothing: antialiased; }
        .font-code { font-family: 'Space Mono', monospace; }
        .capsule-track { border: 1.8px solid #000000; border-radius: 9999px; height: 22px; background: #ffffff; padding: 2.5px; display: flex; align-items: center; box-shadow: 0 1px 2px rgba(0,0,0,0.04); position: relative; overflow: hidden; }
        .capsule-fill { background-color: #000000; height: 100%; border-radius: 9999px; min-width: 14px; transition: width 140ms cubic-bezier(0.4, 0, 0.2, 1); }
        .pulse-dot { animation: blink 1.2s infinite ease-in-out; }
        @keyframes blink { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .35; transform: scale(.9); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        `}
      </style>

      {/* BEGIN: PersistentTopLoadingHeader */}
      <header className="sticky top-0 z-50 bg-[#f5f4f0]/95 backdrop-blur-md border-b border-[#d8d5cd]/80 px-4 py-3 sm:py-4 transition-all" data-purpose="sticky-loading-bar">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex justify-between items-baseline mb-1.5 text-black font-code text-sm tracking-wider">
            <span className="font-normal select-none" id="wake-label">
              {phase === "idle" ? "idle" : phase === "ready" ? "ready" : "waking the server"}
            </span>
            <span className="font-normal text-right select-none" id="numeric-percentage">{progress}%</span>
          </div>
          <div className="capsule-track w-full" aria-live="polite">
            <div
              aria-label="Wake progress"
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={progress}
              className="capsule-fill"
              id="dynamic-progress-pill"
              style={{ width: progress + "%" }}
            />
          </div>
        </div>
      </header>

      {/* BEGIN: MainContent */}
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        {/* Header identity block */}
        <div className="border-b border-[#d8d5cd] pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4" data-purpose="profile-heading">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-black text-white text-xs font-code font-medium mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot"></span>
              SYS.RUN // VER: 2.4.0
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0f0f10]">{config.title}</h1>
            <p className="text-[#5c5e62] text-base sm:text-lg mt-1 font-normal">{config.appName} · {config.description}</p>
          </div>
          {/* Live telemetry badge */}
          <div className="text-left sm:text-right font-code text-xs text-[#5c5e62] space-y-0.5 bg-[#eceae4]/60 p-3 rounded-lg border border-[#d8d5cd]">
            <div>SERVER STATUS: <span className="text-black font-bold" id="pipeline-status">{statusLabel}</span></div>
            <div>TIME ELAPSED: <span className="text-black" id="time-elapsed">{formatElapsed(elapsedMs)}</span></div>
            <div>LAST PING: <span className="text-black" id="last-ping">{lastPingMs == null ? "— ms" : lastPingMs + " ms"}</span></div>
            <div>NEXT PING IN: <span className="text-black font-bold" id="next-ping">{phase === "idle" ? "—" : countdownLabel}</span></div>
          </div>
        </div>

        {/* App Overview & Challenges Section */}
        <div className="mb-8 p-4 bg-white/70 border border-[#d8d5cd] rounded-xl backdrop-blur-sm shadow-sm" data-purpose="app-overview">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="font-code text-xs uppercase tracking-wider text-[#5c5e62] block">What this does</span>
              <p className="text-xs text-[#0f0f10]/80 mt-0.5">Pings the live Render health endpoint until the cold instance reports ready, then launches {config.appName}.</p>
            </div>
            <span className="font-code text-[10px] uppercase tracking-wider text-[#5c5e62] bg-neutral-100 border border-neutral-200 rounded-full px-2 py-0.5">Free Tier</span>
          </div>
          <p className="text-sm text-[#5c5e62] leading-relaxed mb-4">
            Free-tier servers may take 40–80 seconds to wake up and start the app. While it boots, no data is requested —
            once a <code className="font-code">200 OK</code> is received the Launch button activates automatically.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#5c5e62]">
            {config.challenges.map((c) => (
              <div key={c.title} className="flex gap-2">
                <span className="font-code text-black">•</span>
                <span><strong className="text-ink-dark">{c.title}</strong> — {c.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wake-Up CTA Button */}
        <section className="mb-8" data-purpose="cta-section">
          <button
            id="main-cta"
            type="button"
            onClick={handleCta}
            disabled={isWarmingUp}
            aria-live="polite"
            className={`group inline-flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3 rounded-xl font-code font-semibold text-sm tracking-wider shadow-lg active:scale-95 transition-all ${
              isReady
                ? "bg-emerald-700 text-white hover:bg-emerald-800"
                : "bg-black text-white hover:bg-neutral-800"
            }`}
          >
            {isWarmingUp && (
              <>
                <svg
                  className="w-4 h-4 animate-[spin_0.9s_linear_infinite]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0113.43-5.57l1-1A10 10 0 0012 2v10H2z" />
                </svg>
                <span className="flex items-center gap-2">
                  <span>Waking render server…</span>
                  <span className="text-neutral-300" id="main-cta-countdown">{countdownLabel || " —"}</span>
                </span>
              </>
            )}
            {!isWarmingUp && !isReady && (
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot"></span>
                <span>Start Render Server — Free Tier</span>
              </span>
            )}
            {isReady && (
              <span className="flex items-center gap-2">
                <span>Launch Application →</span>
              </span>
            )}
          </button>
          <p className="font-code text-xs text-[#5c5e62] mt-2" id="cta-sub">
            {isReady
              ? "Health check passed (200 OK). The server is accepting traffic."
              : "Free-tier servers may take 40–80 seconds to wake up and start the app."}
          </p>
          {errorMsg && (
            <div
              id="error-box"
              className="mt-3 p-3 bg-white/80 border border-red-300 text-red-800 rounded-xl font-code text-xs cursor-pointer"
              role="status"
              onClick={resetWaking}
              aria-label="Reset and try waking the server again"
            >
              {errorMsg}
            </div>
          )}
        </section>

        {/* Live Telemetry Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2" data-purpose="metrics-grid">
          {telemetry.map((m) => (
            <div key={m.label} className="bg-white border border-[#d8d5cd] p-3.5 rounded-xl shadow-xs">
              <span className="font-code text-[11px] text-[#5c5e62] block uppercase">{m.label}</span>
              <span className="text-base font-bold font-code text-black mt-1 block">{m.value}</span>
            </div>
          ))}
        </div>

        {/* Live Pipeline Task Checklist (wake-up stages) */}
        <div className="bg-white border border-[#d8d5cd] rounded-xl divide-y divide-[#d8d5cd] shadow-sm overflow-hidden mt-6" data-purpose="pipeline-task-list">
          {pipelineStages.map((s, i) => {
            const labels = ["PENDING", "WAITING", "SYNCING", "QUEUED"];
            const colors = ["bg-neutral-100 text-neutral-500 font-medium border-neutral-200", "bg-black text-white font-semibold", "bg-neutral-100 text-neutral-500 font-medium border-neutral-200", "bg-neutral-100 text-neutral-500 font-medium border-neutral-200"];
            let label = labels[i];
            let color = colors[i];
            if (phase === "idle") {
              label = i === 0 ? "PENDING" : "QUEUED";
              color = colors[i];
            } else if (phase === "waking") {
              if (i === 0) { label = "DONE"; color = colors[0]; }
              else if (i === 1) { label = "WAKING"; color = colors[1]; }
              else if (i === 2 && lastPingMs != null) { label = "PINGING"; color = colors[1]; }
              else { label = "QUEUED"; color = colors[i]; }
            } else if (phase === "ready") {
              label = "DONE";
              color = colors[0];
            }
            return (
              <article key={s.id} className="p-4 flex items-start justify-between gap-4 transition hover:bg-neutral-50/70">
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${i === 0 ? (phase === "waking" || phase === "ready" ? "bg-black text-white" : "border-2 border-black bg-white") : i === 1 ? (phase === "waking" || phase === "ready" ? "border-2 border-black bg-white" : "border border-neutral-300 text-neutral-400") : "border border-neutral-300 text-neutral-400"}`}>
                    {phase === "ready" && i < 4 ? (
                      <span className="h-2 w-2 rounded-full bg-black"></span>
                    ) : phase === "waking" && i === 0 ? (
                      "✓"
                    ) : phase === "waking" && i === 1 ? (
                      <span className="h-2 w-2 rounded-full bg-black pulse-dot"></span>
                    ) : i + 1}
                  </span>
                  <div>
                    <h3 className={`text-sm font-semibold leading-tight ${phase === "ready" || (phase === "waking" && i <= 1) ? "text-black" : "text-neutral-700"}`}>{s.title}</h3>
                    <p className="text-xs text-[#5c5e62] mt-1">{s.description}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-code ${color}`}>{label}</span>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      {/* BEGIN: MinimalFooter */}
      <footer className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 border-t border-[#d8d5cd] text-xs text-[#5c5e62] flex flex-col sm:flex-row items-center justify-between gap-3 font-code" data-purpose="page-footer">
        <div>
          SpeakBetter // <span id="current-year">{new Date().getFullYear()}</span> · Health Monitor v2.4.0
        </div>
        <div className="flex items-center gap-4">
          <a className="hover:text-black transition-colors" href="https://github.com/Ayushvish0512/speakbetter" target="_blank" rel="noopener" aria-label="GitHub">GitHub</a>
          <span className="text-neutral-300">/</span>
          <span className="text-ink-dark font-bold" id="footer-status">{statusLabel}</span>
        </div>
      </footer>
    </>
  );
};

export default Wakeup;
