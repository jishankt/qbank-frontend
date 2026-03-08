import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../api";
import SplashScreen from "./SplashScreen";
import Confetti from "./Cofetti";

/* ── shared font + reset ── */
const GLOBAL = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #F7F7F5;
    --white: #FFFFFF;
    --ink: #1A1A1A;
    --ink2: #555555;
    --ink3: #999999;
    --ink4: #CCCCCC;
    --line: #EDEDED;
    --blue: #3B7CF4;
    --blue-bg: #EBF1FE;
    --green: #22C55E;
    --green-bg: #DCFCE7;
    --red: #EF4444;
    --red-bg: #FEE2E2;
    --radius: 16px;
    --font: 'Nunito', sans-serif;
  }
  html, body {
    background: var(--bg);
    font-family: var(--font);
    -webkit-font-smoothing: antialiased;
    overscroll-behavior: none;
  }
`;

/* accent colors per class card */
const ACCENTS = [
  "#3B7CF4","#F45B3B","#22C55E","#F4A53B","#A53BF4",
  "#3BF4C8","#F43B8C","#3BD4F4","#8CF43B","#F4E03B",
  "#F43B3B","#3B9CF4",
];
const EMOJIS = ["🎯","📐","🔬","🌍","📜","💡","🧬","🏛️","⚗️","🎨","🎭","🌿"];

function fmt(n) {
  if (!n && n !== 0) return "—";
  const x = parseInt(n, 10);
  if (isNaN(x)) return "—";
  if (x >= 1000000) return (x/1000000).toFixed(1)+"M";
  if (x >= 1000) return (x/1000).toFixed(1)+"K";
  return x.toString();
}

/* ─────────────────────────────── BottomNav ─────────────────────────────── */
export function BottomNav() {
  const { pathname } = useLocation();
  const saved = JSON.parse(localStorage.getItem("bookmarks") || "[]").length;
  const active = p => pathname === p;

  return (
    <nav style={{
      position:"fixed", bottom:0, left:0, right:0, zIndex:100,
      background:"rgba(255,255,255,0.96)",
      backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
      borderTop:"1px solid var(--line)",
      display:"flex",
      paddingBottom:"max(env(safe-area-inset-bottom), 12px)",
    }}>
      {[
        { to:"/",          icon:"🏠", label:"Home"  },
        { to:"/bookmarks", icon:"⭐", label:"Saved", badge: saved },
        { to:"/about",     icon:"ℹ️", label:"About"  },
      ].map(({ to, icon, label, badge }) => (
        <Link key={to} to={to} style={{
          flex:1, display:"flex", flexDirection:"column",
          alignItems:"center", gap:3, padding:"10px 0",
          textDecoration:"none", WebkitTapHighlightColor:"transparent",
        }}>
          <div style={{
            width:40, height:40, borderRadius:12,
            background: active(to) ? "var(--ink)" : "transparent",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:20, position:"relative",
            transition:"background 0.2s",
          }}>
            {icon}
            {badge > 0 && (
              <span style={{
                position:"absolute", top:2, right:2,
                background:"var(--red)", color:"#fff",
                fontSize:9, fontWeight:800,
                minWidth:16, height:16, borderRadius:100,
                display:"flex", alignItems:"center", justifyContent:"center",
                padding:"0 4px", fontFamily:"var(--font)",
              }}>{badge > 9 ? "9+" : badge}</span>
            )}
          </div>
          <span style={{
            fontFamily:"var(--font)", fontSize:11, fontWeight: active(to) ? 700 : 500,
            color: active(to) ? "var(--ink)" : "var(--ink3)",
          }}>{label}</span>
        </Link>
      ))}
    </nav>
  );
}

/* ─────────────────────────────── Classes ─────────────────────────────── */
export default function Classes() {
  const [classes, setClasses]       = useState([]);
  const [search, setSearch]         = useState("");
  const [loading, setLoading]       = useState(true);
  const [visitors, setVisitors]     = useState(null);
  const [papers, setPapers]         = useState(null);
  const [splash, setSplash]         = useState(() => !sessionStorage.getItem("splashDone"));
  const [confetti, setConfetti]     = useState(false);

  useEffect(() => {
    API.get("classes/").then(r=>setClasses(r.data)).catch(()=>{}).finally(()=>setLoading(false));
    API.get("papers/count/").then(r=>setPapers(r.data.count)).catch(()=>setPapers("?"));
    const seen = sessionStorage.getItem("visited");
    if (!seen) {
      sessionStorage.setItem("visited","1");
      API.post("visitors/increment/").then(r=>setVisitors(r.data.count)).catch(()=>setVisitors(0));
    } else {
      API.get("visitors/").then(r=>setVisitors(r.data.count)).catch(()=>setVisitors(0));
    }
  }, []);

  const onSplashDone = () => {
    sessionStorage.setItem("splashDone","1");
    setSplash(false);
    if (!localStorage.getItem("confettiShown")) {
      localStorage.setItem("confettiShown","1");
      setConfetti(true);
    }
  };

  const filtered = classes.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      {splash   && <SplashScreen onDone={onSplashDone} />}
      {confetti && <Confetti onDone={() => setConfetti(false)} />}

      <div style={{ minHeight:"100dvh", background:"var(--bg)", paddingBottom:"calc(max(env(safe-area-inset-bottom),14px) + 72px)" }}>
        <style>{GLOBAL}{`
          .page { animation: fadeUp 0.35s ease both; }
          @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
          .card-in { animation: cardIn 0.3s ease both; }
          @keyframes cardIn { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
          .skel {
            background: linear-gradient(90deg,#F0F0EE 25%,#E8E8E6 50%,#F0F0EE 75%);
            background-size: 200% 100%;
            animation: shimmer 1.4s infinite;
            border-radius: var(--radius);
          }
          @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
          input { outline: none; }
          a { -webkit-tap-highlight-color: transparent; }
          button { -webkit-tap-highlight-color: transparent; }
        `}</style>

        {/* ── Header ── */}
        <div style={{
          background:"rgba(247,247,245,0.94)", borderBottom:"1px solid var(--line)",
          backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
          padding:"max(env(safe-area-inset-top),48px) 20px 18px",
          position:"sticky", top:0, zIndex:20,
        }}>
          {/* Brand row */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:7,
              background:"var(--ink)", borderRadius:100, padding:"5px 14px 5px 7px",
            }}>
              <div style={{
                width:22, height:22, borderRadius:8, background:"var(--blue)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:11, fontWeight:800, color:"#fff", fontFamily:"var(--font)",
              }}>Q</div>
              <span style={{ fontSize:11, fontWeight:700, color:"#fff", letterSpacing:"0.08em", textTransform:"uppercase", fontFamily:"var(--font)" }}>
                Question Bank
              </span>
            </div>
            <div style={{
              width:38, height:38, borderRadius:12, background:"var(--white)",
              border:"1px solid var(--line)", display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:18, boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
              position:"relative", cursor:"pointer",
            }}>
              🔔
              <span style={{
                position:"absolute", top:7, right:8,
                width:6, height:6, borderRadius:"50%", background:"var(--red)",
                boxShadow:"0 0 0 2px var(--bg)",
              }} />
            </div>
          </div>

          {/* Title */}
          <div style={{ fontFamily:"var(--font)", fontSize:32, fontWeight:900, color:"var(--ink)", letterSpacing:"-0.8px", lineHeight:1.1, marginBottom:4 }}>
            Find your<br />
            <span style={{ color:"var(--blue)" }}>Papers.</span>
          </div>
          <div style={{ fontFamily:"var(--font)", fontSize:14, fontWeight:500, color:"var(--ink3)" }}>
            Model questions · Always free
          </div>
        </div>

        <div className="page">
          {/* Sponsor strip */}
          <div style={{ padding:"14px 20px 0" }}>
            <div style={{
              background:"var(--white)", border:"1px solid var(--line)",
              borderRadius:var_r(14), padding:"12px 16px",
              display:"flex", alignItems:"center", gap:12,
              boxShadow:"0 1px 6px rgba(0,0,0,0.04)",
            }}>
              <div style={{
                width:40, height:40, borderRadius:12, background:"#FEF3C7",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0,
              }}>⭐</div>
              <div>
                <div style={{ fontFamily:"var(--font)", fontSize:10, fontWeight:600, color:"var(--ink3)", textTransform:"uppercase", letterSpacing:"0.1em" }}>Official Sponsor</div>
                <div style={{ fontFamily:"var(--font)", fontSize:14, fontWeight:800, color:"var(--ink)", marginTop:2 }}>SFI Kottakkal LC</div>
              </div>
              <div style={{
                marginLeft:"auto", background:"var(--bg)", border:"1px solid var(--line)",
                borderRadius:100, padding:"4px 12px",
                fontFamily:"var(--font)", fontSize:10, fontWeight:700, color:"var(--ink3)",
                textTransform:"uppercase", letterSpacing:"0.06em", flexShrink:0,
              }}>Official</div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, padding:"12px 20px 0" }}>
            {[
              { v: loading?"—":classes.length, k:"Classes" },
              { v: papers??"—", k:"Papers" },
              { v: visitors!==null?fmt(visitors):"—", k:"Visitors" },
              { v: "Free", k:"Always" },
            ].map(({ v, k }) => (
              <div key={k} style={{
                background:"var(--white)", border:"1px solid var(--line)",
                borderRadius:14, padding:"14px 6px", textAlign:"center",
                boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
              }}>
                <div style={{ fontFamily:"var(--font)", fontSize:18, fontWeight:900, color:"var(--ink)", marginBottom:3 }}>{v}</div>
                <div style={{ fontFamily:"var(--font)", fontSize:9, fontWeight:700, color:"var(--ink3)", textTransform:"uppercase", letterSpacing:"0.12em" }}>{k}</div>
              </div>
            ))}
          </div>

          {/* Live visitors banner */}
          <div style={{ padding:"10px 20px 0" }}>
            {visitors === null ? (
              <div className="skel" style={{ height:80 }} />
            ) : (
              <div style={{
                background:"var(--ink)", borderRadius:var_r(16), padding:"18px 20px",
                display:"flex", alignItems:"center", gap:14,
                boxShadow:"0 4px 20px rgba(0,0,0,0.12)",
              }}>
                <div style={{
                  width:48, height:48, borderRadius:14, background:"rgba(255,255,255,0.1)",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0,
                }}>👥</div>
                <div>
                  <div style={{ fontFamily:"var(--font)", fontSize:28, fontWeight:900, color:"#fff", lineHeight:1 }}>{fmt(visitors)}</div>
                  <div style={{ fontFamily:"var(--font)", fontSize:12, fontWeight:500, color:"rgba(255,255,255,0.5)", marginTop:3 }}>Total Visitors</div>
                </div>
                <div style={{
                  marginLeft:"auto", display:"flex", alignItems:"center", gap:6,
                  background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.12)",
                  borderRadius:100, padding:"6px 14px", flexShrink:0,
                }}>
                  <span style={{
                    width:7, height:7, borderRadius:"50%", background:"#4ADE80",
                    display:"inline-block", boxShadow:"0 0 8px #4ADE80",
                    animation:"pulse 1.6s ease-in-out infinite",
                  }} />
                  <span style={{ fontFamily:"var(--font)", fontSize:11, fontWeight:700, color:"#4ADE80" }}>Live</span>
                </div>
                <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
              </div>
            )}
          </div>

          {/* Search */}
          <div style={{ padding:"14px 20px 0" }}>
            <div style={{
              display:"flex", alignItems:"center", gap:10,
              background:"var(--white)", border:"1.5px solid var(--line)",
              borderRadius:14, padding:"0 16px",
              boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
            }}>
              <span style={{ fontSize:16, opacity:0.3 }}>🔍</span>
              <input
                style={{ flex:1, border:"none", padding:"13px 0", fontFamily:"var(--font)", fontSize:15, fontWeight:500, color:"var(--ink)", background:"transparent" }}
                placeholder="Search classes…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{ width:22, height:22, borderRadius:6, background:"var(--bg)", border:"1px solid var(--line)", fontSize:11, color:"var(--ink3)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
                >✕</button>
              )}
            </div>
          </div>

          {/* Section label */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 20px 12px" }}>
            <span style={{ fontFamily:"var(--font)", fontSize:11, fontWeight:700, color:"var(--ink3)", textTransform:"uppercase", letterSpacing:"0.14em" }}>All Classes</span>
            {!loading && (
              <span style={{ fontFamily:"var(--font)", fontSize:12, fontWeight:700, color:"var(--blue)", background:"var(--blue-bg)", borderRadius:100, padding:"3px 10px" }}>
                {filtered.length}
              </span>
            )}
          </div>

          {/* Classes grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, padding:"0 20px 20px" }}>
            {loading && Array(6).fill(0).map((_,i) => (
              <div key={i} className="skel" style={{ height:140, animationDelay:`${i*0.07}s` }} />
            ))}

            {!loading && filtered.map((cls, i) => {
              const color = ACCENTS[i % ACCENTS.length];
              return (
                <Link
                  key={cls.id}
                  to={`/subjects/${cls.id}`}
                  className="card-in"
                  style={{
                    background:"var(--white)", border:"1px solid var(--line)",
                    borderRadius:var_r(18), padding:18,
                    textDecoration:"none", color:"var(--ink)",
                    display:"flex", flexDirection:"column", gap:12,
                    boxShadow:"0 2px 10px rgba(0,0,0,0.05)",
                    animationDelay:`${i*0.04}s`,
                    borderTop:`3px solid ${color}`,
                  }}
                  onMouseDown={e => e.currentTarget.style.transform="scale(0.97)"}
                  onMouseUp={e => e.currentTarget.style.transform="scale(1)"}
                  onTouchStart={e => e.currentTarget.style.transform="scale(0.97)"}
                  onTouchEnd={e => e.currentTarget.style.transform="scale(1)"}
                >
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
                    <div style={{
                      width:44, height:44, borderRadius:13,
                      background:`${color}18`,
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:22,
                    }}>
                      {EMOJIS[i % EMOJIS.length]}
                    </div>
                    <span style={{ fontFamily:"var(--font)", fontSize:10, fontWeight:700, color:"var(--ink4)" }}>
                      {String(i+1).padStart(2,"0")}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontFamily:"var(--font)", fontSize:16, fontWeight:800, color:"var(--ink)", letterSpacing:"-0.2px" }}>
                      Class {cls.name}
                    </div>
                    <div style={{ fontFamily:"var(--font)", fontSize:11, fontWeight:500, color:"var(--ink3)", marginTop:3 }}>
                      Tap to explore
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span style={{ fontFamily:"var(--font)", fontSize:10, fontWeight:700, color:"var(--ink4)", textTransform:"uppercase", letterSpacing:"0.12em" }}>Open</span>
                    <div style={{
                      width:28, height:28, borderRadius:9,
                      background:"var(--bg)", border:"1px solid var(--line)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:14, color:"var(--ink3)",
                    }}>→</div>
                  </div>
                </Link>
              );
            })}
          </div>

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign:"center", padding:"60px 20px" }}>
              <div style={{ fontSize:48, marginBottom:14 }}>🔍</div>
              <div style={{ fontFamily:"var(--font)", fontSize:18, fontWeight:800, color:"var(--ink2)", marginBottom:6 }}>Nothing found</div>
              <div style={{ fontFamily:"var(--font)", fontSize:14, fontWeight:500, color:"var(--ink3)" }}>No classes match "{search}"</div>
            </div>
          )}

          {/* Footer */}
          <div style={{
            margin:"4px 20px 0", background:"var(--white)", border:"1px solid var(--line)",
            borderRadius:16, padding:"16px 18px", display:"flex", alignItems:"center", gap:12,
          }}>
            <div style={{ width:40, height:40, borderRadius:12, background:"var(--ink)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>⭐</div>
            <div>
              <div style={{ fontFamily:"var(--font)", fontSize:13, fontWeight:800, color:"var(--ink)" }}>SFI Kottakkal LC</div>
              <div style={{ fontFamily:"var(--font)", fontSize:11, fontWeight:500, color:"var(--ink3)", marginTop:2 }}>Made with love for students</div>
            </div>
            <span style={{ marginLeft:"auto", fontSize:18, animation:"hb 2s ease-in-out infinite" }}>❤️</span>
            <style>{`@keyframes hb{0%,100%{transform:scale(1)}15%{transform:scale(1.3)}30%{transform:scale(1)}}`}</style>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}

/* helper — CSS var shorthand (avoids JSX lint issues) */
function var_r(px) { return `${px}px`; }
