import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

const subjectMeta = {
  math:        { icon: "📐", color: "#E63946" },
  maths:       { icon: "📐", color: "#E63946" },
  mathematics: { icon: "📐", color: "#E63946" },
  physics:     { icon: "⚡", color: "#FFD166" },
  chemistry:   { icon: "⚗️", color: "#FF6B35" },
  biology:     { icon: "🌿", color: "#2A9D8F" },
  english:     { icon: "✏️", color: "#457B9D" },
  malayalam:   { icon: "🌴", color: "#2A9D8F" },
  hindi:       { icon: "🪔", color: "#E63946" },
  history:     { icon: "🏛️", color: "#C77DFF" },
  geography:   { icon: "🌍", color: "#2EC4B6" },
  science:     { icon: "🔬", color: "#457B9D" },
  computer:    { icon: "💻", color: "#C77DFF" },
  economics:   { icon: "📊", color: "#FFD166" },
  commerce:    { icon: "💼", color: "#FF9F1C" },
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
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0D0D0D; --surface: #161616; --surface2: #1E1E1E;
          --red: #E63946; --gold: #FFD166; --text: #F5F5F5;
          --muted: #888; --border: rgba(255,255,255,0.07);
        }
        body { background: var(--bg); }
        .app {
          min-height: 100vh; min-height: 100dvh; background: var(--bg);
          font-family: 'Outfit', sans-serif; color: var(--text);
          padding-bottom: env(safe-area-inset-bottom, 32px);
        }

        /* Topbar */
        .topbar {
          background: var(--surface);
          padding: 52px 16px 20px;
          position: relative;
          border-bottom: 1px solid var(--border);
        }
        .topbar::after {
          content: ''; position: absolute;
          bottom: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--red), var(--gold), transparent);
        }
        .topbar-row { display: flex; align-items: center; gap: 12px; }
        .back-btn {
          width: 38px; height: 38px; border-radius: 10px;
          background: var(--surface2); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; color: var(--red);
          text-decoration: none; flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
          transition: opacity 0.15s;
        }
        .back-btn:active { opacity: 0.6; }
        .topbar-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px; letter-spacing: 1px; line-height: 1;
        }
        .topbar-sub { font-size: 12px; color: var(--muted); margin-top: 3px; font-weight: 500; }

        /* Search */
        .search-wrap { padding: 14px 16px 6px; position: relative; }
        .search-icon { position: absolute; left: 30px; top: 50%; transform: translateY(-50%); font-size: 14px; color: var(--muted); pointer-events: none; }
        .search {
          width: 100%; background: var(--surface2); border: 1px solid var(--border);
          border-radius: 10px; padding: 12px 16px 12px 38px;
          font-family: 'Outfit', sans-serif; font-size: 15px;
          color: var(--text); outline: none; -webkit-appearance: none;
          transition: border-color 0.2s;
        }
        .search::placeholder { color: var(--muted); }
        .search:focus { border-color: rgba(230,57,70,0.5); }

        .section-label {
          padding: 12px 16px 10px;
          display: flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 800;
          color: var(--muted); text-transform: uppercase; letter-spacing: 0.12em;
        }
        .section-line { flex: 1; height: 1px; background: var(--border); }

        /* Subject list */
        .list { padding: 0 16px 20px; display: flex; flex-direction: column; gap: 8px; }

        .subject-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 12px; padding: 14px 16px;
          text-decoration: none; color: var(--text);
          display: flex; align-items: center; gap: 14px;
          position: relative; overflow: hidden;
          transition: transform 0.15s, border-color 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .subject-card::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 3px; border-radius: 3px 0 0 3px;
          opacity: 0; transition: opacity 0.2s;
        }
        .subject-card:active { transform: scale(0.98); border-color: rgba(230,57,70,0.3); }
        .subject-card:active::before { opacity: 1; }

        .subject-icon {
          width: 46px; height: 46px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
        }
        .subject-name { font-size: 16px; font-weight: 700; }
        .subject-hint { font-size: 12px; color: var(--muted); margin-top: 2px; font-weight: 400; }
        .subject-chevron { margin-left: auto; color: var(--red); font-size: 18px; flex-shrink: 0; }

        /* Skeleton */
        .skeleton {
          background: linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite;
          border-radius: 12px; height: 74px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .footer {
          margin: 8px 16px 0; padding: 16px;
          border-top: 1px solid var(--border); text-align: center;
          font-size: 11px; color: var(--muted); font-weight: 500; letter-spacing: 0.04em;
        }
        .footer strong { color: var(--red); }

        .empty { text-align: center; padding: 48px 20px; color: var(--muted); }
        .empty-icon { font-size: 44px; margin-bottom: 12px; }
        .empty p { font-size: 15px; font-weight: 500; }
      `}</style>

      <div className="topbar">
        <div className="topbar-row">
          <Link to="/" className="back-btn">‹</Link>
          <div>
            <div className="topbar-title">Subjects</div>
            <div className="topbar-sub">
              {loading ? "Loading..." : `${subjects.length} subject${subjects.length !== 1 ? "s" : ""} available`}
            </div>
          </div>
        </div>
      </div>

      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input className="search" placeholder="Search subjects..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="section-label">
        Available Subjects <div className="section-line" />
      </div>

      <div className="list">
        {loading && Array(4).fill(0).map((_, i) => <div key={i} className="skeleton" />)}
        {!loading && filtered.map(sub => {
          const { icon, color } = getMeta(sub.name);
          return (
            <Link key={sub.id} to={`/papers/${sub.id}`} className="subject-card">
              <div className="subject-icon" style={{ background: color + "22" }}>{icon}</div>
              <div>
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

      <div className="footer">
        Made with ❤️ by <strong>SFI KOTTAKKAL LC</strong>
      </div>
    </div>
  );
}

export default Subjects;
