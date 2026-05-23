import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HomeScreen } from "./components/HomeScreen";
import { ChatScreen } from "./components/ChatScreen";
import { VisionBoardScreen } from "./components/VisionBoardScreen";
import { api } from "./services/api";
import { AuthScreen } from "./components/AuthScreen";

type Screen = "home" | "chat" | "vision";

const PHONE_W = 393;
const PHONE_H = 852;

const tabs: { id: Screen; label: string; icon: string }[] = [
  { id: "home", label: "الرئيسية", icon: "🏠" },
  { id: "chat", label: "المحادثة", icon: "💬" },
  { id: "vision", label: "الأهداف", icon: "🎯" },
];

const screenLabels: { id: Screen; label: string }[] = [
  { id: "home", label: "الشاشة الرئيسية" },
  { id: "chat", label: "المحادثة الذكية" },
  { id: "vision", label: "لوحة الأهداف" },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [scale, setScale] = useState(1);
  const [token, setToken] = useState<string | null>(api.getToken());
  const [activeGoal, setActiveGoal] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingGoal, setLoadingGoal] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchActiveGoal = async () => {
    if (!api.getToken()) return;
    setLoadingGoal(true);
    try {
      const data = await api.getGoal();
      if (data) {
        setActiveGoal({ id: data.id, text: data.text });
        setTasks(data.tasks || []);
      } else {
        setActiveGoal(null);
        setTasks([]);
      }
    } catch (err) {
      console.error("Failed to fetch goal:", err);
    } finally {
      setLoadingGoal(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchActiveGoal();
    } else {
      setActiveGoal(null);
      setTasks([]);
    }
  }, [token]);

  const handleAuthSuccess = (newToken: string) => {
    setToken(newToken);
  };

  useEffect(() => {
    const update = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const availH = el.clientHeight - 140;
      const availW = el.clientWidth - 48;
      setScale(Math.min(availH / PHONE_H, availW / PHONE_W, 1));
    };
    update();
    const obs = new ResizeObserver(update);
    if (wrapperRef.current) obs.observe(wrapperRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        background: "linear-gradient(155deg, #EDE9FF 0%, #FAFAFB 45%, #E6FFF7 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Cairo', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Brand header */}
      <div style={{ marginBottom: 18, textAlign: "center", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 30, fontWeight: 900, color: "#6C5CE7", fontFamily: "'Cairo', sans-serif" }}>أنار</span>
          <span style={{ fontSize: 26 }}>✨</span>
        </div>
        <p style={{ margin: "3px 0 0", fontSize: 13, color: "#636E72", fontFamily: "'Cairo', sans-serif", direction: "rtl" }}>
          مساعدك الذكي لتحقيق أهدافك
        </p>
        {token && (
          <button
            onClick={() => {
              api.setToken(null);
              setToken(null);
            }}
            style={{
              marginTop: 6,
              background: "none",
              border: "none",
              color: "#D63031",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            تسجيل الخروج
          </button>
        )}
      </div>

      {/* Phone frame */}
      <div
        style={{
          position: "relative",
          flexShrink: 0,
          width: PHONE_W,
          height: PHONE_H,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        {/* Outer shell */}
        <div style={{
          position: "absolute",
          inset: -13,
          background: "#1C1C1E",
          borderRadius: 62,
          boxShadow: "0 60px 120px rgba(0,0,0,0.45), inset 0 0 0 2px #3A3A3C, inset 0 0 0 1px #555",
        }} />

        {/* Side buttons */}
        <div style={{ position: "absolute", top: 130, right: -15, width: 4, height: 34, background: "#2C2C2E", borderRadius: 2 }} />
        <div style={{ position: "absolute", top: 180, left: -15, width: 4, height: 50, background: "#2C2C2E", borderRadius: 2 }} />
        <div style={{ position: "absolute", top: 244, left: -15, width: 4, height: 50, background: "#2C2C2E", borderRadius: 2 }} />

        {/* Screen */}
        <div style={{
          position: "absolute", inset: 0,
          background: "#FAFAFB",
          borderRadius: 48,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Status bar */}
          <div style={{
            height: 52, flexShrink: 0,
            background: "#FAFAFB",
            display: "flex", alignItems: "flex-end",
            justifyContent: "space-between",
            padding: "0 24px 8px",
            position: "relative",
          }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#2D3436", fontFamily: "'Cairo', sans-serif", letterSpacing: -0.3 }}>
              9:41
            </span>
            {/* Dynamic Island */}
            <div style={{
              position: "absolute", top: 11, left: "50%",
              transform: "translateX(-50%)",
              width: 126, height: 34,
              background: "#1C1C1E", borderRadius: 20,
            }} />
            {/* Status icons */}
            <div style={{ display: "flex", gap: 5, alignItems: "center", paddingBottom: 1 }}>
              <svg width="17" height="13" viewBox="0 0 17 13" fill="#2D3436">
                <rect x="0" y="5" width="3" height="8" rx="1" />
                <rect x="4.5" y="3" width="3" height="10" rx="1" />
                <rect x="9" y="1" width="3" height="12" rx="1" />
                <rect x="13.5" y="0" width="3" height="13" rx="1" opacity="0.35" />
              </svg>
              <svg width="15" height="12" viewBox="0 0 15 12" fill="#2D3436">
                <path d="M7.5 2.5C9.6 2.5 11.5 3.4 12.8 4.9L14.1 3.4C12.4 1.6 10 .5 7.5.5S2.6 1.6.9 3.4L2.2 4.9C3.5 3.4 5.4 2.5 7.5 2.5Z" />
                <path d="M7.5 5.5C8.8 5.5 9.9 6 10.7 6.9L12 5.4C10.8 4.2 9.2 3.5 7.5 3.5S4.2 4.2 3 5.4L4.3 6.9C5.1 6 6.2 5.5 7.5 5.5Z" />
                <circle cx="7.5" cy="10.5" r="1.8" />
              </svg>
              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <div style={{
                  width: 24, height: 12, borderRadius: 3.5,
                  border: "1.5px solid #2D3436",
                  display: "flex", alignItems: "center", padding: "1.5px 2px",
                }}>
                  <div style={{ width: "80%", height: "100%", background: "#2D3436", borderRadius: 2 }} />
                </div>
              </div>
            </div>
          </div>

          {/* Screen content */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            {!token ? (
              <AuthScreen onAuthSuccess={handleAuthSuccess} />
            ) : (
              <AnimatePresence mode="wait">
                {screen === "home" && (
                  <motion.div key="home" style={{ position: "absolute", inset: 0 }}
                    initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                  >
                    <HomeScreen onNavigate={setScreen} activeGoal={activeGoal} tasks={tasks} />
                  </motion.div>
                )}
                {screen === "chat" && (
                  <motion.div key="chat" style={{ position: "absolute", inset: 0 }}
                    initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                  >
                    <ChatScreen onNavigate={setScreen} refreshGoal={fetchActiveGoal} />
                  </motion.div>
                )}
                {screen === "vision" && (
                  <motion.div key="vision" style={{ position: "absolute", inset: 0 }}
                    initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                  >
                    <VisionBoardScreen onNavigate={setScreen} activeGoal={activeGoal} tasks={tasks} setTasks={setTasks} refreshGoal={fetchActiveGoal} />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Bottom tab bar */}
          {token && (
            <div
              dir="rtl"
              style={{
                height: 82, flexShrink: 0,
                background: "#FFFFFF",
                borderTop: "1px solid rgba(0,0,0,0.06)",
                display: "flex", alignItems: "center", justifyContent: "space-around",
                paddingBottom: 18,
              }}
            >
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setScreen(tab.id)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                    background: "none", border: "none", cursor: "pointer",
                    padding: "8px 20px",
                    fontFamily: "'Cairo', sans-serif",
                    position: "relative",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{tab.icon}</span>
                  <span style={{
                    fontSize: 11,
                    fontWeight: screen === tab.id ? 700 : 400,
                    color: screen === tab.id ? "#6C5CE7" : "#636E72",
                    transition: "color 0.2s ease",
                  }}>
                    {tab.label}
                  </span>
                  {screen === tab.id && (
                    <motion.div
                      layoutId="tab-dot"
                      style={{ width: 5, height: 5, borderRadius: "50%", background: "#6C5CE7" }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Screen switcher labels */}
      {token && (
        <div
          dir="rtl"
          style={{
            marginTop: 22 + PHONE_H * (scale - 1),
            display: "flex", gap: 32, flexShrink: 0,
            fontFamily: "'Cairo', sans-serif",
          }}
        >
          {screenLabels.map(s => (
            <button
              key={s.id}
              onClick={() => setScreen(s.id)}
              style={{
                fontSize: 13,
                fontWeight: screen === s.id ? 700 : 400,
                color: screen === s.id ? "#6C5CE7" : "#636E72",
                background: "none", border: "none", cursor: "pointer",
                padding: "4px 2px",
                borderBottom: screen === s.id ? "2px solid #6C5CE7" : "2px solid transparent",
                fontFamily: "'Cairo', sans-serif",
                transition: "all 0.2s ease",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
