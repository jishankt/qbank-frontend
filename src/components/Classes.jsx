import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

const classColors = [
  "#FF6B6B","#FF9F43","#FECA57","#48DBFB",
  "#FF9FF3","#54A0FF","#5F27CD","#00D2D3",
  "#1DD1A1","#C8D6E5","#EE5A24","#0652DD"
];
const classEmoji = ["🎯","📐","🔬","🌍","📜","💡","🧬","🏛️","⚗️","🎨","🎭","🌿"];

function Classes() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("classes/")
      .then(res => setClasses(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = classes.filter(cls =>
    cls.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #F2F2F7;
          --surface: #FFFFFF;
          --surface2: #F2F2F7;
          --ink: #1C1C1E;
          --ink2: #3A3A3C;
          --muted: #8E8E93;
          --border: rgba(0,0,0,0.06);
          --blue: #007AFF;
          --shadow: 0 2px 12px rgba(0,0,0,0.06);
          --shadow-lg: 0 8px 32px rgba(0,0,0,0.1);
        }

        body { background: var(--bg); }

        .app {
          min-height: 100vh;
          min-height: 100dvh;
          background: var(--bg);
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: var(--ink);
          padding-bottom: env(safe-area-inset-bottom, 24px);
        }

        /* Hero header */
        .hero {
          background: var(--surface);
          padding: 60px 20px 28px;
          border-bottom: 1px solid var(--border);
        }
        .hero-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(0,122,255,0.1);
          color: var(--blue);
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          padding: 4px 12px; border-radius: 100px;
          margin-bottom: 14px;
        }
        .hero h1 {
          font-size: 34px; font-weight: 800;
          letter-spacing: -0.8px; line-height: 1.1;
          color: var(--ink); margin-bottom: 6px;
        }
        .hero p {
          font-size: 15px; color: var(--muted); font-weight: 400;
        }

        /* Stats row */
        .stats {
          display: flex; gap: 0;
          margin: 0 20px;
          background: var(--surface);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow);
          margin-top: 16px;
        }
        .stat {
          flex: 1; padding: 14px 12px; text-align: center;
          border-right: 1px solid var(--border);
        }
        .stat:last-child { border-right: none; }
        .stat-num {
          font-size: 20px; font-weight: 800;
          color: var(--blue); line-height: 1;
          margin-bottom: 3px;
        }
        .stat-label {
          font-size: 11px; font-weight: 600;
          color: var(--muted); text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* Search */
        .search-wrap {
          padding: 16px 20px 8px;
          position: relative;
        }
        .search-icon {
          position: absolute; left: 34px; top: 50%;
          transform: translateY(-50%);
          font-size: 15px; pointer-events: none;
          color: var(--muted);
        }
        .search {
          width: 100%;
          background: var(--surface);
          border: none; border-radius: 12px;
          padding: 12px 16px 12px 40px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; color: var(--ink);
          outline: none; box-shadow: var(--shadow);
          -webkit-appearance: none;
        }
        .search::placeholder { color: var(--muted); }
        .search:focus { box-shadow: 0 0 0 3px rgba(0,122,255,0.15), var(--shadow); }

        /* Section */
        .section-label {
          padding: 16px 20px 10px;
          font-size: 13px; font-weight: 700;
          color: var(--muted); text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        /* Grid */
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          padding: 0 20px 20px;
        }

        .cls-card {
          background: var(--surface);
          border-radius: 20px;
          padding: 18px 16px 16px;
          text-decoration: none; color: var(--ink);
          display: flex; flex-direction: column; gap: 10px;
          box-shadow: var(--shadow);
          transition: transform 0.15s, box-shadow 0.15s;
          -webkit-tap-highlight-color: transparent;
          position: relative; overflow: hidden;
        }
        .cls-card:active { transform: scale(0.96); box-shadow: var(--shadow); }

        .cls-icon-wrap {
          width: 46px; height: 46px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
        }
        .cls-name {
          font-size: 15px; font-weight: 700; color: var(--ink);
          line-height: 1.2;
        }
        .cls-sub {
          font-size: 12px; color: var(--muted); font-weight: 500;
          margin-top: -4px;
        }
        .cls-arrow {
          position: absolute; right: 14px; top: 14px;
          font-size: 12px; color: var(--muted);
        }

        /* Skeleton */
        .skeleton {
          background: linear-gradient(90deg, #E5E5EA 25%, #F2F2F7 50%, #E5E5EA 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 20px; height: 110px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .empty {
          text-align: center; padding: 48px 20px; color: var(--muted);
        }
        .empty-icon { font-size: 44px; margin-bottom: 12px; }
        .empty p { font-size: 15px; font-weight: 500; }
      `}</style>

      {/* Hero */}
      <div className="hero">
        <div className="hero-tag">📚 Question Bank</div>
        <h1>Find Your<br />Papers</h1>
        <p>Model papers by class & subject</p>
      </div>

      {/* Stats */}
      {!loading && classes.length > 0 && (
        <div className="stats">
          <div className="stat">
            <div className="stat-num">{classes.length}</div>
            <div className="stat-label">Classes</div>
          </div>
          <div className="stat">
            <div className="stat-num">∞</div>
            <div className="stat-label">Papers</div>
          </div>
          <div className="stat">
            <div className="stat-num">Free</div>
            <div className="stat-label">Always</div>
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

      <div className="section-label">All Classes</div>

      <div className="grid">
        {loading && Array(6).fill(0).map((_, i) => (
          <div key={i} className="skeleton" />
        ))}
        {!loading && filtered.map((cls, i) => {
          const color = classColors[i % classColors.length];
          return (
            <Link key={cls.id} to={`/subjects/${cls.id}`} className="cls-card">
              <span className="cls-arrow">›</span>
              <div className="cls-icon-wrap" style={{ background: color + "22" }}>
                <span style={{ fontSize: 22 }}>{classEmoji[i % classEmoji.length]}</span>
              </div>
              <div>
                <div className="cls-name">Class {cls.name}</div>
                <div className="cls-sub">View subjects</div>
              </div>
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
    </div>
  );
}

export default Classes;
