import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../api";
import SplashScreen from "./SplashScreen";
import Confetti from "./Cofetti";

const classEmoji = ["🎯","📐","🔬","🌍","📜","💡","🧬","🏛️","⚗️","🎨","🎭","🌿"];

const cardAccents = [
  { light: "#EDE9FE", border: "#C4B5FD", text: "#7C3AED" },
  { light: "#FCE7F3", border: "#F9A8D4", text: "#BE185D" },
  { light: "#D1FAE5", border: "#6EE7B7", text: "#065F46" },
  { light: "#DBEAFE", border: "#93C5FD", text: "#1D4ED8" },
  { light: "#FEF3C7", border: "#FCD34D", text: "#92400E" },
  { light: "#FFE4E6", border: "#FCA5A5", text: "#9F1239" },
  { light: "#E0E7FF", border: "#A5B4FC", text: "#3730A3" },
  { light: "#CCFBF1", border: "#5EEAD4", text: "#0F766E" },
  { light: "#FEF9C3", border: "#FDE047", text: "#713F12" },
  { light: "#F3E8FF", border: "#D8B4FE", text: "#7E22CE" },
  { light: "#ECFDF5", border: "#A7F3D0", text: "#065F46" },
  { light: "#FFF7ED", border: "#FED7AA", text: "#9A3412" },
];

function formatCount(n) {
  if (n === null || n === undefined) return "0";
  const num = parseInt(n, 10);
  if (isNaN(num)) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export function BottomNav() {
  const loc = useLocation();
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  const active = (path) => loc.pathname === path;

  return (
    <nav className="bnav">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .bnav {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid #F3F4F6;
          display: flex; align-items: center;
          padding: 8px 0 max(env(safe-area-inset-bottom), 12px);
          box-shadow: 0 -4px 24px rgba(0,0,0,0.06);
        }
        .bnav-item {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; gap: 3px;
          text-decoration: none; padding: 6px 0;
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.15s;
          position: relative;
        }
        .bnav-item:active { transform: scale(0.88); }
        .bnav-ico-wrap {
          width: 36px; height: 36px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        .bnav-item.active .bnav-ico-wrap {
          background: #1C1C1E;
        }
        .bnav-ico {
          font-size: 20px; line-height: 1;
          filter: grayscale(0.6); opacity: 0.35;
          transition: all 0.2s;
        }
        .bnav-item.active .bnav-ico {
          filter: none; opacity: 1;
        }
        .bnav-lbl {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 600;
          color: #9CA3AF; letter-spacing: 0.02em;
          transition: color 0.2s;
        }
        .bnav-item.active .bnav-lbl { color: #1C1C1E; font-weight: 700; }
        .bnav-badge {
          position: absolute; top: 2px; right: calc(50% - 22px);
          background: #EF4444; color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 9px; font-weight: 700;
          min-width: 16px; height: 16px; border-radius: 100px;
          display: flex; align-items: center; justify-content: center;
          padding: 0 4px;
          box-shadow: 0 2px 6px rgba(239,68,68,0.4);
        }
      `}</style>

      {[
        { to: "/", icon: "🏠", label: "Home" },
        { to: "/bookmarks", icon: "⭐", label: "Saved", badge: bookmarks.length },
        { to: "/about", icon: "ℹ️", label: "About" },
      ].map(({ to, icon, label, badge }) => (
        <Link key={to} to={to} className={`bnav-item ${active(to) ? "active" : ""}`}>
          <div className="bnav-ico-wrap">
            <span className="bnav-ico">{icon}</span>
          </div>
          <span className="bnav-lbl">{label}</span>
          {badge > 0 && <div className="bnav-badge">{badge > 9 ? "9+" : badge}</div>}
        </Link>
      ))}
    </nav>
  );
}

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [visitors, setVisitors] = useState(null);
  const [totalPapers, setTotalPapers] = useState(null);
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem("splashDone"));
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    API.get("classes/").then(r => setClasses(r.data)).catch(() => {}).finally(() => setLoading(false));
    API.get("papers/count/").then(r => setTotalPapers(r.data.count)).catch(() => setTotalPapers("?"));
    const seen = sessionStorage.getItem("visited");
    if (!seen) {
      sessionStorage.setItem("visited", "1");
      API.post("visitors/increment/").then(r => setVisitors(r.data.count)).catch(() => setVisitors(0));
    } else {
      API.get("visitors/").then(r => setVisitors(r.data.count)).catch(() => setVisitors(0));
    }
  }, []);

  const handleSplashDone = () => {
    sessionStorage.setItem("splashDone", "1");
    setShowSplash(false);
    if (!localStorage.getItem("confettiShown")) {
      localStorage.setItem("confettiShown", "1");
      setShowConfetti(true);
    }
  };

  const filtered = classes.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      {showSplash && <SplashScreen onDone={handleSplashDone} />}
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}

      <div className="root">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          :root {
            --bg: #FAFAF8;
            --surface: #FFFFFF;
            --border: #F0F0EE;
            --border2: #E5E5E3;
            --t1: #1C1C1E;
            --t2: #6B7280;
            --t3: #9CA3AF;
            --t4: #D1D5DB;
          }

          html, body { background: var(--bg); -webkit-font-smoothing: antialiased; overscroll-behavior: none; }

          .root {
            min-height: 100vh; min-height: 100dvh;
            background: var(--bg);
            font-family: 'DM Sans', sans-serif; color: var(--t1);
            overflow-x: hidden;
            padding-bottom: calc(max(env(safe-area-inset-bottom), 14px) + 72px);
          }

          /* Soft background texture */
          .bg-texture {
            position: fixed; inset: 0; z-index: 0; pointer-events: none;
            background-image: radial-gradient(circle, #E5E7EB 1px, transparent 1px);
            background-size: 32px 32px; opacity: 0.5;
          }
          .bg-glow1 {
            position: fixed; top: -120px; right: -120px;
            width: 400px; height: 400px; border-radius: 50%;
            background: radial-gradient(circle, rgba(99,102,241,0.07), transparent 70%);
            pointer-events: none; z-index: 0;
          }
          .bg-glow2 {
            position: fixed; bottom: -100px; left: -80px;
            width: 360px; height: 360px; border-radius: 50%;
            background: radial-gradient(circle, rgba(236,72,153,0.05), transparent 70%);
            pointer-events: none; z-index: 0;
          }

          .page { position: relative; z-index: 2; animation: pageIn 0.4s ease both; }
          @keyframes pageIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

          /* Header */
          .header {
            background: rgba(250,250,248,0.92);
            border-bottom: 1px solid var(--border);
            backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            padding: max(env(safe-area-inset-top), 52px) 20px 20px;
            position: sticky; top: 0; z-index: 20;
          }

          .brand-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }

          .brand-pill {
            display: inline-flex; align-items: center; gap: 8px;
            background: #1C1C1E; border-radius: 100px;
            padding: 6px 14px 6px 8px;
          }
          .brand-cube {
            width: 22px; height: 22px; border-radius: 7px;
            background: linear-gradient(135deg, #6366F1, #8B5CF6);
            display: flex; align-items: center; justify-content: center;
            font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700; color: #fff;
          }
          .brand-text { font-size: 11px; font-weight: 600; color: #fff; letter-spacing: 0.08em; text-transform: uppercase; }

          .notif-btn {
            width: 38px; height: 38px; border-radius: 12px;
            background: var(--surface); border: 1px solid var(--border2);
            display: flex; align-items: center; justify-content: center;
            font-size: 18px; cursor: pointer; position: relative;
            box-shadow: 0 1px 4px rgba(0,0,0,0.06);
            -webkit-tap-highlight-color: transparent;
          }
          .notif-dot {
            position: absolute; top: 8px; right: 9px;
            width: 6px; height: 6px; border-radius: 50%;
            background: #EF4444;
            box-shadow: 0 0 0 2px var(--bg);
            animation: blink 2.5s ease-in-out infinite;
          }
          @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}

          .hero-title {
            font-family: 'Playfair Display', serif;
            font-size: 38px; font-weight: 800;
            letter-spacing: -1px; line-height: 1.05; margin-bottom: 6px;
            color: var(--t1);
          }
          .hero-title em { font-style: normal; color: #6366F1; }
          .hero-sub { font-size: 14px; color: var(--t2); font-weight: 400; }

          /* Sponsor strip */
          .sponsor-wrap { padding: 16px 20px 0; }
          .sponsor {
            background: var(--surface); border: 1px solid var(--border2);
            border-radius: 18px; padding: 14px 16px;
            display: flex; align-items: center; gap: 12px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          }
          .spon-icon {
            width: 42px; height: 42px; border-radius: 13px;
            background: #1C1C1E;
            display: flex; align-items: center; justify-content: center;
            font-size: 20px; flex-shrink: 0;
          }
          .spon-by { font-size: 10px; font-weight: 500; color: var(--t3); text-transform: uppercase; letter-spacing: 0.1em; }
          .spon-name { font-size: 14px; font-weight: 700; color: var(--t1); margin-top: 2px; }
          .spon-chip {
            margin-left: auto; background: #F3F4F6; border: 1px solid var(--border2);
            border-radius: 100px; padding: 5px 12px;
            font-size: 10px; font-weight: 700; color: var(--t2);
            letter-spacing: 0.06em; text-transform: uppercase; flex-shrink: 0;
          }

          /* Stats */
          .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; padding: 14px 20px 0; }
          .stat {
            background: var(--surface); border: 1px solid var(--border2);
            border-radius: 16px; padding: 14px 8px;
            text-align: center;
            box-shadow: 0 1px 4px rgba(0,0,0,0.04);
            animation: fadeUp 0.5s ease both;
          }
          .stat:nth-child(1){animation-delay:0.1s} .stat:nth-child(2){animation-delay:0.18s}
          .stat:nth-child(3){animation-delay:0.26s} .stat:nth-child(4){animation-delay:0.34s}
          @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
          .stat-n { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: var(--t1); margin-bottom: 3px; }
          .stat-k { font-size: 9px; font-weight: 600; color: var(--t3); text-transform: uppercase; letter-spacing: 0.12em; }

          /* Visitor card */
          .vis-wrap { padding: 12px 20px 0; }
          .vis-card {
            background: #1C1C1E; border-radius: 20px; padding: 20px;
            display: flex; align-items: center; gap: 16px;
            position: relative; overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.14);
            animation: fadeUp 0.5s ease 0.4s both;
          }
          .vis-card-glow {
            position: absolute; right: -40px; top: -40px;
            width: 160px; height: 160px; border-radius: 50%;
            background: radial-gradient(circle, rgba(99,102,241,0.25), transparent);
            pointer-events: none;
          }
          .vis-icon {
            width: 52px; height: 52px; border-radius: 16px; flex-shrink: 0;
            background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
            display: flex; align-items: center; justify-content: center; font-size: 26px;
          }
          .vis-n { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 800; line-height: 1; color: #fff; }
          .vis-lbl { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 3px; }
          .live-pill {
            margin-left: auto; display: flex; align-items: center; gap: 6px;
            background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
            padding: 7px 14px; border-radius: 100px;
            font-size: 11px; font-weight: 700; color: #6EE7B7; flex-shrink: 0;
          }
          .live-dot {
            width: 6px; height: 6px; border-radius: 50%;
            background: #10B981;
            animation: livePulse 1.6s ease-in-out infinite;
          }
          @keyframes livePulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.7);opacity:0.4}}

          .vis-skel {
            height: 94px; border-radius: 20px;
            background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
            background-size: 200% 100%; animation: shimmer 1.5s infinite;
            border: 1px solid var(--border);
          }

          /* Search */
          .search-wrap { padding: 14px 20px 0; }
          .sbox {
            display: flex; align-items: center; gap: 10px;
            background: var(--surface); border: 1.5px solid var(--border2);
            border-radius: 16px; padding: 0 16px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.04);
            transition: border-color 0.2s, box-shadow 0.2s;
          }
          .sbox:focus-within {
            border-color: #6366F1;
            box-shadow: 0 0 0 4px rgba(99,102,241,0.08);
          }
          .s-ico { font-size: 15px; opacity: 0.3; flex-shrink: 0; }
          .s-in {
            flex: 1; border: none; outline: none;
            padding: 14px 0; font-family: 'DM Sans', sans-serif;
            font-size: 15px; color: var(--t1); background: transparent;
          }
          .s-in::placeholder { color: var(--t4); }
          .s-clr {
            background: #F3F4F6; border: 1px solid var(--border2);
            color: var(--t2); width: 22px; height: 22px; border-radius: 6px;
            font-size: 11px; display: flex; align-items: center; justify-content: center;
            cursor: pointer; -webkit-tap-highlight-color: transparent;
          }

          /* Section bar */
          .sec-bar { display: flex; align-items: center; justify-content: space-between; padding: 20px 20px 12px; }
          .sec-title {
            font-size: 11px; font-weight: 700; color: var(--t3);
            text-transform: uppercase; letter-spacing: 0.14em;
          }
          .sec-count {
            font-size: 12px; font-weight: 700; color: #6366F1;
            background: #EEF2FF; border: 1px solid #C7D2FE;
            padding: 3px 10px; border-radius: 100px;
          }

          /* Grid */
          .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 0 20px 20px; }

          .cls-card {
            background: var(--surface); border: 1.5px solid var(--border2);
            border-radius: 22px; padding: 18px;
            text-decoration: none; color: var(--t1);
            display: flex; flex-direction: column; gap: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            position: relative; overflow: hidden;
            transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
            -webkit-tap-highlight-color: transparent;
            animation: cardIn 0.4s ease both;
          }
          .cls-card::before {
            content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
            background: var(--card-accent, #6366F1); border-radius: 22px 22px 0 0;
          }
          .cls-card:active { transform: scale(0.95); box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
          @keyframes cardIn{from{opacity:0;transform:scale(0.95) translateY(6px)}to{opacity:1;transform:scale(1) translateY(0)}}

          .cls-top { display: flex; align-items: flex-start; justify-content: space-between; }
          .cls-emoji-wrap {
            width: 46px; height: 46px; border-radius: 14px;
            background: var(--card-light, #EEF2FF);
            border: 1px solid var(--card-border, #C7D2FE);
            display: flex; align-items: center; justify-content: center; font-size: 22px;
          }
          .cls-num { font-size: 10px; font-weight: 700; color: var(--t4); letter-spacing: 0.1em; margin-top: 4px; }
          .cls-name {
            font-family: 'Playfair Display', serif;
            font-size: 16px; font-weight: 700; letter-spacing: -0.2px; line-height: 1.25;
            color: var(--t1);
          }
          .cls-hint { font-size: 11px; color: var(--t3); margin-top: 3px; }
          .cls-foot { display: flex; align-items: center; justify-content: space-between; }
          .cls-open { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: var(--t4); }
          .cls-arrow {
            width: 28px; height: 28px; border-radius: 9px;
            background: #F9FAFB; border: 1px solid var(--border2);
            display: flex; align-items: center; justify-content: center;
            font-size: 14px; color: var(--t2);
          }

          .skel {
            background: linear-gradient(90deg, #F9FAFB 25%, #F3F4F6 50%, #F9FAFB 75%);
            background-size: 200% 100%; animation: shimmer 1.5s infinite;
            border-radius: 22px; height: 145px; border: 1px solid var(--border);
          }
          @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}

          .empty { text-align: center; padding: 70px 20px; }
          .empty-icon { font-size: 52px; display: block; margin-bottom: 16px; }
          .empty-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: var(--t2); margin-bottom: 8px; }
          .empty-sub { font-size: 14px; color: var(--t3); }

          .footer {
            margin: 8px 20px 0; background: var(--surface);
            border: 1px solid var(--border2); border-radius: 20px; padding: 18px 20px;
            display: flex; align-items: center; gap: 14px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          }
          .footer-logo {
            width: 42px; height: 42px; border-radius: 13px; background: #1C1C1E;
            display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;
          }
          .footer-name { font-size: 13px; font-weight: 700; color: var(--t1); }
          .footer-sub { font-size: 11px; color: var(--t3); margin-top: 2px; }
          .footer-heart { margin-left: auto; font-size: 18px; animation: heartbeat 2s ease-in-out infinite; }
          @keyframes heartbeat{0%,100%{transform:scale(1)}15%{transform:scale(1.3)}30%{transform:scale(1)}}
        `}</style>

        <div className="bg-texture" />
        <div className="bg-glow1" />
        <div className="bg-glow2" />

        <div className="page">
          <div className="header">
            <div className="brand-row">
              <div className="brand-pill">
                <div className="brand-cube">Q</div>
                <span className="brand-text">Question Bank</span>
              </div>
              <div className="notif-btn">🔔<div className="notif-dot" /></div>
            </div>
            <div className="hero-title">Find your<br /><em>Papers.</em></div>
            <div className="hero-sub">Model questions · Always free · Always yours</div>
          </div>

          <div className="sponsor-wrap">
            <div className="sponsor">
              <div className="spon-icon">⭐</div>
              <div>
                <div className="spon-by">Official Sponsor</div>
                <div className="spon-name">SFI KOTTAKKAL LC</div>
              </div>
              <div className="spon-chip">Official</div>
            </div>
          </div>

          <div className="stats">
            {[
              { v: loading ? "—" : classes.length, k: "Classes" },
              { v: totalPapers ?? "—", k: "Papers" },
              { v: visitors !== null ? formatCount(visitors) : "—", k: "Visitors" },
              { v: "Free", k: "Always" },
            ].map(({ v, k }) => (
              <div className="stat" key={k}>
                <div className="stat-n">{v}</div>
                <div className="stat-k">{k}</div>
              </div>
            ))}
          </div>

          <div className="vis-wrap">
            {visitors === null ? <div className="vis-skel" /> : (
              <div className="vis-card">
                <div className="vis-card-glow" />
                <div className="vis-icon">👥</div>
                <div>
                  <div className="vis-n">{formatCount(visitors)}</div>
                  <div className="vis-lbl">Total Visitors</div>
                </div>
                <div className="live-pill"><div className="live-dot" />Live</div>
              </div>
            )}
          </div>

          <div className="search-wrap">
            <div className="sbox">
              <span className="s-ico">🔍</span>
              <input className="s-in" placeholder="Search classes…" value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button className="s-clr" onClick={() => setSearch("")}>✕</button>}
            </div>
          </div>

          <div className="sec-bar">
            <span className="sec-title">All Classes</span>
            {!loading && <span className="sec-count">{filtered.length}</span>}
          </div>

          <div className="grid">
            {loading && Array(6).fill(0).map((_, i) => (
              <div key={i} className="skel" style={{ animationDelay: `${i * 0.08}s` }} />
            ))}
            {!loading && filtered.map((cls, i) => {
              const acc = cardAccents[i % cardAccents.length];
              return (
                <Link key={cls.id} to={`/subjects/${cls.id}`} className="cls-card"
                  style={{
                    '--card-accent': acc.text,
                    '--card-light': acc.light,
                    '--card-border': acc.border,
                    animationDelay: `${0.05 * i}s`
                  }}>
                  <div className="cls-top">
                    <div className="cls-emoji-wrap">{classEmoji[i % classEmoji.length]}</div>
                    <span className="cls-num">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div>
                    <div className="cls-name">Class {cls.name}</div>
                    <div className="cls-hint">Tap to explore</div>
                  </div>
                  <div className="cls-foot">
                    <span className="cls-open">Open</span>
                    <div className="cls-arrow">→</div>
                  </div>
                </Link>
              );
            })}
          </div>

          {!loading && filtered.length === 0 && (
            <div className="empty">
              <span className="empty-icon">🔍</span>
              <div className="empty-title">Nothing found</div>
              <div className="empty-sub">No classes match "{search}"</div>
            </div>
          )}

          <div className="footer">
            <div className="footer-logo">⭐</div>
            <div>
              <div className="footer-name">SFI KOTTAKKAL LC</div>
              <div className="footer-sub">Made with love for students</div>
            </div>
            <div className="footer-heart">❤️</div>
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  );
}
