import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../api";
import SplashScreen from "./SplashScreen";
import Confetti from "./Cofetti";

const classEmoji = ["🎯","📐","🔬","🌍","📜","💡","🧬","🏛️","⚗️","🎨","🎭","🌿"];
const glowColors = [
  "#A855F7","#EC4899","#3B82F6","#10B981","#F59E0B","#EF4444",
  "#6366F1","#14B8A6","#F97316","#84CC16","#D946EF","#06B6D4",
];

function formatCount(n) {
  if (n === null || n === undefined) return "0";
  const num = parseInt(n, 10);
  if (isNaN(num)) return "0";
  if (num >= 1000000) return (num/1000000).toFixed(1)+"M";
  if (num >= 1000) return (num/1000).toFixed(1)+"K";
  return num.toString();
}

export function BottomNav() {
  const loc = useLocation();
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  const active = (path) => loc.pathname === path;
  return (
    <nav className="bnav">
      <style>{`
        .bnav {
          position: fixed; bottom: 0; left: 0; right: 0;
          z-index: 100;
          background: rgba(5,5,16,0.88);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center;
          padding: 10px 0 max(env(safe-area-inset-bottom), 10px);
          padding-bottom: max(env(safe-area-inset-bottom), 14px);
        }
        .bnav-item {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; gap: 4px;
          text-decoration: none; padding: 4px 0;
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.15s;
          position: relative;
        }
        .bnav-item:active { transform: scale(0.88); }
        .bnav-ico {
          font-size: 22px; line-height: 1;
          filter: grayscale(0.4); opacity: 0.45;
          transition: all 0.2s;
        }
        .bnav-item.active .bnav-ico {
          filter: none; opacity: 1;
          filter: drop-shadow(0 0 8px rgba(192,132,252,0.7));
        }
        .bnav-lbl {
          font-family: 'Outfit', sans-serif;
          font-size: 10px; font-weight: 600;
          color: rgba(255,255,255,0.3); letter-spacing: 0.04em;
          transition: color 0.2s;
        }
        .bnav-item.active .bnav-lbl { color: #C084FC; }
        .bnav-active-dot {
          position: absolute; bottom: -2px;
          width: 4px; height: 4px; border-radius: 50%;
          background: #C084FC;
          box-shadow: 0 0 8px #C084FC;
        }
        .bnav-badge {
          position: absolute; top: 0; right: calc(50% - 18px);
          background: #EC4899; color: #fff;
          font-size: 9px; font-weight: 800;
          width: 16px; height: 16px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 8px rgba(236,72,153,0.6);
        }
      `}</style>
      <Link to="/" className={`bnav-item ${active("/")?"active":""}`}>
        <span className="bnav-ico">🏠</span>
        <span className="bnav-lbl">Home</span>
        {active("/") && <div className="bnav-active-dot"/>}
      </Link>
      <Link to="/bookmarks" className={`bnav-item ${active("/bookmarks")?"active":""}`}>
        <span className="bnav-ico">⭐</span>
        <span className="bnav-lbl">Saved</span>
        {bookmarks.length > 0 && <div className="bnav-badge">{bookmarks.length > 9 ? "9+" : bookmarks.length}</div>}
        {active("/bookmarks") && <div className="bnav-active-dot"/>}
      </Link>
      <Link to="/about" className={`bnav-item ${active("/about")?"active":""}`}>
        <span className="bnav-ico">ℹ️</span>
        <span className="bnav-lbl">About</span>
        {active("/about") && <div className="bnav-active-dot"/>}
      </Link>
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
    API.get("classes/").then(r=>setClasses(r.data)).catch(()=>{}).finally(()=>setLoading(false));
    API.get("papers/count/").then(r=>setTotalPapers(r.data.count)).catch(()=>setTotalPapers("?"));
    const seen = sessionStorage.getItem("visited");
    if (!seen) {
      sessionStorage.setItem("visited","1");
      API.post("visitors/increment/").then(r=>setVisitors(r.data.count)).catch(()=>setVisitors(0));
    } else {
      API.get("visitors/").then(r=>setVisitors(r.data.count)).catch(()=>setVisitors(0));
    }
  }, []);

  const handleSplashDone = () => {
    sessionStorage.setItem("splashDone","1");
    setShowSplash(false);
    if (!localStorage.getItem("confettiShown")) {
      localStorage.setItem("confettiShown","1");
      setShowConfetti(true);
    }
  };

  const filtered = classes.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      {showSplash && <SplashScreen onDone={handleSplashDone}/>}
      {showConfetti && <Confetti onDone={()=>setShowConfetti(false)}/>}

      <div className="root">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          :root {
            --g1: rgba(255,255,255,0.06); --gb: rgba(255,255,255,0.11);
            --t1: rgba(255,255,255,0.95); --t2: rgba(255,255,255,0.52); --t3: rgba(255,255,255,0.26);
            --ac: #C084FC; --bg: #050510;
          }
          html,body { background: var(--bg); -webkit-font-smoothing: antialiased; overscroll-behavior: none; }
          .root {
            min-height: 100vh; min-height: 100dvh; background: var(--bg);
            font-family: 'Outfit', sans-serif; color: var(--t1);
            overflow-x: hidden;
            padding-bottom: calc(max(env(safe-area-inset-bottom), 14px) + 68px);
          }

          /* Aurora */
          .scene { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
          .orb {
            position: absolute; border-radius: 50%; filter: blur(100px);
            opacity: 0; animation: orbIn 1.2s ease both, drift var(--dur,15s) ease-in-out infinite alternate;
            animation-delay: var(--d,0s), var(--fd,0s);
          }
          @keyframes orbIn { to { opacity: var(--op,0.32); } }
          @keyframes drift { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(var(--tx,20px),var(--ty,-20px)) scale(var(--sc,1.08))} }
          .o1{width:500px;height:500px;top:-120px;left:-120px;background:radial-gradient(circle,#7C3AED,#4F46E5,transparent 75%);--op:0.36;--dur:16s;--tx:40px;--ty:30px;--fd:0.5s;}
          .o2{width:380px;height:380px;top:10%;right:-80px;background:radial-gradient(circle,#EC4899,#8B5CF6,transparent 75%);--op:0.28;--dur:20s;--tx:-30px;--ty:40px;--d:-4s;--fd:0.3s;}
          .o3{width:420px;height:420px;bottom:20%;left:-60px;background:radial-gradient(circle,#06B6D4,#3B82F6,transparent 75%);--op:0.26;--dur:18s;--tx:50px;--ty:-30px;--d:-9s;--fd:0.8s;}
          .o4{width:300px;height:300px;bottom:8%;right:-40px;background:radial-gradient(circle,#10B981,#6366F1,transparent 75%);--op:0.22;--dur:14s;--tx:-20px;--ty:-40px;--d:-13s;--fd:1.1s;}
          .o5{width:250px;height:250px;top:45%;left:35%;background:radial-gradient(circle,#F59E0B,#EF4444,transparent 75%);--op:0.16;--dur:22s;--tx:30px;--ty:25px;--d:-7s;--fd:1.5s;}

          .grid-bg { position:fixed;inset:0;pointer-events:none;z-index:1;opacity:0.025;
            background-image:linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px);
            background-size:60px 60px; }
          .grain { position:fixed;inset:0;pointer-events:none;z-index:1;opacity:0.045;
            background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
            background-size:256px; }

          .page { position:relative;z-index:2;animation:pageIn 0.5s ease 0.1s both; }
          @keyframes pageIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

          /* Header */
          .header {
            background: rgba(5,5,16,0.8); border-bottom: 1px solid var(--gb);
            backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
            padding: max(env(safe-area-inset-top),52px) 20px 24px;
            position: sticky; top: 0; z-index: 20;
          }
          .brand-row { display:flex;align-items:center;justify-content:space-between;margin-bottom:20px; }
          .brand-pill {
            display:inline-flex;align-items:center;gap:8px;
            background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.25);
            border-radius:100px;padding:5px 14px 5px 6px;
            animation:slideIn 0.5s ease 0.3s both;
          }
          @keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
          .brand-cube {
            width:22px;height:22px;border-radius:7px;
            background:linear-gradient(135deg,#A855F7,#6366F1);
            display:flex;align-items:center;justify-content:center;
            font-family:'Syne',sans-serif;font-size:11px;font-weight:800;color:#fff;
            box-shadow:0 0 12px rgba(168,85,247,0.5);
          }
          .brand-text { font-size:11px;font-weight:600;color:var(--ac);letter-spacing:0.1em;text-transform:uppercase; }
          .notif-btn {
            width:38px;height:38px;border-radius:12px;
            background:var(--g1);border:1px solid var(--gb);
            display:flex;align-items:center;justify-content:center;
            font-size:18px;cursor:pointer;position:relative;
            -webkit-tap-highlight-color:transparent;
            backdrop-filter:blur(8px);
          }
          .notif-dot {
            position:absolute;top:8px;right:9px;
            width:6px;height:6px;border-radius:50%;
            background:#EC4899;box-shadow:0 0 8px #EC4899;
            animation:blink 2s ease-in-out infinite;
          }
          @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}

          .hero-title {
            font-family:'Syne',sans-serif;font-size:40px;font-weight:800;
            letter-spacing:-1.2px;line-height:1.0;margin-bottom:8px;
            animation:slideUp 0.6s ease 0.35s both;
          }
          @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
          .hero-plain { color:var(--t1); }
          .hero-grad {
            background:linear-gradient(90deg,#C084FC 0%,#818CF8 40%,#67E8F9 100%);
            -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
            background-size:200% auto;animation:gradShift 4s linear infinite;
          }
          @keyframes gradShift{0%{background-position:0%}100%{background-position:200%}}
          .hero-sub { font-size:14px;font-weight:400;color:var(--t2);animation:slideUp 0.6s ease 0.45s both; }

          /* Sponsor */
          .sponsor-wrap { padding:16px 20px 0; }
          .sponsor {
            background:linear-gradient(135deg,rgba(124,58,237,0.22),rgba(79,70,229,0.14));
            border:1px solid rgba(167,139,250,0.22);border-radius:18px;padding:16px 18px;
            display:flex;align-items:center;gap:14px;backdrop-filter:blur(12px);
            position:relative;overflow:hidden;animation:fadeUp 0.5s ease 0.5s both;
          }
          @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
          .sponsor::before { content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(168,85,247,0.08),transparent 60%);pointer-events:none; }
          .spon-blob { position:absolute;top:-30px;right:-30px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,rgba(168,85,247,0.2),transparent);pointer-events:none; }
          .spon-icon { width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#7C3AED,#4F46E5);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;box-shadow:0 4px 20px rgba(124,58,237,0.45),inset 0 1px 0 rgba(255,255,255,0.2); }
          .spon-by { font-size:10px;font-weight:500;color:var(--t3);text-transform:uppercase;letter-spacing:0.12em; }
          .spon-name { font-family:'Syne',sans-serif;font-size:15px;font-weight:800;color:var(--t1);margin-top:2px; }
          .spon-chip { margin-left:auto;background:rgba(168,85,247,0.2);border:1px solid rgba(168,85,247,0.35);border-radius:100px;padding:5px 12px;font-size:10px;font-weight:800;color:var(--ac);letter-spacing:0.08em;text-transform:uppercase;flex-shrink:0; }

          /* Stats */
          .stats { display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:14px 20px 0; }
          .stat {
            background:var(--g1);border:1px solid var(--gb);border-radius:16px;padding:16px 8px;
            text-align:center;backdrop-filter:blur(12px);position:relative;overflow:hidden;
            animation:fadeUp 0.5s ease both;
          }
          .stat:nth-child(1){animation-delay:0.55s}.stat:nth-child(2){animation-delay:0.65s}
          .stat:nth-child(3){animation-delay:0.75s}.stat:nth-child(4){animation-delay:0.85s}
          .stat::before { content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:60%;height:1px;background:linear-gradient(90deg,transparent,rgba(192,132,252,0.5),transparent); }
          .stat-n { font-family:'Syne',sans-serif;font-size:20px;font-weight:800;line-height:1;margin-bottom:5px;background:linear-gradient(135deg,#E9D5FF,#C084FC);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent; }
          .stat-k { font-size:9px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:0.12em; }

          /* Visitor */
          .vis-wrap { padding:14px 20px 0; }
          .vis-card {
            background:linear-gradient(135deg,rgba(168,85,247,0.14),rgba(99,102,241,0.09));
            border:1px solid rgba(168,85,247,0.22);border-radius:20px;padding:20px;
            display:flex;align-items:center;gap:16px;backdrop-filter:blur(16px);
            position:relative;overflow:hidden;animation:fadeUp 0.5s ease 0.9s both;
          }
          .vis-card::after { content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent 10%,rgba(192,132,252,0.6) 50%,transparent 90%); }
          .vis-blob { position:absolute;right:-30px;top:-30px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,rgba(168,85,247,0.2),transparent);pointer-events:none; }
          .vis-icon { width:58px;height:58px;border-radius:18px;flex-shrink:0;background:linear-gradient(135deg,rgba(168,85,247,0.25),rgba(99,102,241,0.15));border:1px solid rgba(168,85,247,0.3);display:flex;align-items:center;justify-content:center;font-size:30px;box-shadow:0 8px 24px rgba(168,85,247,0.2); }
          .vis-n { font-family:'Syne',sans-serif;font-size:36px;font-weight:800;line-height:1;letter-spacing:-1.5px;background:linear-gradient(135deg,#fff,#C084FC);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent; }
          .vis-lbl { font-size:12px;font-weight:400;color:var(--t2);margin-top:4px; }
          .live-pill { display:flex;align-items:center;gap:6px;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.28);padding:7px 14px;border-radius:100px;font-size:11px;font-weight:700;color:#34D399;flex-shrink:0; }
          .live-dot { width:7px;height:7px;border-radius:50%;background:#10B981;box-shadow:0 0 8px #10B981;animation:livePulse 1.6s ease-in-out infinite; }
          @keyframes livePulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.6);opacity:0.4}}
          .vis-skel { height:98px;border-radius:20px;background:linear-gradient(90deg,rgba(255,255,255,0.03) 25%,rgba(255,255,255,0.07) 50%,rgba(255,255,255,0.03) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border:1px solid var(--gb); }

          /* Search */
          .search-wrap { padding:14px 20px 0; }
          .sbox { display:flex;align-items:center;gap:10px;background:var(--g1);border:1px solid var(--gb);border-radius:16px;padding:0 16px;backdrop-filter:blur(16px);transition:border-color 0.25s,box-shadow 0.25s; }
          .sbox:focus-within { border-color:rgba(192,132,252,0.5);box-shadow:0 0 0 4px rgba(168,85,247,0.1),0 0 20px rgba(168,85,247,0.08); }
          .s-ico { font-size:16px;opacity:0.25;flex-shrink:0; }
          .s-in { flex:1;border:none;outline:none;padding:14px 0;font-family:'Outfit',sans-serif;font-size:15px;color:var(--t1);background:transparent; }
          .s-in::placeholder { color:var(--t3); }
          .s-clr { border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.07);color:var(--t2);width:22px;height:22px;border-radius:6px;font-size:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;-webkit-tap-highlight-color:transparent; }

          /* Section */
          .sec-bar { display:flex;align-items:center;justify-content:space-between;padding:20px 20px 12px; }
          .sec-title { font-family:'Syne',sans-serif;font-size:12px;font-weight:700;color:var(--t2);text-transform:uppercase;letter-spacing:0.14em;display:flex;align-items:center;gap:8px; }
          .sec-title::before { content:'';display:block;width:14px;height:2px;background:linear-gradient(90deg,#C084FC,#818CF8);border-radius:2px; }
          .sec-count { font-size:12px;font-weight:600;color:var(--ac);background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.2);padding:3px 11px;border-radius:100px; }

          /* Grid */
          .grid { display:grid;grid-template-columns:repeat(2,1fr);gap:10px;padding:0 20px 20px; }
          .cls-card {
            background:var(--g1);border:1px solid var(--gb);border-radius:22px;padding:18px;
            text-decoration:none;color:var(--t1);display:flex;flex-direction:column;gap:14px;
            backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
            position:relative;overflow:hidden;
            transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1),border-color 0.2s,box-shadow 0.2s;
            -webkit-tap-highlight-color:transparent;animation:cardIn 0.4s ease both;
          }
          .cls-card::before { content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent 10%,var(--cg,rgba(168,85,247,0.6)) 50%,transparent 90%); }
          .cls-card::after { content:'';position:absolute;bottom:-24px;right:-24px;width:80px;height:80px;border-radius:50%;background:radial-gradient(circle,var(--cg,rgba(168,85,247,0.2)),transparent);pointer-events:none; }
          .cls-card:active { transform:scale(0.93); }
          @keyframes cardIn{from{opacity:0;transform:scale(0.94) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
          .cls-top { display:flex;align-items:flex-start;justify-content:space-between; }
          .cls-emoji-wrap { width:48px;height:48px;border-radius:15px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;font-size:24px;box-shadow:0 4px 16px rgba(0,0,0,0.3);backdrop-filter:blur(4px); }
          .cls-num { font-family:'Syne',sans-serif;font-size:11px;font-weight:700;color:var(--t3);letter-spacing:0.1em; }
          .cls-name { font-family:'Syne',sans-serif;font-size:16px;font-weight:800;letter-spacing:-0.3px;line-height:1.2;background:linear-gradient(135deg,#fff 30%,var(--cg2,#C084FC));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent; }
          .cls-hint { font-size:11px;color:var(--t3);margin-top:3px; }
          .cls-foot { display:flex;align-items:center;justify-content:space-between; }
          .cls-open { font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;color:var(--t3); }
          .cls-arrow { width:30px;height:30px;border-radius:9px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--t2); }

          .skel { background:linear-gradient(90deg,rgba(255,255,255,0.03) 25%,rgba(255,255,255,0.07) 50%,rgba(255,255,255,0.03) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:22px;height:140px;border:1px solid var(--gb); }
          @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}

          .empty { text-align:center;padding:70px 20px; }
          .empty-icon { font-size:56px;display:block;margin-bottom:16px;filter:drop-shadow(0 0 20px rgba(168,85,247,0.4)); }
          .empty-title { font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:var(--t2);margin-bottom:8px; }
          .empty-sub { font-size:14px;color:var(--t3); }

          .footer { margin:8px 20px 0;background:var(--g1);border:1px solid var(--gb);border-radius:20px;padding:18px 20px;display:flex;align-items:center;gap:14px;backdrop-filter:blur(16px);position:relative;overflow:hidden; }
          .footer::before { content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(192,132,252,0.4),transparent); }
          .footer-logo { width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#7C3AED,#4F46E5);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;box-shadow:0 4px 20px rgba(124,58,237,0.4),inset 0 1px 0 rgba(255,255,255,0.2); }
          .footer-name { font-family:'Syne',sans-serif;font-size:14px;font-weight:800;color:var(--t1); }
          .footer-sub { font-size:11px;color:var(--t2);margin-top:3px; }
          .footer-heart { margin-left:auto;font-size:20px;animation:heartbeat 1.8s ease-in-out infinite; }
          @keyframes heartbeat{0%,100%{transform:scale(1)}15%{transform:scale(1.3)}30%{transform:scale(1)}}
        `}</style>

        <div className="scene">
          <div className="orb o1"/><div className="orb o2"/><div className="orb o3"/>
          <div className="orb o4"/><div className="orb o5"/>
        </div>
        <div className="grid-bg"/><div className="grain"/>

        <div className="page">
          <div className="header">
            <div className="brand-row">
              <div className="brand-pill">
                <div className="brand-cube">Q</div>
                <span className="brand-text">Question Bank</span>
              </div>
              <div className="notif-btn">🔔<div className="notif-dot"/></div>
            </div>
            <div className="hero-title">
              <span className="hero-plain">Find your<br/></span>
              <span className="hero-grad">Papers.</span>
            </div>
            <div className="hero-sub">Model questions · Always free · Always yours</div>
          </div>

          <div className="sponsor-wrap">
            <div className="sponsor">
              <div className="spon-blob"/>
              <div className="spon-icon">⭐</div>
              <div><div className="spon-by">Official Sponsor</div><div className="spon-name">SFI KOTTAKKAL LC</div></div>
              <div className="spon-chip">✦ Official</div>
            </div>
          </div>

          <div className="stats">
            {[
              {v: loading?"—":classes.length, k:"Classes"},
              {v: totalPapers??"—", k:"Papers"},
              {v: visitors!==null?formatCount(visitors):"—", k:"Visitors"},
              {v:"Free", k:"Always"},
            ].map(({v,k})=>(
              <div className="stat" key={k}>
                <div className="stat-n">{v}</div>
                <div className="stat-k">{k}</div>
              </div>
            ))}
          </div>

          <div className="vis-wrap">
            {visitors===null ? <div className="vis-skel"/> : (
              <div className="vis-card">
                <div className="vis-blob"/>
                <div className="vis-icon">👥</div>
                <div><div className="vis-n">{formatCount(visitors)}</div><div className="vis-lbl">Total Visitors</div></div>
                <div className="live-pill"><div className="live-dot"/>Live</div>
              </div>
            )}
          </div>

          <div className="search-wrap">
            <div className="sbox">
              <span className="s-ico">🔍</span>
              <input className="s-in" placeholder="Search classes…" value={search} onChange={e=>setSearch(e.target.value)}/>
              {search && <button className="s-clr" onClick={()=>setSearch("")}>✕</button>}
            </div>
          </div>

          <div className="sec-bar">
            <span className="sec-title">All Classes</span>
            {!loading && <span className="sec-count">{filtered.length}</span>}
          </div>

          <div className="grid">
            {loading && Array(6).fill(0).map((_,i)=><div key={i} className="skel" style={{animationDelay:`${i*0.08}s`}}/>)}
            {!loading && filtered.map((cls,i)=>{
              const g = glowColors[i % glowColors.length];
              return (
                <Link key={cls.id} to={`/subjects/${cls.id}`} className="cls-card"
                  style={{'--cg':`${g}88`,'--cg2':g,boxShadow:`0 8px 32px ${g}18`,animationDelay:`${0.05*i}s`}}>
                  <div className="cls-top">
                    <div className="cls-emoji-wrap" style={{boxShadow:`0 0 20px ${g}44`}}>{classEmoji[i%classEmoji.length]}</div>
                    <span className="cls-num">{String(i+1).padStart(2,"0")}</span>
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

          {!loading && filtered.length===0 && (
            <div className="empty">
              <span className="empty-icon">🔍</span>
              <div className="empty-title">Nothing found</div>
              <div className="empty-sub">No classes match "{search}"</div>
            </div>
          )}

          <div className="footer">
            <div className="footer-logo">⭐</div>
            <div><div className="footer-name">SFI KOTTAKKAL LC</div><div className="footer-sub">Made with love for students</div></div>
            <div className="footer-heart">❤️</div>
          </div>
        </div>
      </div>

      <BottomNav/>
    </>
  );
}
