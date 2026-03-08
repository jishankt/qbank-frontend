import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

const classColors = [
  "#E63946","#FF6B35","#F4A261","#E76F51",
  "#2A9D8F","#457B9D","#1D3557","#A8DADC",
  "#C77DFF","#E63946","#FF9F1C","#2EC4B6"
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
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0D0D0D;
          --surface: #161616;
          --surface2: #1E1E1E;
          --red: #E63946;
          --red2: #FF6B6B;
          --gold: #FFD166;
          --text: #F5F5F5;
          --muted: #888;
          --border: rgba(255,255,255,0.07);
          --shadow: 0 4px 20px rgba(0,0,0,0.4);
        }

        body { background: var(--bg); }

        .app {
          min-height: 100vh; min-height: 100dvh;
          background: var(--bg);
          font-family: 'Outfit', sans-serif;
          color: var(--text);
          padding-bottom: env(safe-area-inset-bottom, 32px);
          overflow-x: hidden;
        }

        /* ── HERO ── */
        .hero {
          position: relative;
          background: var(--surface);
          padding: 52px 20px 28px;
          overflow: hidden;
        }
        /* diagonal red slash */
        .hero::before {
          content: '';
          position: absolute;
          top: -60px; right: -40px;
          width: 220px; height: 220px;
          background: var(--red);
          border-radius: 50%;
          opacity: 0.12;
          pointer-events: none;
        }
        .hero::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--red), var(--gold), transparent);
        }

        .hero-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 12px;
          margin-bottom: 18px;
        }
        .star-badge {
          display: flex; align-items: center; gap: 7px;
          background: var(--red);
          color: #fff;
          font-size: 11px; font-weight: 800;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 5px 14px; border-radius: 4px;
        }
        .star { font-size: 13px; }

        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(48px, 14vw, 72px);
          line-height: 0.95;
          letter-spacing: 1px;
          color: var(--text);
          margin-bottom: 4px;
        }
        .hero-title span { color: var(--red); }

        .hero-sub {
          font-size: 14px; font-weight: 400;
          color: var(--muted); letter-spacing: 0.03em;
        }

        /* ── SPONSOR BAND ── */
        .sponsor-band {
          background: var(--red);
          padding: 9px 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .sponsor-star { font-size: 14px; animation: spin 6s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .sponsor-text {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.85);
        }
        .sponsor-name {
          font-size: 13px; font-weight: 800;
          color: #fff; letter-spacing: 0.05em;
        }
        .sponsor-sep { color: rgba(255,255,255,0.4); font-size: 12px; }

        /* ── STATS ROW ── */
        .stats {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 1px; background: var(--border);
          margin: 0; border-top: none;
        }
        .stat {
          background: var(--surface); padding: 16px 10px;
          text-align: center;
        }
        .stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px; color: var(--red);
          line-height: 1; margin-bottom: 3px;
        }
        .stat-label {
          font-size: 10px; font-weight: 700;
          color: var(--muted); text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        /* ── VISITOR COUNTER ── */
        .visitor-card {
          margin: 16px 16px 0;
          background: var(--surface2);
          border: 1px solid rgba(230,57,70,0.25);
          border-radius: 14px;
          padding: 16px 18px;
          display: flex; align-items: center; gap: 14px;
          position: relative; overflow: hidden;
        }
        .visitor-card::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 4px;
          background: linear-gradient(180deg, var(--red), var(--gold));
        }
        .visitor-icon-wrap {
          width: 48px; height: 48px; border-radius: 12px;
          background: rgba(230,57,70,0.12);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
        }
        .visitor-info { flex: 1; }
        .visitor-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px; color: var(--text);
          line-height: 1; letter-spacing: 1px;
        }
        .visitor-label {
          font-size: 11px; font-weight: 600;
          color: var(--muted); text-transform: uppercase;
          letter-spacing: 0.1em; margin-top: 1px;
        }
        .live-badge {
          display: flex; align-items: center; gap: 5px;
          background: rgba(230,57,70,0.15);
          border: 1px solid rgba(230,57,70,0.3);
          padding: 5px 10px; border-radius: 100px;
          font-size: 11px; font-weight: 700;
          color: var(--red); flex-shrink: 0;
        }
        .live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--red);
          animation: blink 1.2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }

        .visitor-skeleton {
          margin: 16px 16px 0; height: 80px; border-radius: 14px;
          background: linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite;
        }

        /* ── SEARCH ── */
        .search-wrap {
          padding: 16px 16px 8px; position: relative;
        }
        .search-icon {
          position: absolute; left: 30px; top: 50%;
          transform: translateY(-50%); font-size: 14px;
          pointer-events: none; color: var(--muted);
        }
        .search {
          width: 100%; background: var(--surface2);
          border: 1px solid var(--border); border-radius: 10px;
          padding: 12px 16px 12px 38px;
          font-family: 'Outfit', sans-serif;
          font-size: 15px; color: var(--text); outline: none;
          -webkit-appearance: none;
          transition: border-color 0.2s;
        }
        .search::placeholder { color: var(--muted); }
        .search:focus { border-color: rgba(230,57,70,0.5); }

        /* ── SECTION LABEL ── */
        .section-label {
          padding: 14px 16px 10px;
          display: flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 800;
          color: var(--muted); text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .section-line {
          flex: 1; height: 1px; background: var(--border);
        }

        /* ── GRID ── */
        .grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 10px; padding: 0 16px 16px;
        }

        .cls-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 18px 14px 16px;
          text-decoration: none; color: var(--text);
          display: flex; flex-direction: column; gap: 12px;
          position: relative; overflow: hidden;
          transition: transform 0.15s, border-color 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .cls-card::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--red), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .cls-card:active {
          transform: scale(0.96);
          border-color: rgba(230,57,70,0.4);
        }
        .cls-card:active::after { opacity: 1; }

        .cls-num {
          position: absolute; top: 12px; right: 14px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px; color: rgba(255,255,255,0.05);
          line-height: 1;
        }
        .cls-icon-wrap {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
        }
        .cls-name {
          font-size: 15px; font-weight: 700; line-height: 1.2;
        }
        .cls-name span {
          font-size: 11px; font-weight: 500;
          color: var(--muted); display: block;
          margin-top: 2px;
        }
        .cls-arrow {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 700;
          color: var(--red); text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* ── SKELETON ── */
        .skeleton {
          background: linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite;
          border-radius: 14px; height: 120px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* ── FOOTER ── */
        .footer {
          margin: 8px 16px 0;
          padding: 16px;
          border-top: 1px solid var(--border);
          text-align: center;
          font-size: 11px; color: var(--muted);
          font-weight: 500; letter-spacing: 0.04em;
        }
        .footer strong { color: var(--red); }

        /* ── EMPTY ── */
        .empty { text-align: center; padding: 48px 20px; color: var(--muted); }
        .empty-icon { font-size: 44px; margin-bottom: 12px; }
        .empty p { font-size: 15px; font-weight: 500; }
      `}</style>

      {/* Hero */}
      <div className="hero">
        <div className="hero-top">
          <div className="star-badge">
            <span className="star">★</span> Question Bank
          </div>
        </div>
        <div className="hero-title">
          Find Your<br /><span>Papers.</span>
        </div>
        <div className="hero-sub">Model questions, organized for you</div>
      </div>

      {/* Sponsor band */}
      <div className="sponsor-band">
        <span className="sponsor-star">★</span>
        <span className="sponsor-text">Sponsored by</span>
        <span className="sponsor-sep">|</span>
        <span className="sponsor-name">SFI KOTTAKKAL LC</span>
      </div>

      {!loading && classes.length > 0 && (
        <div className="stats">
          <div className="stat">
            <div className="stat-num">{classes.length}</div>
            <div className="stat-label">Classes</div>
          </div>
          <div className="stat">
            <div className="stat-num">{totalPapers ?? "..."}</div>
            <div className="stat-label">Papers</div>
          </div>
          <div className="stat">
            <div className="stat-num">Free</div>
            <div className="stat-label">Always</div>
          </div>
          <div className="stat">
            <div className="stat-num">★</div>
            <div className="stat-label">SFI</div>
          </div>
        </div>
      )}

      {/* Visitor Counter */}
      {visitors === null || visitors === undefined ? (
        <div className="visitor-skeleton" />
      ) : (
        <div className="visitor-card">
          <div className="visitor-icon-wrap">👥</div>
          <div className="visitor-info">
            <div className="visitor-num">{formatCount(visitors)}</div>
            <div className="visitor-label">Total Visitors</div>
          </div>
          <div className="live-badge">
            <div className="live-dot" />
            Live
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

      {/* Section label */}
      <div className="section-label">
        All Classes
        <div className="section-line" />
      </div>

      {/* Grid */}
      <div className="grid">
        {loading && Array(6).fill(0).map((_, i) => (
          <div key={i} className="skeleton" />
        ))}
        {!loading && filtered.map((cls, i) => {
          const color = classColors[i % classColors.length];
          return (
            <Link key={cls.id} to={`/subjects/${cls.id}`} className="cls-card">
              <div className="cls-num">{String(i + 1).padStart(2, "0")}</div>
              <div className="cls-icon-wrap" style={{ background: color + "22" }}>
                {classEmoji[i % classEmoji.length]}
              </div>
              <div className="cls-name">
                Class {cls.name}
                <span>View subjects</span>
              </div>
              <div className="cls-arrow">Open →</div>
            </Link>
          );
        })}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="empty">
          <div className="empty-icon">🔍</div>
          <p>No classes match "{search}"</p>
        </div>
      )}

      {/* Footer */}
      <div className="footer">
        Made with ❤️ by <strong>SFI KOTTAKKAL LC</strong>
      </div>
    </div>
  );
}

export default Classes;
