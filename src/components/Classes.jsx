import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

const classColors = [
  "#00FF87","#00D4FF","#FF6B6B","#FFD166",
  "#C77DFF","#FF9F43","#00FF87","#00D4FF",
  "#FF6B6B","#FFD166","#C77DFF","#FF9F43"
];
const classEmoji = ["🎯","📐","🔬","🌍","📜","💡","🧬","🏛️","⚗️","🎨","🎭","🌿"];

function formatCount(n) {
  if (n === null || n === undefined) return "0";
  const num = parseInt(n, 10);
  if (isNaN(num)) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function Classes() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [visitors, setVisitors] = useState(null);
  const [totalPapers, setTotalPapers] = useState(null);

  useEffect(() => {
    API.get("classes/")
      .then(res => setClasses(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));

    API.get("papers/count/")
      .then(res => setTotalPapers(res.data.count))
      .catch(() => setTotalPapers("?"));

    const visited = sessionStorage.getItem("visited");
    if (!visited) {
      sessionStorage.setItem("visited", "1");
      API.post("visitors/increment/")
        .then(res => setVisitors(res.data.count))
        .catch(() => API.get("visitors/").then(res => setVisitors(res.data.count)).catch(() => setVisitors(0)));
    } else {
      API.get("visitors/")
        .then(res => setVisitors(res.data.count))
        .catch(() => setVisitors(0));
    }
  }, []);

  const filtered = classes.filter(cls =>
    cls.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Clash+Display:wght@700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #050508;
          --bg2: #0A0A10;
          --card: #0F0F18;
          --card2: #141420;
          --neon: #00FF87;
          --neon2: #00D4FF;
          --pink: #FF3CAC;
          --gold: #FFD166;
          --text: #FFFFFF;
          --text2: #B0B0C8;
          --muted: #505068;
          --border: rgba(255,255,255,0.06);
          --border2: rgba(0,255,135,0.2);
          --glow: rgba(0,255,135,0.15);
        }

        body { background: var(--bg); margin: 0; }

        .app {
          min-height: 100vh; min-height: 100dvh;
          background: var(--bg);
          font-family: 'Barlow', sans-serif;
          color: var(--text);
          padding-bottom: env(safe-area-inset-bottom, 40px);
          overflow-x: hidden;
          position: relative;
        }

        /* Background mesh */
        .app::before {
          content: '';
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background:
            radial-gradient(ellipse 80% 40% at 50% -10%, rgba(0,255,135,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(0,212,255,0.05) 0%, transparent 60%);
          pointer-events: none; z-index: 0;
        }

        .inner { position: relative; z-index: 1; }

        /* ── HERO ── */
        .hero {
          padding: 56px 20px 32px;
          position: relative;
        }

        .hero-eyebrow {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 16px;
        }
        .eyebrow-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--neon);
          box-shadow: 0 0 8px var(--neon);
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%,100% { box-shadow: 0 0 8px var(--neon); transform: scale(1); }
          50% { box-shadow: 0 0 16px var(--neon), 0 0 32px rgba(0,255,135,0.3); transform: scale(1.2); }
        }
        .eyebrow-text {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--neon);
        }

        .hero-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(52px, 16vw, 80px);
          font-weight: 900;
          line-height: 0.9;
          letter-spacing: -1px;
          margin-bottom: 12px;
        }
        .hero-title .line2 {
          background: linear-gradient(90deg, var(--neon), var(--neon2));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-desc {
          font-size: 14px; font-weight: 300;
          color: var(--text2); line-height: 1.5;
          max-width: 280px;
        }

        /* ── SPONSOR TAG ── */
        .sponsor-tag {
          margin: 0 20px;
          background: linear-gradient(135deg, rgba(0,255,135,0.08), rgba(0,212,255,0.08));
          border: 1px solid var(--border2);
          border-radius: 12px;
          padding: 12px 16px;
          display: flex; align-items: center; gap: 10px;
        }
        .sponsor-icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: linear-gradient(135deg, var(--neon), var(--neon2));
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 900; color: #000;
          flex-shrink: 0;
        }
        .sponsor-info { flex: 1; }
        .sponsor-label {
          font-size: 10px; font-weight: 600;
          color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em;
        }
        .sponsor-name {
          font-size: 13px; font-weight: 700;
          color: var(--neon); letter-spacing: 0.04em;
        }
        .sponsor-badge {
          font-size: 10px; font-weight: 800;
          background: var(--neon); color: #000;
          padding: 3px 8px; border-radius: 4px;
          letter-spacing: 0.06em; text-transform: uppercase;
        }

        /* ── STATS ── */
        .stats-row {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 10px; padding: 16px 20px 0;
        }
        .stat-box {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px; padding: 14px 10px;
          text-align: center; position: relative; overflow: hidden;
        }
        .stat-box::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--neon), transparent);
        }
        .stat-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 24px; font-weight: 800;
          color: var(--neon); line-height: 1; margin-bottom: 4px;
        }
        .stat-label {
          font-size: 9px; font-weight: 700;
          color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em;
        }

        /* ── VISITOR ── */
        .visitor-wrap { padding: 16px 20px 0; }
        .visitor-card {
          background: var(--card);
          border: 1px solid var(--border2);
          border-radius: 16px; padding: 18px;
          display: flex; align-items: center; gap: 16px;
          position: relative; overflow: hidden;
        }
        .visitor-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(0,255,135,0.04), rgba(0,212,255,0.04));
          pointer-events: none;
        }
        .visitor-glow {
          position: absolute; top: -20px; right: -20px;
          width: 80px; height: 80px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,255,135,0.15), transparent 70%);
          pointer-events: none;
        }
        .visitor-icon {
          width: 52px; height: 52px; border-radius: 14px;
          background: linear-gradient(135deg, rgba(0,255,135,0.15), rgba(0,212,255,0.1));
          border: 1px solid rgba(0,255,135,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; flex-shrink: 0;
        }
        .visitor-data { flex: 1; }
        .visitor-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 36px; font-weight: 800;
          color: var(--text); line-height: 1;
          letter-spacing: -0.5px;
        }
        .visitor-sub {
          font-size: 11px; font-weight: 600;
          color: var(--text2); margin-top: 2px;
          text-transform: uppercase; letter-spacing: 0.1em;
        }
        .live-chip {
          display: flex; align-items: center; gap: 5px;
          background: rgba(0,255,135,0.1);
          border: 1px solid rgba(0,255,135,0.25);
          padding: 6px 12px; border-radius: 100px;
          font-size: 11px; font-weight: 800;
          color: var(--neon); flex-shrink: 0;
          letter-spacing: 0.06em; text-transform: uppercase;
        }
        .live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--neon);
          box-shadow: 0 0 6px var(--neon);
          animation: blink 1.2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }

        .visitor-skeleton {
          margin: 0 20px; height: 88px; border-radius: 16px;
          background: linear-gradient(90deg, #0f0f18 25%, #141420 50%, #0f0f18 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite;
        }
        .visitor-skeleton-wrap { padding: 16px 20px 0; }

        /* ── SEARCH ── */
        .search-wrap { padding: 16px 20px 4px; position: relative; }
        .search-icon {
          position: absolute; left: 34px; top: 50%;
          transform: translateY(-50%); font-size: 14px;
          pointer-events: none; color: var(--muted);
        }
        .search {
          width: 100%; background: var(--card);
          border: 1px solid var(--border); border-radius: 12px;
          padding: 13px 16px 13px 40px;
          font-family: 'Barlow', sans-serif;
          font-size: 15px; color: var(--text); outline: none;
          -webkit-appearance: none; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search::placeholder { color: var(--muted); }
        .search:focus {
          border-color: rgba(0,255,135,0.4);
          box-shadow: 0 0 0 3px rgba(0,255,135,0.06);
        }

        /* ── SECTION ── */
        .section-head {
          padding: 16px 20px 12px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .section-title {
          font-size: 11px; font-weight: 700;
          color: var(--muted); text-transform: uppercase; letter-spacing: 0.14em;
        }
        .section-count {
          font-size: 11px; font-weight: 700;
          color: var(--neon);
        }

        /* ── GRID ── */
        .grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 10px; padding: 0 20px 20px;
        }

        .cls-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 18px 16px 16px;
          text-decoration: none; color: var(--text);
          display: flex; flex-direction: column; gap: 12px;
          position: relative; overflow: hidden;
          transition: transform 0.18s, border-color 0.18s;
          -webkit-tap-highlight-color: transparent;
        }
        .cls-card::after {
          content: ''; position: absolute;
          inset: 0; border-radius: 16px;
          background: linear-gradient(135deg, rgba(255,255,255,0.03), transparent);
          pointer-events: none;
        }
        .cls-card:active {
          transform: scale(0.95);
          border-color: rgba(0,255,135,0.3);
        }

        .cls-top-row {
          display: flex; align-items: flex-start;
          justify-content: space-between;
        }
        .cls-icon {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
        }
        .cls-index {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700;
          color: var(--muted); letter-spacing: 0.06em;
        }

        .cls-body { flex: 1; }
        .cls-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 20px; font-weight: 800;
          line-height: 1.1; letter-spacing: 0.02em;
        }
        .cls-sub {
          font-size: 11px; font-weight: 400;
          color: var(--muted); margin-top: 2px;
        }

        .cls-footer {
          display: flex; align-items: center;
          justify-content: space-between;
        }
        .cls-cta {
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
        }
        .cls-arrow {
          width: 24px; height: 24px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700;
        }

        /* ── SKELETON ── */
        .skeleton {
          background: linear-gradient(90deg, #0f0f18 25%, #141420 50%, #0f0f18 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite;
          border-radius: 16px; height: 130px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* ── FOOTER ── */
        .footer {
          margin: 4px 20px 0; padding: 20px 0;
          border-top: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .footer-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--neon); }
        .footer-text { font-size: 11px; font-weight: 600; color: var(--muted); letter-spacing: 0.08em; }
        .footer-brand { font-size: 12px; font-weight: 800; color: var(--neon); letter-spacing: 0.06em; }

        /* ── EMPTY ── */
        .empty { text-align: center; padding: 52px 20px; color: var(--muted); }
        .empty-icon { font-size: 48px; margin-bottom: 14px; }
        .empty-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px; font-weight: 800; color: var(--text2);
          margin-bottom: 6px; letter-spacing: 0.5px;
        }
        .empty p { font-size: 14px; }
      `}</style>

      <div className="inner">
        {/* Hero */}
        <div className="hero">
          <div className="hero-eyebrow">
            <div className="eyebrow-dot" />
            <span className="eyebrow-text">Question Bank · Kerala</span>
          </div>
          <div className="hero-title">
            FIND<br />
            <span className="line2">YOUR PAPERS.</span>
          </div>
          <p className="hero-desc">Model question papers organized by class & subject. Free, always.</p>
        </div>

        {/* Sponsor */}
        <div className="sponsor-tag">
          <div className="sponsor-icon">★</div>
          <div className="sponsor-info">
            <div className="sponsor-label">Sponsored by</div>
            <div className="sponsor-name">SFI KOTTAKKAL LC</div>
          </div>
          <div className="sponsor-badge">Official</div>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-num">{classes.length}</div>
              <div className="stat-label">Classes</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">{totalPapers ?? "..."}</div>
              <div className="stat-label">Papers</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">Free</div>
              <div className="stat-label">Always</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">★</div>
              <div className="stat-label">SFI</div>
            </div>
          </div>
        )}

        {/* Visitor */}
        {visitors === null || visitors === undefined ? (
          <div className="visitor-skeleton-wrap">
            <div className="visitor-skeleton" />
          </div>
        ) : (
          <div className="visitor-wrap">
            <div className="visitor-card">
              <div className="visitor-glow" />
              <div className="visitor-icon">👥</div>
              <div className="visitor-data">
                <div className="visitor-num">{formatCount(visitors)}</div>
                <div className="visitor-sub">Total Visitors</div>
              </div>
              <div className="live-chip">
                <div className="live-dot" />
                Live
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search"
            placeholder="Search classes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="section-head">
          <span className="section-title">All Classes</span>
          {!loading && <span className="section-count">{filtered.length} found</span>}
        </div>

        <div className="grid">
          {loading && Array(6).fill(0).map((_, i) => (
            <div key={i} className="skeleton" />
          ))}
          {!loading && filtered.map((cls, i) => {
            const color = classColors[i % classColors.length];
            return (
              <Link key={cls.id} to={`/subjects/${cls.id}`} className="cls-card">
                <div className="cls-top-row">
                  <div className="cls-icon" style={{ background: color + "18" }}>
                    {classEmoji[i % classEmoji.length]}
                  </div>
                  <span className="cls-index">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="cls-body">
                  <div className="cls-name" style={{ color }}>Class {cls.name}</div>
                  <div className="cls-sub">View subjects</div>
                </div>
                <div className="cls-footer">
                  <span className="cls-cta" style={{ color }}>Open</span>
                  <div className="cls-arrow" style={{ background: color + "18", color }}>→</div>
                </div>
              </Link>
            );
          })}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">Nothing Found</div>
            <p>No classes match "{search}"</p>
          </div>
        )}

        <div className="footer">
          <div className="footer-dot" />
          <span className="footer-text">Made with ♥ by</span>
          <span className="footer-brand">SFI KOTTAKKAL LC</span>
          <div className="footer-dot" />
        </div>
      </div>
    </div>
  );
}

export default Classes;
