import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";
import { BottomNav } from "./Classes";

const GLOBAL = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  :root {
    --bg:#F7F7F5; --white:#FFFFFF; --ink:#1A1A1A; --ink2:#555555;
    --ink3:#999999; --ink4:#CCCCCC; --line:#EDEDED;
    --blue:#3B7CF4; --blue-bg:#EBF1FE; --font:'Nunito',sans-serif;
  }
  html,body { background:var(--bg); font-family:var(--font); -webkit-font-smoothing:antialiased; overscroll-behavior:none; }
  a { -webkit-tap-highlight-color:transparent; }
  button { -webkit-tap-highlight-color:transparent; }
`;

const SUBJECT_META = {
  math:        { icon:"📐", color:"#3B7CF4" },
  maths:       { icon:"📐", color:"#3B7CF4" },
  mathematics: { icon:"📐", color:"#3B7CF4" },
  physics:     { icon:"⚡", color:"#6366F1" },
  chemistry:   { icon:"⚗️", color:"#F59E0B" },
  biology:     { icon:"🌿", color:"#22C55E" },
  english:     { icon:"✏️", color:"#F97316" },
  malayalam:   { icon:"🌴", color:"#14B8A6" },
  hindi:       { icon:"🪔", color:"#EF4444" },
  history:     { icon:"🏛️", color:"#8B5CF6" },
  geography:   { icon:"🌍", color:"#06B6D4" },
  science:     { icon:"🔬", color:"#10B981" },
  computer:    { icon:"💻", color:"#6366F1" },
  economics:   { icon:"📊", color:"#F59E0B" },
  commerce:    { icon:"💼", color:"#EC4899" },
};
const getMeta = (name = "") =>
  SUBJECT_META[name.toLowerCase().split(" ")[0]] || { icon:"📖", color:"#3B7CF4" };

export default function Subjects() {
  const { classId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get(`subjects/${classId}/`).then(r=>setSubjects(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  }, [classId]);

  const filtered = subjects.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div style={{ minHeight:"100dvh", background:"var(--bg)", paddingBottom:"calc(max(env(safe-area-inset-bottom),14px) + 72px)" }}>
        <style>{GLOBAL}{`
          .page { animation:fadeUp 0.3s ease both; }
          @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
          .card { animation:cardIn 0.3s ease both; }
          @keyframes cardIn { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
          .skel { background:linear-gradient(90deg,#F0F0EE 25%,#E8E8E6 50%,#F0F0EE 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; border-radius:14px; }
          @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
          input { outline:none; }
        `}</style>

        {/* Top bar */}
        <div style={{
          background:"rgba(247,247,245,0.94)", borderBottom:"1px solid var(--line)",
          backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
          padding:"max(env(safe-area-inset-top),48px) 20px 16px",
          position:"sticky", top:0, zIndex:20,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <Link to="/" style={{
              width:40, height:40, borderRadius:12, background:"var(--white)",
              border:"1px solid var(--line)", display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:20, color:"var(--ink)", textDecoration:"none",
              boxShadow:"0 1px 4px rgba(0,0,0,0.06)", flexShrink:0,
            }}>‹</Link>
            <div>
              <div style={{ fontFamily:"var(--font)", fontSize:22, fontWeight:900, color:"var(--ink)", letterSpacing:"-0.4px" }}>Subjects</div>
              <div style={{ fontFamily:"var(--font)", fontSize:12, fontWeight:500, color:"var(--ink3)", marginTop:1 }}>
                {loading ? "Loading…" : `${subjects.length} subject${subjects.length !== 1 ? "s" : ""} available`}
              </div>
            </div>
          </div>
        </div>

        <div className="page">
          {/* Search */}
          <div style={{ padding:"14px 20px 0" }}>
            <div style={{
              display:"flex", alignItems:"center", gap:10,
              background:"var(--white)", border:"1.5px solid var(--line)",
              borderRadius:14, padding:"0 16px",
              boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
            }}>
              <span style={{ fontSize:15, opacity:0.3 }}>🔍</span>
              <input
                style={{ flex:1, border:"none", padding:"13px 0", fontFamily:"var(--font)", fontSize:15, fontWeight:500, color:"var(--ink)", background:"transparent" }}
                placeholder="Search subjects…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ width:22, height:22, borderRadius:6, background:"var(--bg)", border:"1px solid var(--line)", fontSize:11, color:"var(--ink3)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
              )}
            </div>
          </div>

          {/* Section label */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px 10px" }}>
            <span style={{ fontFamily:"var(--font)", fontSize:11, fontWeight:700, color:"var(--ink3)", textTransform:"uppercase", letterSpacing:"0.14em" }}>Available Subjects</span>
            {!loading && (
              <span style={{ fontFamily:"var(--font)", fontSize:12, fontWeight:700, color:"var(--blue)", background:"var(--blue-bg)", borderRadius:100, padding:"3px 10px" }}>{filtered.length}</span>
            )}
          </div>

          {/* List */}
          <div style={{ padding:"0 20px 20px", display:"flex", flexDirection:"column", gap:8 }}>
            {loading && Array(5).fill(0).map((_,i) => (
              <div key={i} className="skel" style={{ height:72, animationDelay:`${i*0.07}s` }} />
            ))}

            {!loading && filtered.map((sub, i) => {
              const { icon, color } = getMeta(sub.name);
              return (
                <Link
                  key={sub.id}
                  to={`/papers/${sub.id}`}
                  className="card"
                  style={{
                    background:"var(--white)", border:"1px solid var(--line)",
                    borderRadius:14, padding:"14px 16px",
                    textDecoration:"none", color:"var(--ink)",
                    display:"flex", alignItems:"center", gap:14,
                    boxShadow:"0 1px 6px rgba(0,0,0,0.04)",
                    animationDelay:`${i*0.05}s`,
                    borderLeft:`3px solid ${color}`,
                    transition:"transform 0.15s",
                  }}
                  onTouchStart={e => e.currentTarget.style.transform="scale(0.98)"}
                  onTouchEnd={e => e.currentTarget.style.transform="scale(1)"}
                >
                  <div style={{
                    width:46, height:46, borderRadius:12,
                    background:`${color}15`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:24, flexShrink:0,
                  }}>{icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:"var(--font)", fontSize:16, fontWeight:800, color:"var(--ink)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                      {sub.name}
                    </div>
                    <div style={{ fontFamily:"var(--font)", fontSize:12, fontWeight:500, color:"var(--ink3)", marginTop:2 }}>
                      Tap to view papers
                    </div>
                  </div>
                  <span style={{ fontSize:18, color:"var(--ink4)", flexShrink:0 }}>›</span>
                </Link>
              );
            })}
          </div>

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign:"center", padding:"60px 20px" }}>
              <div style={{ fontSize:48, marginBottom:14 }}>🔍</div>
              <div style={{ fontFamily:"var(--font)", fontSize:18, fontWeight:800, color:"var(--ink2)", marginBottom:6 }}>Nothing found</div>
              <div style={{ fontFamily:"var(--font)", fontSize:14, fontWeight:500, color:"var(--ink3)" }}>No subjects match "{search}"</div>
            </div>
          )}

          {/* Footer */}
          <div style={{ margin:"4px 20px 0", background:"var(--white)", border:"1px solid var(--line)", borderRadius:16, padding:"16px 18px", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:"var(--ink)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>⭐</div>
            <div>
              <div style={{ fontFamily:"var(--font)", fontSize:13, fontWeight:800, color:"var(--ink)" }}>SFI Kottakkal LC</div>
              <div style={{ fontFamily:"var(--font)", fontSize:11, fontWeight:500, color:"var(--ink3)", marginTop:2 }}>Made with love for students</div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
