import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

const subjectMeta = {
  math:        { icon: "📐", glow: "#A855F7", label: "Mathematics" },
  maths:       { icon: "📐", glow: "#A855F7", label: "Mathematics" },
  mathematics: { icon: "📐", glow: "#A855F7", label: "Mathematics" },
  physics:     { icon: "⚡", glow: "#3B82F6", label: "Physics" },
  chemistry:   { icon: "⚗️", glow: "#F59E0B", label: "Chemistry" },
  biology:     { icon: "🌿", glow: "#10B981", label: "Biology" },
  english:     { icon: "✏️", glow: "#F59E0B", label: "English" },
  malayalam:   { icon: "🌴", glow: "#14B8A6", label: "Malayalam" },
  hindi:       { icon: "🪔", glow: "#EF4444", label: "Hindi" },
  history:     { icon: "🏛️", glow: "#6366F1", label: "History" },
  geography:   { icon: "🌍", glow: "#06B6D4", label: "Geography" },
  science:     { icon: "🔬", glow: "#10B981", label: "Science" },
  computer:    { icon: "💻", glow: "#6366F1", label: "Computer" },
  economics:   { icon: "📊", glow: "#F59E0B", label: "Economics" },
  commerce:    { icon: "💼", glow: "#EC4899", label: "Commerce" },
};
function getMeta(name = "") {
  return subjectMeta[name.toLowerCase().split(" ")[0]] || { icon: "📖", glow: "#A855F7" };
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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --g1: rgba(255,255,255,0.06); --gb: rgba(255,255,255,0.11);
          --t1: rgba(255,255,255,0.95); --t2: rgba(255,255,255,0.52); --t3: rgba(255,255,255,0.26);
          --ac: #C084FC; --bg: #050510;
        }
        html,body { background: var(--bg); -webkit-font-smoothing: antialiased; overscroll-behavior: none; }
        .root {
          min-height: 100vh; min-height: 100dvh; background: var(--bg);
          font-family: 'Outfit', sans-serif; color: var(--t1);
          overflow-x: hidden; padding-bottom: max(env(safe-area-inset-bottom), 40px);
        }

        .scene { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .o { position: absolute; border-radius: 50%; filter: blur(100px); animation: float var(--d,14s) ease-in-out infinite alternate; }
        .o1 { width: 400px; height: 400px; top: -80px; right: -80px; background: radial-gradient(circle,#7C3AED,#4F46E5,transparent 70%); opacity: 0.3; --d:16s; }
        .o2 { width: 320px; height: 320px; bottom: 20%; left: -60px; background: radial-gradient(circle,#06B6D4,#3B82F6,transparent 70%); opacity: 0.22; --d:20s; }
        @keyframes float { 0%{transform:translate(0,0)}100%{transform:translate(30px,-30px)} }

        .grid-lines { position: fixed; inset: 0; pointer-events: none; z-index: 1; opacity: 0.025; background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 60px 60px; }
        .grain { position: fixed; inset: 0; pointer-events: none; z-index: 1; opacity: 0.04; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 256px; }

        .content { position: relative; z-index: 2; opacity: 0; transform: translateY(8px); animation: pageIn 0.5s ease 0.1s forwards; }
        @keyframes pageIn { to{opacity:1;transform:translateY(0)} }

        /* Topbar */
        .topbar {
          background: rgba(5,5,16,0.8); border-bottom: 1px solid var(--gb);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          padding: max(env(safe-area-inset-top), 52px) 20px 18px;
          position: sticky; top: 0; z-index: 20;
        }
        .trow { display: flex; align-items: center; gap: 12px; }
        .back {
          width: 40px; height: 40px; border-radius: 13px; flex-shrink: 0;
          background: var(--g1); border: 1px solid var(--gb);
          backdrop-filter: blur(10px); display: flex; align-items: center;
          justify-content: center; font-size: 22px; color: var(--ac);
          text-decoration: none; transition: transform 0.2s, opacity 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .back:active { transform: scale(0.88); opacity: 0.6; }
        .tinfo {}
        .ttitle { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; letter-spacing: -0.4px; }
        .tsub { font-size: 12px; color: var(--t2); margin-top: 2px; }

        .search-wrap { padding: 14px 20px 0; }
        .sbox {
          display: flex; align-items: center; gap: 10px;
          background: var(--g1); border: 1px solid var(--gb);
          border-radius: 16px; padding: 0 16px; backdrop-filter: blur(16px);
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .sbox:focus-within { border-color: rgba(192,132,252,0.5); box-shadow: 0 0 0 4px rgba(168,85,247,0.1); }
        .s-ico { font-size: 15px; opacity: 0.25; flex-shrink: 0; }
        .s-in { flex: 1; border: none; outline: none; padding: 14px 0; font-family: 'Outfit', sans-serif; font-size: 15px; color: var(--t1); background: transparent; }
        .s-in::placeholder { color: var(--t3); }
        .s-clr { border: none; background: rgba(255,255,255,0.07); color: var(--t2); width: 22px; height: 22px; border-radius: 6px; font-size: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; -webkit-tap-highlight-color: transparent; border: 1px solid rgba(255,255,255,0.1); }

        .sec-bar { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px 12px; }
        .sec-title { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; color: var(--t2); text-transform: uppercase; letter-spacing: 0.14em; display: flex; align-items: center; gap: 8px; }
        .sec-title::before { content:''; display: block; width: 14px; height: 2px; background: linear-gradient(90deg, #C084FC, #818CF8); border-radius: 2px; }
        .sec-count { font-size: 12px; font-weight: 600; color: var(--ac); background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.2); padding: 3px 11px; border-radius: 100px; }

        .list { padding: 0 20px 20px; display: flex; flex-direction: column; gap: 8px; }

        .sub-card {
          background: var(--g1); border: 1px solid var(--gb);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border-radius: 18px; padding: 16px 18px;
          text-decoration: none; color: var(--t1);
          display: flex; align-items: center; gap: 14px;
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s, box-shadow 0.2s;
          -webkit-tap-highlight-color: transparent;
          position: relative; overflow: hidden;
          animation: cardIn 0.35s ease both;
        }
        .sub-card::before {
          content:''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: linear-gradient(180deg, var(--gc, #C084FC), transparent);
          opacity: 0.7; border-radius: 18px 0 0 18px;
        }
        .sub-card:active { transform: scale(0.97); }
        @keyframes cardIn { from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)} }

        .sub-icon {
          width: 52px; height: 52px; border-radius: 15px; flex-shrink: 0;
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center; font-size: 27px;
          transition: box-shadow 0.2s;
        }
        .sub-info { flex: 1; min-width: 0; }
        .sub-name {
          font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; letter-spacing: -0.2px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .sub-hint { font-size: 12px; color: var(--t2); margin-top: 3px; }
        .sub-arrow {
          margin-left: auto; width: 34px; height: 34px; flex-shrink: 0;
          border-radius: 10px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center; font-size: 18px; color: var(--t2);
        }

        .skel {
          background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 75%);
          background-size: 200% 100%; animation: shimmer 1.5s infinite;
          border-radius: 18px; height: 84px; border: 1px solid var(--gb);
        }
        @keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }

        .empty { text-align: center; padding: 70px 20px; }
        .empty-icon { font-size: 56px; display: block; margin-bottom: 16px; filter: drop-shadow(0 0 20px rgba(168,85,247,0.4)); }
        .empty-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: var(--t2); margin-bottom: 8px; }
        .empty-sub { font-size: 14px; color: var(--t3); }

        .footer {
          margin: 8px 20px 0; background: var(--g1); border: 1px solid var(--gb);
          border-radius: 20px; padding: 18px 20px; backdrop-filter: blur(16px);
          display: flex; align-items: center; gap: 14px; position: relative; overflow: hidden;
        }
        .footer::before { content:''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(192,132,252,0.4), transparent); }
        .footer-logo { width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg,#7C3AED,#4F46E5); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; box-shadow: 0 4px 20px rgba(124,58,237,0.4); }
        .footer-name { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800; color: var(--t1); }
        .footer-sub { font-size: 11px; color: var(--t2); margin-top: 3px; }
        .footer-heart { margin-left: auto; font-size: 20px; animation: heartbeat 1.8s ease-in-out infinite; }
        @keyframes heartbeat { 0%,100%{transform:scale(1);}15%{transform:scale(1.3);}30%{transform:scale(1);} }
      `}</style>

      <div className="scene"><div className="o o1"/><div className="o o2"/></div>
      <div className="grid-lines"/><div className="grain"/>

      <div className="content">
        <div className="topbar">
          <div className="trow">
            <Link to="/" className="back">‹</Link>
            <div className="tinfo">
              <div className="ttitle">Subjects</div>
              <div className="tsub">{loading ? "Loading…" : `${subjects.length} subject${subjects.length!==1?"s":""} available`}</div>
            </div>
          </div>
        </div>

        <div className="search-wrap">
          <div className="sbox">
            <span className="s-ico">🔍</span>
            <input className="s-in" placeholder="Search subjects…" value={search} onChange={e=>setSearch(e.target.value)}/>
            {search && <button className="s-clr" onClick={()=>setSearch("")}>✕</button>}
          </div>
        </div>

        <div className="sec-bar">
          <span className="sec-title">Available</span>
          {!loading && <span className="sec-count">{filtered.length}</span>}
        </div>

        <div className="list">
          {loading && Array(5).fill(0).map((_,i)=><div key={i} className="skel" style={{animationDelay:`${i*0.07}s`}}/>)}
          {!loading && filtered.map((sub, i) => {
            const { icon, glow } = getMeta(sub.name);
            return (
              <Link key={sub.id} to={`/papers/${sub.id}`} className="sub-card"
                style={{ '--gc': glow, boxShadow: `0 4px 24px ${glow}14`, animationDelay: `${i * 0.06}s` }}>
                <div className="sub-icon" style={{ boxShadow: `0 0 24px ${glow}44` }}>{icon}</div>
                <div className="sub-info">
                  <div className="sub-name">{sub.name}</div>
                  <div className="sub-hint">Tap to view question papers</div>
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
          <div className="footer-heart">❤️</div>
        </div>
      </div>
    </div>
  );
}
