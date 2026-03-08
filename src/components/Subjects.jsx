import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";
import { BottomNav } from "./Classes";

const subjectMeta = {
  math:        { icon: "📐", accent: "#6366F1", light: "#EEF2FF", border: "#C7D2FE" },
  maths:       { icon: "📐", accent: "#6366F1", light: "#EEF2FF", border: "#C7D2FE" },
  mathematics: { icon: "📐", accent: "#6366F1", light: "#EEF2FF", border: "#C7D2FE" },
  physics:     { icon: "⚡", accent: "#2563EB", light: "#DBEAFE", border: "#93C5FD" },
  chemistry:   { icon: "⚗️", accent: "#D97706", light: "#FEF3C7", border: "#FCD34D" },
  biology:     { icon: "🌿", accent: "#059669", light: "#D1FAE5", border: "#6EE7B7" },
  english:     { icon: "✏️", accent: "#92400E", light: "#FFF7ED", border: "#FED7AA" },
  malayalam:   { icon: "🌴", accent: "#0F766E", light: "#CCFBF1", border: "#5EEAD4" },
  hindi:       { icon: "🪔", accent: "#BE123C", light: "#FFE4E6", border: "#FCA5A5" },
  history:     { icon: "🏛️", accent: "#3730A3", light: "#E0E7FF", border: "#A5B4FC" },
  geography:   { icon: "🌍", accent: "#0369A1", light: "#E0F2FE", border: "#7DD3FC" },
  science:     { icon: "🔬", accent: "#065F46", light: "#ECFDF5", border: "#A7F3D0" },
  computer:    { icon: "💻", accent: "#4338CA", light: "#EEF2FF", border: "#A5B4FC" },
  economics:   { icon: "📊", accent: "#92400E", light: "#FEF3C7", border: "#FCD34D" },
  commerce:    { icon: "💼", accent: "#9D174D", light: "#FCE7F3", border: "#F9A8D4" },
};

function getMeta(name = "") {
  return subjectMeta[name.toLowerCase().split(" ")[0]] || {
    icon: "📖", accent: "#6366F1", light: "#EEF2FF", border: "#C7D2FE"
  };
}

export default function Subjects() {
  const { classId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get(`subjects/${classId}/`).then(r => setSubjects(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [classId]);

  const filtered = subjects.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="root">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          :root { --bg:#FAFAF8; --surface:#FFFFFF; --border:#F0F0EE; --border2:#E5E5E3; --t1:#1C1C1E; --t2:#6B7280; --t3:#9CA3AF; --t4:#D1D5DB; }
          html,body { background: var(--bg); -webkit-font-smoothing: antialiased; overscroll-behavior: none; }
          .root { min-height:100vh; min-height:100dvh; background:var(--bg); font-family:'DM Sans',sans-serif; color:var(--t1); overflow-x:hidden; padding-bottom:calc(max(env(safe-area-inset-bottom),14px) + 72px); }

          .bg-texture { position:fixed; inset:0; z-index:0; pointer-events:none; background-image:radial-gradient(circle,#E5E7EB 1px,transparent 1px); background-size:32px 32px; opacity:0.5; }
          .bg-glow { position:fixed; top:-100px; right:-80px; width:320px; height:320px; border-radius:50%; background:radial-gradient(circle,rgba(99,102,241,0.07),transparent 70%); pointer-events:none; z-index:0; }

          .page { position:relative; z-index:2; animation:pageIn 0.4s ease both; }
          @keyframes pageIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

          .topbar { background:rgba(250,250,248,0.92); border-bottom:1px solid var(--border); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); padding:max(env(safe-area-inset-top),52px) 20px 18px; position:sticky; top:0; z-index:20; }
          .trow { display:flex; align-items:center; gap:12px; }
          .back { width:40px; height:40px; border-radius:13px; flex-shrink:0; background:var(--surface); border:1.5px solid var(--border2); display:flex; align-items:center; justify-content:center; font-size:20px; color:var(--t1); text-decoration:none; box-shadow:0 1px 4px rgba(0,0,0,0.06); transition:transform 0.2s; -webkit-tap-highlight-color:transparent; }
          .back:active { transform:scale(0.88); }
          .ttitle { font-family:'Playfair Display',serif; font-size:24px; font-weight:800; letter-spacing:-0.4px; }
          .tsub { font-size:12px; color:var(--t2); margin-top:2px; }

          .search-wrap { padding:14px 20px 0; }
          .sbox { display:flex; align-items:center; gap:10px; background:var(--surface); border:1.5px solid var(--border2); border-radius:16px; padding:0 16px; box-shadow:0 1px 4px rgba(0,0,0,0.04); transition:border-color 0.2s, box-shadow 0.2s; }
          .sbox:focus-within { border-color:#6366F1; box-shadow:0 0 0 4px rgba(99,102,241,0.08); }
          .s-ico { font-size:15px; opacity:0.3; flex-shrink:0; }
          .s-in { flex:1; border:none; outline:none; padding:14px 0; font-family:'DM Sans',sans-serif; font-size:15px; color:var(--t1); background:transparent; }
          .s-in::placeholder { color:var(--t4); }
          .s-clr { background:#F3F4F6; border:1px solid var(--border2); color:var(--t2); width:22px; height:22px; border-radius:6px; font-size:11px; display:flex; align-items:center; justify-content:center; cursor:pointer; -webkit-tap-highlight-color:transparent; }

          .sec-bar { display:flex; align-items:center; justify-content:space-between; padding:18px 20px 12px; }
          .sec-title { font-size:11px; font-weight:700; color:var(--t3); text-transform:uppercase; letter-spacing:0.14em; }
          .sec-count { font-size:12px; font-weight:700; color:#6366F1; background:#EEF2FF; border:1px solid #C7D2FE; padding:3px 10px; border-radius:100px; }

          .list { padding:0 20px 20px; display:flex; flex-direction:column; gap:8px; }

          .sub-card { background:var(--surface); border:1.5px solid var(--border2); border-radius:18px; padding:16px 18px; text-decoration:none; color:var(--t1); display:flex; align-items:center; gap:14px; box-shadow:0 2px 8px rgba(0,0,0,0.04); position:relative; overflow:hidden; transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s; -webkit-tap-highlight-color:transparent; animation:cardIn 0.35s ease both; }
          .sub-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:var(--sub-accent,#6366F1); border-radius:18px 0 0 18px; }
          .sub-card:active { transform:scale(0.97); }
          @keyframes cardIn { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }

          .sub-icon { width:50px; height:50px; border-radius:15px; flex-shrink:0; background:var(--sub-light,#EEF2FF); border:1px solid var(--sub-border,#C7D2FE); display:flex; align-items:center; justify-content:center; font-size:26px; }
          .sub-info { flex:1; min-width:0; }
          .sub-name { font-family:'Playfair Display',serif; font-size:16px; font-weight:700; letter-spacing:-0.2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
          .sub-hint { font-size:12px; color:var(--t3); margin-top:3px; }
          .sub-arrow { margin-left:auto; width:32px; height:32px; flex-shrink:0; border-radius:10px; background:#F9FAFB; border:1px solid var(--border2); display:flex; align-items:center; justify-content:center; font-size:16px; color:var(--t2); }

          .skel { background:linear-gradient(90deg,#F9FAFB 25%,#F3F4F6 50%,#F9FAFB 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:18px; height:82px; border:1px solid var(--border); }
          @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}

          .empty { text-align:center; padding:70px 20px; }
          .empty-icon { font-size:52px; display:block; margin-bottom:16px; }
          .empty-title { font-family:'Playfair Display',serif; font-size:20px; font-weight:700; color:var(--t2); margin-bottom:8px; }
          .empty-sub { font-size:14px; color:var(--t3); }

          .footer { margin:8px 20px 0; background:var(--surface); border:1px solid var(--border2); border-radius:20px; padding:18px 20px; display:flex; align-items:center; gap:14px; box-shadow:0 1px 4px rgba(0,0,0,0.04); }
          .footer-logo { width:42px; height:42px; border-radius:13px; background:#1C1C1E; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
          .footer-name { font-size:13px; font-weight:700; color:var(--t1); }
          .footer-sub { font-size:11px; color:var(--t3); margin-top:2px; }
          .footer-heart { margin-left:auto; font-size:18px; animation:heartbeat 2s ease-in-out infinite; }
          @keyframes heartbeat{0%,100%{transform:scale(1)}15%{transform:scale(1.3)}30%{transform:scale(1)}}
        `}</style>

        <div className="bg-texture" />
        <div className="bg-glow" />

        <div className="page">
          <div className="topbar">
            <div className="trow">
              <Link to="/" className="back">‹</Link>
              <div>
                <div className="ttitle">Subjects</div>
                <div className="tsub">{loading ? "Loading…" : `${subjects.length} subject${subjects.length !== 1 ? "s" : ""} available`}</div>
              </div>
            </div>
          </div>

          <div className="search-wrap">
            <div className="sbox">
              <span className="s-ico">🔍</span>
              <input className="s-in" placeholder="Search subjects…" value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button className="s-clr" onClick={() => setSearch("")}>✕</button>}
            </div>
          </div>

          <div className="sec-bar">
            <span className="sec-title">Available Subjects</span>
            {!loading && <span className="sec-count">{filtered.length}</span>}
          </div>

          <div className="list">
            {loading && Array(5).fill(0).map((_, i) => (
              <div key={i} className="skel" style={{ animationDelay: `${i * 0.07}s` }} />
            ))}
            {!loading && filtered.map((sub, i) => {
              const { icon, accent, light, border } = getMeta(sub.name);
              return (
                <Link key={sub.id} to={`/papers/${sub.id}`} className="sub-card"
                  style={{ '--sub-accent': accent, '--sub-light': light, '--sub-border': border, animationDelay: `${i * 0.06}s` }}>
                  <div className="sub-icon">{icon}</div>
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
      <BottomNav />
    </>
  );
}
