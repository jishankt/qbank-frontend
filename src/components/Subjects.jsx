import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

const subjectMeta = {
  math:        { icon: "📐", bg: "#FFF0F0", color: "#C1121F" },
  maths:       { icon: "📐", bg: "#FFF0F0", color: "#C1121F" },
  mathematics: { icon: "📐", bg: "#FFF0F0", color: "#C1121F" },
  physics:     { icon: "⚡", bg: "#F0F7FF", color: "#1A4FB5" },
  chemistry:   { icon: "⚗️", bg: "#FFF5F0", color: "#C2410C" },
  biology:     { icon: "🌿", bg: "#F0FFF6", color: "#1E7A44" },
  english:     { icon: "✏️", bg: "#FFFBF0", color: "#B45309" },
  malayalam:   { icon: "🌴", bg: "#F0FDFF", color: "#0E6A87" },
  hindi:       { icon: "🪔", bg: "#FFF0F0", color: "#C1121F" },
  history:     { icon: "🏛️", bg: "#F5F0FF", color: "#5B21B6" },
  geography:   { icon: "🌍", bg: "#F0F7FF", color: "#1A4FB5" },
  science:     { icon: "🔬", bg: "#F0FFF6", color: "#1E7A44" },
  computer:    { icon: "💻", bg: "#F5F0FF", color: "#5B21B6" },
  economics:   { icon: "📊", bg: "#FFFBF0", color: "#B45309" },
  commerce:    { icon: "💼", bg: "#FFF8F0", color: "#C4611A" },
};
function getMeta(name = "") {
  const key = name.toLowerCase().split(" ")[0];
  return subjectMeta[key] || { icon: "📖", bg: "#F5F5F8", color: "#555" };
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
    <div className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #F7F7F8; --white: #FFFFFF; --ink: #111118;
          --ink2: #3D3D4A; --muted: #9898A8; --border: #E8E8EE;
          --red: #E63946;
          --shadow-sm: 0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04);
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

        /* Topbar */
        .topbar {
          background: var(--white);
          padding: max(env(safe-area-inset-top), 52px) 20px 18px;
          border-bottom: 1px solid var(--border);
          position: sticky; top: 0; z-index: 10;
        }
        .topbar-row { display: flex; align-items: center; gap: 12px; }
        .back-btn {
          width: 40px; height: 40px; border-radius: 12px;
          background: var(--bg); border: 1.5px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; color: var(--ink2);
          text-decoration: none; flex-shrink: 0;
          -webkit-tap-highlight-color: transparent; transition: background 0.15s;
        }
        .back-btn:active { background: var(--border); }
        .topbar-info { flex: 1; }
        .topbar-title {
          font-size: 22px; font-weight: 800;
          letter-spacing: -0.4px; color: var(--ink);
        }
        .topbar-sub { font-size: 12px; color: var(--muted); margin-top: 2px; }

        /* Search */
        .search-section { padding: 14px 16px 0; }
        .search-box {
          display: flex; align-items: center; gap: 10px;
          background: var(--white); border: 1.5px solid var(--border);
          border-radius: 12px; padding: 0 14px;
          box-shadow: var(--shadow-sm); transition: border-color 0.2s;
        }
        .search-box:focus-within { border-color: var(--red); box-shadow: 0 0 0 3px rgba(230,57,70,0.08); }
        .search-ico { font-size: 16px; flex-shrink: 0; opacity: 0.4; }
        .search-input {
          flex: 1; border: none; outline: none; padding: 13px 0;
          font-family: 'Inter', sans-serif; font-size: 15px;
          color: var(--ink); background: transparent;
        }
        .search-input::placeholder { color: var(--muted); }
        .search-clear {
          font-size: 16px; cursor: pointer; opacity: 0.5; flex-shrink: 0;
          padding: 4px; border: none; background: none;
          -webkit-tap-highlight-color: transparent;
        }

        /* Section label */
        .section-label {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 16px 10px;
        }
        .label-text { font-size: 13px; font-weight: 700; color: var(--ink2); text-transform: uppercase; letter-spacing: 0.08em; }
        .label-count { font-size: 12px; font-weight: 600; background: #F0F0F5; color: var(--muted); padding: 3px 10px; border-radius: 100px; }

        /* Subject list */
        .list { padding: 0 16px 20px; display: flex; flex-direction: column; gap: 8px; }

        .subject-card {
          background: var(--white);
          border: 1.5px solid var(--border);
          border-radius: 14px; padding: 14px 16px;
          text-decoration: none; color: var(--ink);
          display: flex; align-items: center; gap: 14px;
          box-shadow: var(--shadow-sm);
          transition: transform 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .subject-card:active { transform: scale(0.98); }

        .subject-icon-wrap {
          width: 50px; height: 50px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; flex-shrink: 0;
        }
        .subject-info { flex: 1; min-width: 0; }
        .subject-name {
          font-size: 16px; font-weight: 700;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          letter-spacing: -0.2px;
        }
        .subject-hint { font-size: 12px; color: var(--muted); margin-top: 2px; }
        .subject-arrow {
          width: 32px; height: 32px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; font-weight: 600;
          color: var(--muted); background: var(--bg); flex-shrink: 0;
        }

        /* Skeleton */
        .skel {
          background: linear-gradient(90deg, #ececf0 25%, #f5f5f8 50%, #ececf0 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite;
          border-radius: 14px; height: 78px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .empty { text-align: center; padding: 60px 20px; color: var(--muted); }
        .empty-icon { font-size: 52px; margin-bottom: 14px; display: block; }
        .empty-title { font-size: 18px; font-weight: 700; color: var(--ink2); margin-bottom: 6px; }
        .empty-sub { font-size: 14px; }

        .footer {
          margin: 8px 16px 0; padding: 20px 16px;
          background: var(--white); border-radius: 14px;
          border: 1px solid var(--border);
          display: flex; flex-direction: column; align-items: center; gap: 4px;
        }
        .footer-name { font-size: 13px; font-weight: 800; color: var(--red); }
        .footer-sub { font-size: 11px; color: var(--muted); }
      `}</style>

      <div className="topbar">
        <div className="topbar-row">
          <Link to="/" className="back-btn">‹</Link>
          <div className="topbar-info">
            <div className="topbar-title">Subjects</div>
            <div className="topbar-sub">
              {loading ? "Loading..." : `${subjects.length} subject${subjects.length !== 1 ? "s" : ""}`}
            </div>
          </div>
        </div>
      </div>

      <div className="search-section">
        <div className="search-box">
          <span className="search-ico">🔍</span>
          <input className="search-input" placeholder="Search subjects..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="search-clear" onClick={() => setSearch("")}>✕</button>}
        </div>
      </div>

      <div className="section-label">
        <span className="label-text">Available</span>
        {!loading && <span className="label-count">{filtered.length}</span>}
      </div>

      <div className="list">
        {loading && Array(4).fill(0).map((_, i) => <div key={i} className="skel" />)}
        {!loading && filtered.map(sub => {
          const { icon, bg, color } = getMeta(sub.name);
          return (
            <Link key={sub.id} to={`/papers/${sub.id}`} className="subject-card">
              <div className="subject-icon-wrap" style={{ background: bg }}>{icon}</div>
              <div className="subject-info">
                <div className="subject-name" style={{ color }}>{sub.name}</div>
                <div className="subject-hint">View question papers</div>
              </div>
              <div className="subject-arrow">›</div>
            </Link>
          );
        })}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="empty">
          <span className="empty-icon">🔍</span>
          <div className="empty-title">Nothing found</div>
          <div className="empty-sub">No subjects match "{search}"</div>
        </div>
      )}

      <div className="footer">
        <div className="footer-name">★ SFI KOTTAKKAL LC</div>
        <div className="footer-sub">Made with love for students</div>
      </div>
    </div>
  );
}

export default Subjects;
