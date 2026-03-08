import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

const subjectIcons = {
  math: "📐", maths: "📐", mathematics: "📐",
  physics: "⚛️", chemistry: "⚗️", biology: "🧬",
  english: "📝", malayalam: "🌴", hindi: "🇮🇳",
  history: "🏛️", geography: "🌍", science: "🔬",
  computer: "💻", economics: "📊", commerce: "💹",
  default: "📖"
};

function getIcon(name = "") {
  const key = name.toLowerCase().split(" ")[0];
  return subjectIcons[key] || subjectIcons.default;
}

const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #080b14; --surface: #0e1420; --card: #131929;
    --border: rgba(255,255,255,0.06); --border-hover: rgba(139,92,246,0.5);
    --accent: #7c3aed; --accent2: #06b6d4; --text: #f0f4ff; --muted: #6b7a99;
  }
`;

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
    <div className="qb-root">
      <style>{`
        ${sharedStyles}
        .qb-root {
          min-height: 100vh;
          background: var(--bg);
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          padding: 0 16px 60px;
          position: relative;
          overflow-x: hidden;
        }
        .qb-root::before {
          content: '';
          position: fixed;
          top: -200px; left: -200px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .qb-inner { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }

        .qb-topbar {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 24px 0 28px;
        }
        .qb-back {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px; height: 40px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          text-decoration: none;
          font-size: 16px;
          color: var(--text);
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .qb-back:hover {
          border-color: var(--border-hover);
          background: rgba(124,58,237,0.1);
        }
        .qb-topbar-text h1 {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .qb-topbar-text p { font-size: 13px; color: var(--muted); margin-top: 2px; }

        .qb-search-wrap { position: relative; margin-bottom: 28px; }
        .qb-search-icon {
          position: absolute;
          left: 16px; top: 50%;
          transform: translateY(-50%);
          color: var(--muted); font-size: 15px; pointer-events: none;
        }
        .qb-search {
          width: 100%;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 13px 16px 13px 44px;
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

        .qb-label {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 14px;
        }

        .qb-list { display: flex; flex-direction: column; gap: 10px; }

        .qb-subject-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px 18px;
          text-decoration: none;
          color: var(--text);
          transition: all 0.22s ease;
          position: relative;
          overflow: hidden;
        }
        .qb-subject-card::after {
          content: '→';
          position: absolute;
          right: 18px;
          color: var(--muted);
          font-size: 16px;
          transition: all 0.2s;
        }
        .qb-subject-card:hover {
          border-color: var(--border-hover);
          background: rgba(124,58,237,0.06);
          transform: translateX(4px);
          box-shadow: 0 8px 24px rgba(124,58,237,0.15);
        }
        .qb-subject-card:hover::after {
          right: 14px;
          color: #a78bfa;
        }
        .qb-subject-card:active { transform: scale(0.98); }

        .qb-subject-icon {
          width: 44px; height: 44px;
          background: rgba(124,58,237,0.12);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }
        .qb-subject-name {
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 700;
        }
        .qb-subject-hint { font-size: 12px; color: var(--muted); margin-top: 2px; }

        .qb-skeleton {
          background: linear-gradient(90deg, var(--card) 25%, #1a2235 50%, var(--card) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 16px; height: 76px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .qb-empty { text-align: center; padding: 48px 0; color: var(--muted); }
        .qb-empty-icon { font-size: 40px; margin-bottom: 12px; }
      `}</style>

      <div className="qb-inner">
        <div className="qb-topbar">
          <Link to="/" className="qb-back">⬅</Link>
          <div className="qb-topbar-text">
            <h1>📘 Subjects</h1>
            <p>{loading ? "Loading..." : `${subjects.length} subject${subjects.length !== 1 ? "s" : ""} available`}</p>
          </div>
        </div>

        <div className="qb-search-wrap">
          <span className="qb-search-icon">🔍</span>
          <input
            className="qb-search"
            placeholder="Search subjects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="qb-label">Available Subjects</div>

        <div className="qb-list">
          {loading && Array(4).fill(0).map((_, i) => (
            <div key={i} className="qb-skeleton" />
          ))}

          {!loading && filtered.map(sub => (
            <Link key={sub.id} to={`/papers/${sub.id}`} className="qb-subject-card">
              <div className="qb-subject-icon">{getIcon(sub.name)}</div>
              <div>
                <div className="qb-subject-name">{sub.name}</div>
                <div className="qb-subject-hint">View question papers</div>
              </div>
            </Link>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="qb-empty">
            <div className="qb-empty-icon">🔍</div>
            <p>No subjects match "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Subjects;
