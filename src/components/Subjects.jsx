import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

const subjectMeta = {
  math:        { icon: "📐", glow: "rgba(168,85,247,0.4)" },
  maths:       { icon: "📐", glow: "rgba(168,85,247,0.4)" },
  mathematics: { icon: "📐", glow: "rgba(168,85,247,0.4)" },
  physics:     { icon: "⚡", glow: "rgba(59,130,246,0.4)" },
  chemistry:   { icon: "⚗️", glow: "rgba(245,158,11,0.4)" },
  biology:     { icon: "🌿", glow: "rgba(16,185,129,0.4)" },
  english:     { icon: "✏️", glow: "rgba(251,191,36,0.4)" },
  malayalam:   { icon: "🌴", glow: "rgba(20,184,166,0.4)" },
  hindi:       { icon: "🪔", glow: "rgba(239,68,68,0.4)" },
  history:     { icon: "🏛️", glow: "rgba(99,102,241,0.4)" },
  geography:   { icon: "🌍", glow: "rgba(6,182,212,0.4)" },
  science:     { icon: "🔬", glow: "rgba(16,185,129,0.4)" },
  computer:    { icon: "💻", glow: "rgba(99,102,241,0.4)" },
  economics:   { icon: "📊", glow: "rgba(245,158,11,0.4)" },
  commerce:    { icon: "💼", glow: "rgba(236,72,153,0.4)" },
};
function getMeta(name = "") {
  return subjectMeta[name.toLowerCase().split(" ")[0]] || { icon: "📖", glow: "rgba(168,85,247,0.4)" };
}

export default function Subjects() {
  const { classId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get(`subjects/${classId}/`).then(r=>setSubjects(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  }, [classId]);

  const filtered = subjects.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --glass: rgba(255,255,255,0.07); --glass-border: rgba(255,255,255,0.13);
          --text: rgba(255,255,255,0.95); --text2: rgba(255,255,255,0.5); --text3: rgba(255,255,255,0.28);
          --accent: #C084FC;
        }
        html, body { background: #060612; -webkit-font-smoothing: antialiased; }
        .root {
          min-height: 100vh; min-height: 100dvh; background: #060612;
          font-family: 'Outfit', sans-serif; color: var(--text);
          padding-bottom: max(env(safe-area-inset-bottom), 40px);
          position: relative; overflow-x: hidden;
        }
        .aurora { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .o1 { position: absolute; width: 350px; height: 350px; top: -80px; right: -80px; border-radius: 50%; background: radial-gradient(circle, #7C3AED, #4F46E5); filter: blur(80px); opacity: 0.3; }
        .o2 { position: absolute; width: 300px; height: 300px; bottom: 20%; left: -60px; border-radius: 50%; background: radial-gradient(circle, #06B6D4, #3B82F6); filter: blur(80px); opacity: 0.25; }
        .content { position: relative; z-index: 2; }

        .topbar {
          background: rgba(6,6,18,0.7); border-bottom: 1px solid var(--glass-border);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          padding: max(env(safe-area-inset-top), 52px) 20px 18px;
          position: sticky; top: 0; z-index: 10;
        }
        .topbar-row { display: flex; align-items: center; gap: 12px; }
        .back {
          width: 40px; height: 40px; border-radius: 12px;
          background: var(--glass); border: 1px solid var(--glass-border);
          backdrop-filter: blur(10px); display: flex; align-items: center;
          justify-content: center; font-size: 20px; color: var(--accent);
          text-decoration: none; flex-shrink: 0; transition: opacity 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .back:active { opacity: 0.5; }
        .topbar-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; letter-spacing: -0.3px; }
        .topbar-sub { font-size: 12px; color: var(--text2); margin-top: 2px; }

        .search-wrap { padding: 14px 20px 0; }
        .sbox {
          display: flex; align-items: center; gap: 10px;
          background: var(--glass); border: 1px solid var(--glass-border);
          backdrop-filter: blur(16px); border-radius: 14px; padding: 0 16px;
          transition: border-color 0.2s;
        }
        .sbox:focus-within { border-color: rgba(192,132,252,0.45); box-shadow: 0 0 0 3px rgba(168,85,247,0.1); }
        .s-ico { font-size: 15px; opacity: 0.3; flex-shrink: 0; }
        .s-in {
          flex: 1; border: none; outline: none; padding: 14px 0;
          font-family: 'Outfit', sans-serif; font-size: 15px;
          color: var(--text); background: transparent;
        }
        .s-in::placeholder { color: var(--text3); }
        .s-clr { border: none; background: none; color: var(--text2); font-size: 14px; padding: 4px; cursor: pointer; -webkit-tap-highlight-color: transparent; }

        .sec-bar { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px 12px; }
        .sec-title { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; color: var(--text2); text-transform: uppercase; letter-spacing: 0.12em; }
        .sec-count { font-size: 12px; font-weight: 500; color: var(--accent); background: rgba(168,85,247,0.12); border: 1px solid rgba(168,85,247,0.2); padding: 3px 10px; border-radius: 100px; }

        .list { padding: 0 20px 20px; display: flex; flex-direction: column; gap: 8px; }

        .sub-card {
          background: var(--glass); border: 1px solid var(--glass-border);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border-radius: 16px; padding: 16px;
          text-decoration: none; color: var(--text);
          display: flex; align-items: center; gap: 14px;
          transition: transform 0.15s, border-color 0.15s;
          -webkit-tap-highlight-color: transparent;
          position: relative; overflow: hidden;
        }
        .sub-card:active { transform: scale(0.97); }

        .sub-icon {
          width: 50px; height: 50px; border-radius: 14px; flex-shrink: 0;
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center; font-size: 26px;
        }
        .sub-name { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; letter-spacing: -0.2px; }
        .sub-hint { font-size: 12px; color: var(--text2); margin-top: 3px; }
        .sub-arrow {
          margin-left: auto; width: 32px; height: 32px; border-radius: 9px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center; font-size: 17px; color: var(--text2);
          flex-shrink: 0;
        }

        .skel {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite;
          border-radius: 16px; height: 82px; border: 1px solid var(--glass-border);
        }
        @keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }

        .empty { text-align: center; padding: 64px 20px; }
        .empty-icon { font-size: 52px; display: block; margin-bottom: 14px; }
        .empty-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: var(--text2); margin-bottom: 6px; }
        .empty-sub { font-size: 14px; color: var(--text3); }

        .footer {
          margin: 8px 20px 0; background: var(--glass); border: 1px solid var(--glass-border);
          border-radius: 18px; padding: 16px 18px; backdrop-filter: blur(16px);
          display: flex; align-items: center; gap: 12px;
        }
        .footer-logo { width: 38px; height: 38px; border-radius: 11px; background: linear-gradient(135deg,#7C3AED,#4F46E5); display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; box-shadow: 0 4px 14px rgba(124,58,237,0.3); }
        .footer-name { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: var(--text); }
        .footer-sub { font-size: 11px; color: var(--text2); margin-top: 2px; }
      `}</style>

      <div className="aurora"><div className="o1"/><div className="o2"/></div>
      <div className="content">
        <div className="topbar">
          <div className="topbar-row">
            <Link to="/" className="back">‹</Link>
            <div>
              <div className="topbar-title">Subjects</div>
              <div className="topbar-sub">{loading ? "Loading…" : `${subjects.length} available`}</div>
            </div>
          </div>
        </div>

        <div className="search-wrap">
          <div className="sbox">
            <span className="s-ico">🔍</span>
            <input className="s-in" placeholder="Search subjects…" value={search} onChange={e=>setSearch(e.target.value)} />
            {search && <button className="s-clr" onClick={()=>setSearch("")}>✕</button>}
          </div>
        </div>

        <div className="sec-bar">
          <span className="sec-title">Available Subjects</span>
          {!loading && <span className="sec-count">{filtered.length}</span>}
        </div>

        <div className="list">
          {loading && Array(4).fill(0).map((_,i)=><div key={i} className="skel"/>)}
          {!loading && filtered.map(sub => {
            const { icon, glow } = getMeta(sub.name);
            return (
              <Link key={sub.id} to={`/papers/${sub.id}`} className="sub-card"
                style={{ boxShadow: `0 4px 24px ${glow.replace("0.4","0.08")}` }}>
                <div className="sub-icon" style={{ boxShadow: `0 0 20px ${glow}` }}>{icon}</div>
                <div>
                  <div className="sub-name">{sub.name}</div>
                  <div className="sub-hint">View question papers</div>
                </div>
                <div className="sub-arrow">›</div>
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
          <div className="footer-logo">⭐</div>
          <div><div className="footer-name">SFI KOTTAKKAL LC</div><div className="footer-sub">Made with love for students</div></div>
        </div>
      </div>
    </div>
  );
}
