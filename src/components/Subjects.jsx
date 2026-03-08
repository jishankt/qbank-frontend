import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

const subjectMeta = {
  math:       { icon: "📐", color: "#FF6B6B" },
  maths:      { icon: "📐", color: "#FF6B6B" },
  mathematics:{ icon: "📐", color: "#FF6B6B" },
  physics:    { icon: "⚡", color: "#54A0FF" },
  chemistry:  { icon: "⚗️", color: "#5F27CD" },
  biology:    { icon: "🌿", color: "#1DD1A1" },
  english:    { icon: "✏️", color: "#FF9F43" },
  malayalam:  { icon: "🌴", color: "#1DD1A1" },
  hindi:      { icon: "🪔", color: "#FF6B6B" },
  history:    { icon: "🏛️", color: "#C8D6E5" },
  geography:  { icon: "🌍", color: "#48DBFB" },
  science:    { icon: "🔬", color: "#54A0FF" },
  computer:   { icon: "💻", color: "#5F27CD" },
  economics:  { icon: "📊", color: "#FECA57" },
  commerce:   { icon: "💼", color: "#FF9F43" },
};
function getMeta(name = "") {
  const key = name.toLowerCase().split(" ")[0];
  return subjectMeta[key] || { icon: "📖", color: "#8E8E93" };
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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #F2F2F7; --surface: #FFFFFF; --ink: #1C1C1E;
          --ink2: #3A3A3C; --muted: #8E8E93; --border: rgba(0,0,0,0.06);
          --blue: #007AFF; --shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        body { background: var(--bg); }
        .app {
          min-height: 100vh; min-height: 100dvh; background: var(--bg);
          font-family: 'Plus Jakarta Sans', sans-serif; color: var(--ink);
          padding-bottom: env(safe-area-inset-bottom, 24px);
        }

        /* Topbar */
        .topbar {
          background: var(--surface);
          padding: 52px 20px 18px;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; gap: 14px;
        }
        .back-btn {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--bg); border: none;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; color: var(--blue);
          text-decoration: none; flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
          transition: opacity 0.15s;
        }
        .back-btn:active { opacity: 0.6; }
        .topbar-text { flex: 1; }
        .topbar-text h1 {
          font-size: 26px; font-weight: 800;
          letter-spacing: -0.5px; line-height: 1.1;
        }
        .topbar-text p { font-size: 13px; color: var(--muted); margin-top: 2px; }

        /* Search */
        .search-wrap { padding: 14px 20px 4px; position: relative; }
        .search-icon { position: absolute; left: 34px; top: 50%; transform: translateY(-50%); font-size: 14px; color: var(--muted); pointer-events: none; }
        .search {
          width: 100%; background: var(--surface); border: none;
          border-radius: 12px; padding: 11px 16px 11px 38px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; color: var(--ink); outline: none;
          box-shadow: var(--shadow); -webkit-appearance: none;
        }
        .search::placeholder { color: var(--muted); }
        .search:focus { box-shadow: 0 0 0 3px rgba(0,122,255,0.15), var(--shadow); }

        .section-label {
          padding: 14px 20px 8px;
          font-size: 13px; font-weight: 700;
          color: var(--muted); text-transform: uppercase; letter-spacing: 0.07em;
        }

        /* Subject list */
        .list { padding: 0 20px 20px; display: flex; flex-direction: column; gap: 10px; }

        .subject-card {
          background: var(--surface); border-radius: 16px;
          padding: 14px 16px; text-decoration: none; color: var(--ink);
          display: flex; align-items: center; gap: 14px;
          box-shadow: var(--shadow); transition: transform 0.15s;
          -webkit-tap-highlight-color: transparent;
          position: relative;
        }
        .subject-card:active { transform: scale(0.98); }

        .subject-icon {
          width: 48px; height: 48px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; flex-shrink: 0;
        }
        .subject-info { flex: 1; min-width: 0; }
        .subject-name {
          font-size: 16px; font-weight: 700;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .subject-hint { font-size: 12px; color: var(--muted); margin-top: 2px; font-weight: 500; }
        .subject-chevron { color: var(--muted); font-size: 18px; font-weight: 300; flex-shrink: 0; }

        /* Skeleton */
        .skeleton {
          background: linear-gradient(90deg, #E5E5EA 25%, #F2F2F7 50%, #E5E5EA 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite;
          border-radius: 16px; height: 76px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .empty { text-align: center; padding: 48px 20px; color: var(--muted); }
        .empty-icon { font-size: 44px; margin-bottom: 12px; }
        .empty p { font-size: 15px; font-weight: 500; }
      `}</style>

      <div className="topbar">
        <Link to="/" className="back-btn">‹</Link>
        <div className="topbar-text">
          <h1>Subjects</h1>
          <p>{loading ? "Loading..." : `${subjects.length} subject${subjects.length !== 1 ? "s" : ""}`}</p>
        </div>
      </div>

      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input className="search" placeholder="Search subjects..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="section-label">Available Subjects</div>

      <div className="list">
        {loading && Array(4).fill(0).map((_, i) => <div key={i} className="skeleton" />)}
        {!loading && filtered.map(sub => {
          const { icon, color } = getMeta(sub.name);
          return (
            <Link key={sub.id} to={`/papers/${sub.id}`} className="subject-card">
              <div className="subject-icon" style={{ background: color + "22" }}>{icon}</div>
              <div className="subject-info">
                <div className="subject-name">{sub.name}</div>
                <div className="subject-hint">View question papers</div>
              </div>
              <span className="subject-chevron">›</span>
            </Link>
          );
        })}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="empty">
          <div className="empty-icon">🔍</div>
          <p>No subjects match "{search}"</p>
        </div>
      )}
    </div>
  );
}

export default Subjects;
