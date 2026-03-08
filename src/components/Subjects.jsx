import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

const subjectMeta = {
  math:        { icon: "📐", color: "#00FF87" },
  maths:       { icon: "📐", color: "#00FF87" },
  mathematics: { icon: "📐", color: "#00FF87" },
  physics:     { icon: "⚡", color: "#00D4FF" },
  chemistry:   { icon: "⚗️", color: "#FF6B6B" },
  biology:     { icon: "🌿", color: "#00FF87" },
  english:     { icon: "✏️", color: "#FFD166" },
  malayalam:   { icon: "🌴", color: "#00D4FF" },
  hindi:       { icon: "🪔", color: "#FF6B6B" },
  history:     { icon: "🏛️", color: "#C77DFF" },
  geography:   { icon: "🌍", color: "#00D4FF" },
  science:     { icon: "🔬", color: "#00FF87" },
  computer:    { icon: "💻", color: "#C77DFF" },
  economics:   { icon: "📊", color: "#FFD166" },
  commerce:    { icon: "💼", color: "#FF9F43" },
};
function getMeta(name = "") {
  const key = name.toLowerCase().split(" ")[0];
  return subjectMeta[key] || { icon: "📖", color: "#888" };
}

function Subjects() {
  const { classId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get(`subjects/${classId}/`)
      .then(res => setSubjects(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, [classId]);

  const filtered = subjects.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #050508; --card: #0F0F18; --card2: #141420;
          --neon: #00FF87; --neon2: #00D4FF;
          --text: #FFFFFF; --text2: #B0B0C8; --muted: #505068;
          --border: rgba(255,255,255,0.06); --border2: rgba(0,255,135,0.2);
        }
        body { background: var(--bg); }
        .app {
          min-height: 100vh; min-height: 100dvh; background: var(--bg);
          font-family: 'Barlow', sans-serif; color: var(--text);
          padding-bottom: env(safe-area-inset-bottom, 40px);
          position: relative; overflow-x: hidden;
        }
        .app::before {
          content: ''; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(ellipse 80% 40% at 50% -10%, rgba(0,255,135,0.06) 0%, transparent 60%);
          pointer-events: none; z-index: 0;
        }
        .inner { position: relative; z-index: 1; }

        /* Topbar */
        .topbar { padding: 52px 20px 24px; }
        .topbar-row { display: flex; align-items: center; gap: 14px; }
        .back-btn {
          width: 42px; height: 42px; border-radius: 12px;
          background: var(--card); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; color: var(--neon);
          text-decoration: none; flex-shrink: 0;
          -webkit-tap-highlight-color: transparent; transition: opacity 0.15s;
        }
        .back-btn:active { opacity: 0.6; }
        .topbar-text { flex: 1; }
        .topbar-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 36px; font-weight: 900;
          line-height: 1; letter-spacing: 0.5px;
        }
        .topbar-sub { font-size: 12px; color: var(--muted); margin-top: 4px; font-weight: 400; }

        /* Divider */
        .divider {
          height: 1px; margin: 0 20px;
          background: linear-gradient(90deg, var(--neon), transparent);
          opacity: 0.3;
        }

        /* Search */
        .search-wrap { padding: 16px 20px 4px; position: relative; }
        .search-icon { position: absolute; left: 34px; top: 50%; transform: translateY(-50%); font-size: 14px; color: var(--muted); pointer-events: none; }
        .search {
          width: 100%; background: var(--card); border: 1px solid var(--border);
          border-radius: 12px; padding: 13px 16px 13px 40px;
          font-family: 'Barlow', sans-serif; font-size: 15px;
          color: var(--text); outline: none; -webkit-appearance: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search::placeholder { color: var(--muted); }
        .search:focus { border-color: rgba(0,255,135,0.4); box-shadow: 0 0 0 3px rgba(0,255,135,0.06); }

        .section-head {
          padding: 14px 20px 10px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .section-title { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.14em; }
        .section-count { font-size: 11px; font-weight: 700; color: var(--neon); }

        /* Subject list */
        .list { padding: 0 20px 20px; display: flex; flex-direction: column; gap: 8px; }

        .subject-card {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 14px; padding: 16px;
          text-decoration: none; color: var(--text);
          display: flex; align-items: center; gap: 14px;
          position: relative; overflow: hidden;
          transition: transform 0.15s, border-color 0.18s;
          -webkit-tap-highlight-color: transparent;
        }
        .subject-card:active { transform: scale(0.98); }

        .subject-num {
          position: absolute; right: 16px; top: 50%;
          transform: translateY(-50%);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 32px; font-weight: 900;
          color: rgba(255,255,255,0.04); pointer-events: none;
        }

        .subject-icon {
          width: 48px; height: 48px; border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; flex-shrink: 0;
          position: relative;
        }
        .subject-icon::after {
          content: ''; position: absolute; inset: 0;
          border-radius: 13px; border: 1px solid rgba(255,255,255,0.08);
        }
        .subject-info { flex: 1; min-width: 0; }
        .subject-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 20px; font-weight: 800; line-height: 1.1;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .subject-hint { font-size: 12px; color: var(--muted); margin-top: 2px; font-weight: 400; }
        .subject-arrow {
          width: 30px; height: 30px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700; flex-shrink: 0;
        }

        /* Skeleton */
        .skeleton {
          background: linear-gradient(90deg, #0f0f18 25%, #141420 50%, #0f0f18 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite;
          border-radius: 14px; height: 80px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .footer {
          margin: 4px 20px 0; padding: 20px 0;
          border-top: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .footer-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--neon); }
        .footer-text { font-size: 11px; font-weight: 600; color: var(--muted); letter-spacing: 0.08em; }
        .footer-brand { font-size: 12px; font-weight: 800; color: var(--neon); letter-spacing: 0.06em; }

        .empty { text-align: center; padding: 52px 20px; color: var(--muted); }
        .empty-icon { font-size: 48px; margin-bottom: 14px; }
        .empty-title { font-family: 'Barlow Condensed', sans-serif; font-size: 22px; font-weight: 800; color: var(--text2); margin-bottom: 6px; }
        .empty p { font-size: 14px; }
      `}</style>

      <div className="inner">
        <div className="topbar">
          <div className="topbar-row">
            <Link to="/" className="back-btn">‹</Link>
            <div className="topbar-text">
              <div className="topbar-title">SUBJECTS</div>
              <div className="topbar-sub">
                {loading ? "Loading..." : `${subjects.length} subject${subjects.length !== 1 ? "s" : ""} available`}
              </div>
            </div>
          </div>
        </div>

        <div className="divider" />

        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input className="search" placeholder="Search subjects..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="section-head">
          <span className="section-title">Available Subjects</span>
          {!loading && <span className="section-count">{filtered.length} found</span>}
        </div>

        <div className="list">
          {loading && Array(4).fill(0).map((_, i) => <div key={i} className="skeleton" />)}
          {!loading && filtered.map((sub, i) => {
            const { icon, color } = getMeta(sub.name);
            return (
              <Link key={sub.id} to={`/papers/${sub.id}`} className="subject-card">
                <span className="subject-num">{String(i + 1).padStart(2, "0")}</span>
                <div className="subject-icon" style={{ background: color + "18" }}>{icon}</div>
                <div className="subject-info">
                  <div className="subject-name" style={{ color }}>{sub.name}</div>
                  <div className="subject-hint">View question papers</div>
                </div>
                <div className="subject-arrow" style={{ background: color + "18", color }}>›</div>
              </Link>
            );
          })}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">Nothing Found</div>
            <p>No subjects match "{search}"</p>
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

export default Subjects;
