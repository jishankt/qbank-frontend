import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

const classIcons = ["🎯","🔬","📐","🌍","🎨","📜","💡","🧬","🏛️","⚗️","🎭","🌿"];

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
    <div className="qb-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #080b14;
          --surface: #0e1420;
          --card: #131929;
          --border: rgba(255,255,255,0.06);
          --border-hover: rgba(139,92,246,0.5);
          --accent: #7c3aed;
          --accent2: #06b6d4;
          --accent3: #f59e0b;
          --text: #f0f4ff;
          --muted: #6b7a99;
          --glow: rgba(124,58,237,0.3);
        }

        .qb-root {
          min-height: 100vh;
          background: var(--bg);
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          padding: 0 16px 60px;
          position: relative;
          overflow-x: hidden;
        }

        /* Ambient background orbs */
        .qb-root::before {
          content: '';
          position: fixed;
          top: -200px; left: -200px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .qb-root::after {
          content: '';
          position: fixed;
          bottom: -200px; right: -200px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .qb-inner { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }

        /* Hero */
        .qb-hero {
          padding: 52px 0 36px;
          text-align: center;
        }
        .qb-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(124,58,237,0.15);
          border: 1px solid rgba(124,58,237,0.3);
          border-radius: 100px;
          padding: 5px 14px;
          font-size: 12px;
          font-weight: 500;
          color: #a78bfa;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .qb-hero h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 8vw, 52px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -1px;
          background: linear-gradient(135deg, #f0f4ff 0%, #a78bfa 50%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
        }
        .qb-hero p {
          color: var(--muted);
          font-size: 15px;
          font-weight: 300;
        }

        /* Search */
        .qb-search-wrap {
          position: relative;
          margin-bottom: 32px;
        }
        .qb-search-icon {
          position: absolute;
          left: 16px; top: 50%;
          transform: translateY(-50%);
          color: var(--muted);
          font-size: 16px;
          pointer-events: none;
        }
        .qb-search {
          width: 100%;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 14px 16px 14px 44px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .qb-search::placeholder { color: var(--muted); }
        .qb-search:focus {
          border-color: rgba(124,58,237,0.5);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
        }

        /* Section label */
        .qb-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 14px;
        }

        /* Grid */
        .qb-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 420px) {
          .qb-grid { grid-template-columns: repeat(3, 1fr); }
        }

        /* Class card */
        .qb-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px 14px;
          text-decoration: none;
          color: var(--text);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .qb-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(124,58,237,0.0), rgba(124,58,237,0.08));
          opacity: 0;
          transition: opacity 0.25s;
        }
        .qb-card:hover {
          border-color: var(--border-hover);
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(124,58,237,0.2);
        }
        .qb-card:hover::before { opacity: 1; }
        .qb-card:active { transform: scale(0.97); }

        .qb-card-icon {
          font-size: 28px;
          line-height: 1;
          filter: drop-shadow(0 2px 8px rgba(124,58,237,0.4));
        }
        .qb-card-label {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          text-align: center;
          letter-spacing: 0.02em;
        }
        .qb-card-sub {
          font-size: 11px;
          color: var(--muted);
        }

        /* Empty */
        .qb-empty {
          text-align: center;
          padding: 48px 0;
          color: var(--muted);
        }
        .qb-empty-icon { font-size: 40px; margin-bottom: 12px; }

        /* Skeleton */
        .qb-skeleton {
          background: linear-gradient(90deg, var(--card) 25%, #1a2235 50%, var(--card) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 16px;
          height: 96px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Stats bar */
        .qb-stats {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .qb-stat {
          text-align: center;
        }
        .qb-stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          background: linear-gradient(135deg, #a78bfa, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .qb-stat-label {
          font-size: 11px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .qb-divider {
          width: 1px; height: 32px;
          background: var(--border);
          align-self: center;
        }
      `}</style>

      <div className="qb-inner">
        {/* Hero */}
        <div className="qb-hero">
          <div className="qb-badge">📚 Question Bank</div>
          <h1>Find Your Papers</h1>
          <p>Past papers, organized by class & subject</p>
        </div>

        {/* Stats */}
        {!loading && classes.length > 0 && (
          <div className="qb-stats">
            <div className="qb-stat">
              <div className="qb-stat-num">{classes.length}</div>
              <div className="qb-stat-label">Classes</div>
            </div>
            <div className="qb-divider" />
            <div className="qb-stat">
              <div className="qb-stat-num">∞</div>
              <div className="qb-stat-label">Papers</div>
            </div>
            <div className="qb-divider" />
            <div className="qb-stat">
              <div className="qb-stat-num">Free</div>
              <div className="qb-stat-label">Always</div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="qb-search-wrap">
          <span className="qb-search-icon">🔍</span>
          <input
            className="qb-search"
            placeholder="Search classes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="qb-label">All Classes</div>

        {/* Grid */}
        <div className="qb-grid">
          {loading && Array(6).fill(0).map((_, i) => (
            <div key={i} className="qb-skeleton" />
          ))}

          {!loading && filtered.map((cls, i) => (
            <Link key={cls.id} to={`/subjects/${cls.id}`} className="qb-card">
              <div className="qb-card-icon">{classIcons[i % classIcons.length]}</div>
              <div className="qb-card-label">Class {cls.name}</div>
              <div className="qb-card-sub">View subjects →</div>
            </Link>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="qb-empty">
            <div className="qb-empty-icon">🔍</div>
            <p>No classes match "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Classes;
