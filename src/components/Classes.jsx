import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

const classEmoji = ["🎯","📐","🔬","🌍","📜","💡","🧬","🏛️","⚗️","🎨","🎭","🌿"];
const glowColors = [
  "rgba(168,85,247,0.5)","rgba(236,72,153,0.5)","rgba(59,130,246,0.5)",
  "rgba(16,185,129,0.5)","rgba(245,158,11,0.5)","rgba(239,68,68,0.5)",
  "rgba(99,102,241,0.5)","rgba(20,184,166,0.5)","rgba(251,146,60,0.5)",
  "rgba(132,204,22,0.5)","rgba(217,70,239,0.5)","rgba(6,182,212,0.5)",
];

function formatCount(n) {
  if (n === null || n === undefined) return "0";
  const num = parseInt(n, 10);
  if (isNaN(num)) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [visitors, setVisitors] = useState(null);
  const [totalPapers, setTotalPapers] = useState(null);

  useEffect(() => {
    API.get("classes/").then(r => setClasses(r.data)).catch(()=>{}).finally(()=>setLoading(false));
    API.get("papers/count/").then(r => setTotalPapers(r.data.count)).catch(()=>setTotalPapers("?"));
    const seen = sessionStorage.getItem("v");
    if (!seen) {
      sessionStorage.setItem("v","1");
      API.post("visitors/increment/").then(r=>setVisitors(r.data.count)).catch(()=>setVisitors(0));
    } else {
      API.get("visitors/").then(r=>setVisitors(r.data.count)).catch(()=>setVisitors(0));
    }
  }, []);

  const filtered = classes.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --glass: rgba(255,255,255,0.07);
          --glass-border: rgba(255,255,255,0.14);
          --glass-hover: rgba(255,255,255,0.12);
          --text: rgba(255,255,255,0.95);
          --text2: rgba(255,255,255,0.55);
          --text3: rgba(255,255,255,0.30);
          --accent: #C084FC;
          --accent2: #818CF8;
        }

        html, body {
          background: #060612;
          -webkit-font-smoothing: antialiased;
          overscroll-behavior: none;
        }

        .root {
          min-height: 100vh; min-height: 100dvh;
          font-family: 'Outfit', sans-serif;
          color: var(--text);
          position: relative; overflow-x: hidden;
          padding-bottom: max(env(safe-area-inset-bottom), 40px);
          background: #060612;
        }

        /* Aurora background */
        .aurora {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          overflow: hidden;
        }
        .aurora-orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: 0.35;
          animation: drift 12s ease-in-out infinite alternate;
        }
        .orb1 { width: 400px; height: 400px; top: -100px; left: -100px; background: radial-gradient(circle, #7C3AED, #4F46E5); animation-delay: 0s; }
        .orb2 { width: 300px; height: 300px; top: 20%; right: -80px; background: radial-gradient(circle, #EC4899, #8B5CF6); animation-delay: -3s; }
        .orb3 { width: 350px; height: 350px; bottom: 30%; left: 10%; background: radial-gradient(circle, #06B6D4, #3B82F6); animation-delay: -6s; }
        .orb4 { width: 250px; height: 250px; bottom: 0; right: 20%; background: radial-gradient(circle, #10B981, #6366F1); animation-delay: -9s; }
        @keyframes drift {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, -30px) scale(1.1); }
        }

        /* Noise grain overlay */
        .grain {
          position: fixed; inset: 0; pointer-events: none; z-index: 1; opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px;
        }

        /* All content above aurora */
        .content { position: relative; z-index: 2; }

        /* ── HEADER ── */
        .header {
          padding: max(env(safe-area-inset-top), 56px) 20px 28px;
          border-bottom: 1px solid var(--glass-border);
          background: rgba(6,6,18,0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          position: sticky; top: 0; z-index: 10;
        }

        .header-chip {
          display: inline-flex; align-items: center; gap: 7px;
          border: 1px solid var(--glass-border);
          background: var(--glass);
          backdrop-filter: blur(10px);
          border-radius: 100px; padding: 5px 14px 5px 7px;
          margin-bottom: 18px;
        }
        .chip-dot {
          width: 18px; height: 18px; border-radius: 6px;
          background: linear-gradient(135deg, #A855F7, #6366F1);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 800; color: white; font-family: 'Syne', sans-serif;
        }
        .chip-text {
          font-size: 11px; font-weight: 600; color: var(--accent);
          letter-spacing: 0.08em; text-transform: uppercase;
        }

        .header-title {
          font-family: 'Syne', sans-serif;
          font-size: 38px; font-weight: 800;
          letter-spacing: -1px; line-height: 1.0;
          margin-bottom: 6px;
        }
        .header-title .hi { color: var(--text); }
        .header-title .glow {
          background: linear-gradient(90deg, #C084FC, #818CF8, #67E8F9);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .header-sub { font-size: 14px; font-weight: 300; color: var(--text2); letter-spacing: 0.01em; }

        /* ── SPONSOR ── */
        .sponsor-wrap { padding: 16px 20px 0; }
        .sponsor {
          background: linear-gradient(135deg, rgba(124,58,237,0.3), rgba(99,102,241,0.2));
          border: 1px solid rgba(167,139,250,0.25);
          border-radius: 16px; padding: 14px 16px;
          display: flex; align-items: center; gap: 12px;
          backdrop-filter: blur(10px);
        }
        .sponsor-orb {
          width: 40px; height: 40px; border-radius: 12px;
          background: linear-gradient(135deg, #7C3AED, #4F46E5);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(124,58,237,0.4);
        }
        .sponsor-by { font-size: 10px; font-weight: 500; color: var(--text3); text-transform: uppercase; letter-spacing: 0.1em; }
        .sponsor-name { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: var(--text); margin-top: 2px; }
        .sponsor-pill {
          margin-left: auto; background: rgba(167,139,250,0.2); border: 1px solid rgba(167,139,250,0.3);
          font-size: 10px; font-weight: 700; color: #C084FC;
          padding: 4px 10px; border-radius: 100px; letter-spacing: 0.08em; text-transform: uppercase;
          flex-shrink: 0;
        }

        /* ── STATS ── */
        .stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; padding: 14px 20px 0; }
        .stat {
          background: var(--glass); border: 1px solid var(--glass-border);
          border-radius: 14px; padding: 14px 8px; text-align: center;
          backdrop-filter: blur(10px);
        }
        .stat-n {
          font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800;
          background: linear-gradient(135deg, #C084FC, #818CF8);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
          line-height: 1; margin-bottom: 4px;
        }
        .stat-k { font-size: 9px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: 0.1em; }

        /* ── VISITOR ── */
        .vis-wrap { padding: 14px 20px 0; }
        .vis-card {
          background: linear-gradient(135deg, rgba(168,85,247,0.15), rgba(99,102,241,0.1));
          border: 1px solid rgba(168,85,247,0.25);
          border-radius: 18px; padding: 20px;
          display: flex; align-items: center; gap: 16px;
          backdrop-filter: blur(16px);
          position: relative; overflow: hidden;
        }
        .vis-card::before {
          content: ''; position: absolute; right: -20px; top: -20px;
          width: 100px; height: 100px; border-radius: 50%;
          background: radial-gradient(circle, rgba(168,85,247,0.2), transparent);
          pointer-events: none;
        }
        .vis-icon {
          width: 56px; height: 56px; border-radius: 16px; flex-shrink: 0;
          background: linear-gradient(135deg, rgba(168,85,247,0.3), rgba(99,102,241,0.2));
          border: 1px solid rgba(168,85,247,0.3);
          display: flex; align-items: center; justify-content: center; font-size: 28px;
        }
        .vis-n {
          font-family: 'Syne', sans-serif; font-size: 34px; font-weight: 800;
          line-height: 1; letter-spacing: -1px; color: var(--text);
        }
        .vis-lbl { font-size: 12px; font-weight: 400; color: var(--text2); margin-top: 3px; }
        .live-tag {
          margin-left: auto; display: flex; align-items: center; gap: 5px;
          background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3);
          padding: 6px 12px; border-radius: 100px;
          font-size: 11px; font-weight: 600; color: #34D399; flex-shrink: 0;
        }
        .live-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #10B981;
          animation: pulse 1.4s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.5);opacity:0.4;} }

        .vis-skel {
          height: 96px; border-radius: 18px;
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite;
        }

        /* ── SEARCH ── */
        .search-wrap { padding: 14px 20px 0; }
        .search-box {
          display: flex; align-items: center; gap: 10px;
          background: var(--glass); border: 1px solid var(--glass-border);
          border-radius: 14px; padding: 0 16px;
          backdrop-filter: blur(16px); transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-box:focus-within {
          border-color: rgba(192,132,252,0.5);
          box-shadow: 0 0 0 3px rgba(168,85,247,0.1);
        }
        .s-ico { font-size: 16px; opacity: 0.3; flex-shrink: 0; }
        .s-in {
          flex: 1; border: none; outline: none; padding: 14px 0;
          font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 400;
          color: var(--text); background: transparent;
        }
        .s-in::placeholder { color: var(--text3); }
        .s-clr {
          border: none; background: none; color: var(--text2);
          font-size: 14px; padding: 4px; cursor: pointer;
          -webkit-tap-highlight-color: transparent; flex-shrink: 0;
        }

        /* ── SEC ── */
        .sec-bar { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px 12px; }
        .sec-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: var(--text2); text-transform: uppercase; letter-spacing: 0.12em; }
        .sec-count { font-size: 12px; font-weight: 500; color: var(--accent); background: rgba(168,85,247,0.12); border: 1px solid rgba(168,85,247,0.2); padding: 3px 10px; border-radius: 100px; }

        /* ── GRID ── */
        .grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; padding: 0 20px 20px; }

        .cls-card {
          background: var(--glass); border: 1px solid var(--glass-border);
          border-radius: 20px; padding: 18px;
          text-decoration: none; color: var(--text);
          display: flex; flex-direction: column; gap: 14px;
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          position: relative; overflow: hidden;
          transition: transform 0.18s, border-color 0.18s, box-shadow 0.18s;
          -webkit-tap-highlight-color: transparent;
        }
        .cls-card::before {
          content: ''; position: absolute;
          bottom: -24px; right: -24px;
          width: 80px; height: 80px; border-radius: 50%;
          pointer-events: none; transition: transform 0.3s;
        }
        .cls-card:active { transform: scale(0.94); border-color: rgba(255,255,255,0.2); }

        .cls-top { display: flex; align-items: flex-start; justify-content: space-between; }
        .cls-emoji-box {
          width: 46px; height: 46px; border-radius: 14px;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center; font-size: 24px;
          backdrop-filter: blur(4px);
        }
        .cls-num { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; color: var(--text3); letter-spacing: 0.1em; }
        .cls-name { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; letter-spacing: -0.2px; line-height: 1.15; }
        .cls-hint { font-size: 11px; font-weight: 400; color: var(--text2); margin-top: 3px; }
        .cls-foot { display: flex; align-items: center; justify-content: space-between; }
        .cls-open { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text3); }
        .cls-arrow {
          width: 28px; height: 28px; border-radius: 8px;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center; font-size: 15px; color: var(--text2);
        }

        /* ── SKEL ── */
        .skel {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite;
          border-radius: 20px; height: 138px;
          border: 1px solid var(--glass-border);
        }
        @keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }

        .empty { text-align: center; padding: 64px 20px; }
        .empty-icon { font-size: 52px; display: block; margin-bottom: 14px; }
        .empty-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: var(--text2); margin-bottom: 6px; }
        .empty-sub { font-size: 14px; color: var(--text3); }

        /* ── FOOTER ── */
        .footer {
          margin: 8px 20px 0;
          background: var(--glass); border: 1px solid var(--glass-border);
          border-radius: 18px; padding: 18px 20px;
          display: flex; align-items: center; gap: 14px;
          backdrop-filter: blur(16px);
        }
        .footer-logo {
          width: 42px; height: 42px; border-radius: 12px;
          background: linear-gradient(135deg, #7C3AED, #4F46E5);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(124,58,237,0.35);
        }
        .footer-name { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: var(--text); }
        .footer-sub { font-size: 11px; color: var(--text2); margin-top: 2px; }
      `}</style>

      {/* Aurora BG */}
      <div className="aurora">
        <div className="aurora-orb orb1" />
        <div className="aurora-orb orb2" />
        <div className="aurora-orb orb3" />
        <div className="aurora-orb orb4" />
      </div>
      <div className="grain" />

      <div className="content">
        {/* Header */}
        <div className="header">
          <div className="header-chip">
            <div className="chip-dot">Q</div>
            <span className="chip-text">Question Bank</span>
          </div>
          <div className="header-title">
            <span className="hi">Find your</span><br />
            <span className="glow">Papers.</span>
          </div>
          <div className="header-sub">Model questions · Free · Always</div>
        </div>

        {/* Sponsor */}
        <div className="sponsor-wrap">
          <div className="sponsor">
            <div className="sponsor-orb">⭐</div>
            <div>
              <div className="sponsor-by">Sponsored by</div>
              <div className="sponsor-name">SFI KOTTAKKAL LC</div>
            </div>
            <div className="sponsor-pill">Official</div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat"><div className="stat-n">{loading ? "—" : classes.length}</div><div className="stat-k">Classes</div></div>
          <div className="stat"><div className="stat-n">{totalPapers ?? "—"}</div><div className="stat-k">Papers</div></div>
          <div className="stat"><div className="stat-n">{visitors !== null ? formatCount(visitors) : "—"}</div><div className="stat-k">Visitors</div></div>
          <div className="stat"><div className="stat-n">Free</div><div className="stat-k">Always</div></div>
        </div>

        {/* Visitor */}
        <div className="vis-wrap">
          {visitors === null ? <div className="vis-skel" /> : (
            <div className="vis-card">
              <div className="vis-icon">👥</div>
              <div>
                <div className="vis-n">{formatCount(visitors)}</div>
                <div className="vis-lbl">Total Visitors</div>
              </div>
              <div className="live-tag"><div className="live-dot" />Live</div>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="search-wrap">
          <div className="search-box">
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
          {loading && Array(6).fill(0).map((_, i) => <div key={i} className="skel" />)}
          {!loading && filtered.map((cls, i) => {
            const g = glowColors[i % glowColors.length];
            return (
              <Link key={cls.id} to={`/subjects/${cls.id}`} className="cls-card"
                style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px ${g.replace("0.5","0.12")}` }}>
                <div className="cls-top">
                  <div className="cls-emoji-box">{classEmoji[i % classEmoji.length]}</div>
                  <span className="cls-num">{String(i+1).padStart(2,"0")}</span>
                </div>
                <div>
                  <div className="cls-name" style={{ background: `linear-gradient(135deg, #fff, ${g.replace("rgba(","rgba(").replace(",0.5)",",0.9)")})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Class {cls.name}</div>
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
        </div>
      </div>
    </div>
  );
}
