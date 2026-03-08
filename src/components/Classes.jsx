import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

const classColors = [
  { bg: "#FFF0F0", accent: "#E63946", label: "#C1121F" },
  { bg: "#F0F7FF", accent: "#2D6BE4", label: "#1A4FB5" },
  { bg: "#F0FFF6", accent: "#2A9D5C", label: "#1E7A44" },
  { bg: "#FFF8F0", accent: "#E87C2A", label: "#C4611A" },
  { bg: "#F5F0FF", accent: "#7C3AED", label: "#5B21B6" },
  { bg: "#F0FDFF", accent: "#0891B2", label: "#0E6A87" },
  { bg: "#FFFBF0", accent: "#D97706", label: "#B45309" },
  { bg: "#FFF0FA", accent: "#DB2777", label: "#9D174D" },
  { bg: "#F0FFF4", accent: "#059669", label: "#047857" },
  { bg: "#F0F4FF", accent: "#4F46E5", label: "#3730A3" },
  { bg: "#FFF5F0", accent: "#EA580C", label: "#C2410C" },
  { bg: "#F0FFFE", accent: "#0D9488", label: "#0F766E" },
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
    <div className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #F7F7F8;
          --white: #FFFFFF;
          --ink: #111118;
          --ink2: #3D3D4A;
          --muted: #9898A8;
          --border: #E8E8EE;
          --red: #E63946;
          --shadow-sm: 0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04);
          --shadow: 0 4px 16px rgba(0,0,0,0.08);
        }

        html, body { background: var(--bg); }

        .root {
          min-height: 100vh; min-height: 100dvh;
          background: var(--bg);
          font-family: 'Inter', -apple-system, sans-serif;
          color: var(--ink);
          padding-bottom: max(env(safe-area-inset-bottom), 32px);
          -webkit-font-smoothing: antialiased;
        }

        /* ── TOP HEADER ── */
        .header {
          background: var(--white);
          padding: max(env(safe-area-inset-top), 16px) 20px 0;
          border-bottom: 1px solid var(--border);
        }
        .header-inner {
          padding-bottom: 20px;
        }
        .header-tag {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--red);
          margin-bottom: 10px;
        }
        .header-tag-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--red);
        }
        .header-title {
          font-size: 30px; font-weight: 900;
          letter-spacing: -0.8px; line-height: 1.05;
          color: var(--ink); margin-bottom: 4px;
        }
        .header-sub {
          font-size: 14px; font-weight: 400; color: var(--muted);
        }

        /* ── SPONSOR STRIP ── */
        .sponsor-strip {
          display: flex; align-items: center; gap: 0;
          background: var(--red); margin-top: 16px;
          border-radius: 10px 10px 0 0;
          padding: 8px 14px; gap: 8px;
        }
        .sponsor-star {
          font-size: 13px; color: rgba(255,255,255,0.8);
        }
        .sponsor-by {
          font-size: 10px; font-weight: 600;
          color: rgba(255,255,255,0.7);
          text-transform: uppercase; letter-spacing: 0.1em;
        }
        .sponsor-name {
          font-size: 12px; font-weight: 800;
          color: #fff; letter-spacing: 0.04em;
        }
        .sponsor-sep { color: rgba(255,255,255,0.3); font-size: 10px; }

        /* ── STATS ── */
        .stats {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 0; background: var(--white);
          border-bottom: 1px solid var(--border);
        }
        .stat {
          padding: 14px 8px; text-align: center;
          border-right: 1px solid var(--border);
          position: relative;
        }
        .stat:last-child { border-right: none; }
        .stat-val {
          font-size: 18px; font-weight: 800;
          color: var(--ink); line-height: 1; margin-bottom: 3px;
        }
        .stat-key {
          font-size: 10px; font-weight: 600;
          color: var(--muted); text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* ── VISITOR CARD ── */
        .visitor-section { padding: 16px 16px 0; }
        .visitor-card {
          background: var(--ink);
          border-radius: 16px;
          padding: 18px 20px;
          display: flex; align-items: center; gap: 16px;
          position: relative; overflow: hidden;
        }
        .visitor-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, rgba(230,57,70,0.15) 0%, transparent 60%);
          pointer-events: none;
        }
        .visitor-emoji-wrap {
          width: 52px; height: 52px; border-radius: 14px;
          background: rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; flex-shrink: 0;
        }
        .visitor-text { flex: 1; }
        .visitor-val {
          font-size: 32px; font-weight: 900;
          color: #fff; line-height: 1;
          letter-spacing: -1px;
        }
        .visitor-label {
          font-size: 12px; font-weight: 500;
          color: rgba(255,255,255,0.5); margin-top: 3px;
          text-transform: uppercase; letter-spacing: 0.08em;
        }
        .live-pill {
          display: flex; align-items: center; gap: 5px;
          background: rgba(255,255,255,0.12);
          padding: 6px 12px; border-radius: 100px;
          font-size: 11px; font-weight: 700;
          color: rgba(255,255,255,0.9);
          flex-shrink: 0;
        }
        .live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #4ADE80;
          box-shadow: 0 0 6px #4ADE80;
          animation: blink 1.4s ease-in-out infinite;
        }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

        .visitor-skel {
          height: 88px; border-radius: 16px;
          background: linear-gradient(90deg, #ececf0 25%, #f5f5f8 50%, #ececf0 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite;
        }

        /* ── SEARCH ── */
        .search-section { padding: 14px 16px 0; }
        .search-box {
          display: flex; align-items: center; gap: 10px;
          background: var(--white); border: 1.5px solid var(--border);
          border-radius: 12px; padding: 0 14px;
          box-shadow: var(--shadow-sm);
          transition: border-color 0.2s;
        }
        .search-box:focus-within {
          border-color: var(--red);
          box-shadow: 0 0 0 3px rgba(230,57,70,0.08);
        }
        .search-ico { font-size: 16px; flex-shrink: 0; opacity: 0.4; }
        .search-input {
          flex: 1; border: none; outline: none;
          padding: 13px 0;
          font-family: 'Inter', sans-serif;
          font-size: 15px; font-weight: 400;
          color: var(--ink); background: transparent;
        }
        .search-input::placeholder { color: var(--muted); }
        .search-clear {
          font-size: 16px; cursor: pointer; opacity: 0.5;
          flex-shrink: 0; padding: 4px;
          border: none; background: none;
          -webkit-tap-highlight-color: transparent;
        }

        /* ── SECTION LABEL ── */
        .section-label {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 16px 16px 10px;
        }
        .label-text {
          font-size: 13px; font-weight: 700;
          color: var(--ink2); text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .label-count {
          font-size: 12px; font-weight: 600;
          background: #F0F0F5;
          color: var(--muted);
          padding: 3px 10px; border-radius: 100px;
        }

        /* ── CLASS GRID ── */
        .grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 10px; padding: 0 16px 16px;
        }

        .cls-card {
          border-radius: 16px;
          padding: 16px;
          text-decoration: none;
          display: flex; flex-direction: column; gap: 14px;
          position: relative; overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: transform 0.15s, box-shadow 0.15s;
          -webkit-tap-highlight-color: transparent;
          border: 1px solid rgba(0,0,0,0.04);
        }
        .cls-card:active {
          transform: scale(0.96);
          box-shadow: none;
        }

        .cls-header {
          display: flex; align-items: flex-start;
          justify-content: space-between;
        }
        .cls-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: rgba(255,255,255,0.7);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .cls-number {
          font-size: 11px; font-weight: 800;
          letter-spacing: 0.08em;
          opacity: 0.4;
        }

        .cls-info {}
        .cls-name {
          font-size: 16px; font-weight: 800;
          line-height: 1.1; letter-spacing: -0.2px;
        }
        .cls-hint {
          font-size: 11px; font-weight: 500;
          margin-top: 3px; opacity: 0.55;
        }

        .cls-cta {
          display: flex; align-items: center;
          justify-content: space-between;
        }
        .cls-cta-text {
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          opacity: 0.7;
        }
        .cls-cta-arrow {
          width: 26px; height: 26px; border-radius: 7px;
          background: rgba(255,255,255,0.5);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
        }

        /* ── SKELETON ── */
        .skel {
          background: linear-gradient(90deg, #ececf0 25%, #f5f5f8 50%, #ececf0 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite;
          border-radius: 16px; height: 130px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* ── EMPTY ── */
        .empty { text-align: center; padding: 60px 20px; color: var(--muted); }
        .empty-icon { font-size: 52px; margin-bottom: 14px; display: block; }
        .empty-title { font-size: 18px; font-weight: 700; color: var(--ink2); margin-bottom: 6px; }
        .empty-sub { font-size: 14px; }

        /* ── FOOTER ── */
        .footer {
          margin: 8px 16px 0; padding: 20px 16px;
          background: var(--white); border-radius: 14px;
          border: 1px solid var(--border);
          display: flex; flex-direction: column;
          align-items: center; gap: 6px;
        }
        .footer-logo {
          font-size: 20px; margin-bottom: 2px;
        }
        .footer-name {
          font-size: 13px; font-weight: 800;
          color: var(--red); letter-spacing: 0.04em;
        }
        .footer-sub {
          font-size: 11px; font-weight: 400;
          color: var(--muted);
        }
      `}</style>

      {/* Header */}
      <div className="header">
        <div className="header-inner">
          <div className="header-tag">
            <span className="header-tag-dot" />
            Question Bank
          </div>
          <div className="header-title">Find Your<br />Papers</div>
          <div className="header-sub">Model papers · Free · Always</div>
          <div className="sponsor-strip">
            <span className="sponsor-star">★</span>
            <span className="sponsor-by">Sponsored by</span>
            <span className="sponsor-sep">·</span>
            <span className="sponsor-name">SFI KOTTAKKAL LC</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats">
        <div className="stat">
          <div className="stat-val">{loading ? "—" : classes.length}</div>
          <div className="stat-key">Classes</div>
        </div>
        <div className="stat">
          <div className="stat-val">{totalPapers ?? "—"}</div>
          <div className="stat-key">Papers</div>
        </div>
        <div className="stat">
          <div className="stat-val">{visitors !== null ? formatCount(visitors) : "—"}</div>
          <div className="stat-key">Visitors</div>
        </div>
        <div className="stat">
          <div className="stat-val" style={{ color: "var(--red)" }}>Free</div>
          <div className="stat-key">Always</div>
        </div>
      </div>

      {/* Visitor Card */}
      <div className="visitor-section">
        {visitors === null ? (
          <div className="visitor-skel" />
        ) : (
          <div className="visitor-card">
            <div className="visitor-emoji-wrap">👥</div>
            <div className="visitor-text">
              <div className="visitor-val">{formatCount(visitors)}</div>
              <div className="visitor-label">Total Visitors</div>
            </div>
            <div className="live-pill">
              <div className="live-dot" />
              Live
            </div>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="search-section">
        <div className="search-box">
          <span className="search-ico">🔍</span>
          <input
            className="search-input"
            placeholder="Search classes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
      </div>

      {/* Section Label */}
      <div className="section-label">
        <span className="label-text">All Classes</span>
        {!loading && <span className="label-count">{filtered.length}</span>}
      </div>

      {/* Grid */}
      <div className="grid">
        {loading && Array(6).fill(0).map((_, i) => (
          <div key={i} className="skel" />
        ))}
        {!loading && filtered.map((cls, i) => {
          const c = classColors[i % classColors.length];
          return (
            <Link
              key={cls.id}
              to={`/subjects/${cls.id}`}
              className="cls-card"
              style={{ background: c.bg }}
            >
              <div className="cls-header">
                <div className="cls-icon">{classEmoji[i % classEmoji.length]}</div>
                <span className="cls-number" style={{ color: c.label }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="cls-info">
                <div className="cls-name" style={{ color: c.label }}>Class {cls.name}</div>
                <div className="cls-hint" style={{ color: c.label }}>View subjects</div>
              </div>
              <div className="cls-cta">
                <span className="cls-cta-text" style={{ color: c.label }}>Open</span>
                <div className="cls-cta-arrow" style={{ color: c.accent }}>→</div>
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

      {/* Footer */}
      <div className="footer">
        <div className="footer-logo">⭐</div>
        <div className="footer-name">SFI KOTTAKKAL LC</div>
        <div className="footer-sub">Made with love for students</div>
      </div>
    </div>
  );
}

export default Classes;
