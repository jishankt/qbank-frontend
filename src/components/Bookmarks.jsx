import { useState } from "react";
import { Link } from "react-router-dom";
import { BottomNav } from "./Classes";

const GLOBAL = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  :root {
    --bg:#F7F7F5; --white:#FFFFFF; --ink:#1A1A1A; --ink2:#555555;
    --ink3:#999999; --ink4:#CCCCCC; --line:#EDEDED;
    --blue:#3B7CF4; --blue-bg:#EBF1FE;
    --green:#22C55E; --green-bg:#DCFCE7;
    --red:#EF4444; --red-bg:#FEE2E2;
    --font:'Nunito',sans-serif;
  }
  html,body { background:var(--bg); font-family:var(--font); -webkit-font-smoothing:antialiased; overscroll-behavior:none; }
  a { -webkit-tap-highlight-color:transparent; }
  button { -webkit-tap-highlight-color:transparent; }
`;

export default function Bookmarks() {
  const [bookmarks, setBm] = useState(() => JSON.parse(localStorage.getItem("bookmarks")||"[]"));
  const [downloading, setDown] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(""),2000); };

  const remove = id => {
    const next = bookmarks.filter(b=>b.id!==id);
    setBm(next); localStorage.setItem("bookmarks", JSON.stringify(next));
    showToast("Removed");
  };

  const download = async (paper) => {
    if (!paper.pdf) return;
    setDown(paper.id);
    try {
      const r = await fetch(paper.pdf);
      if (!r.ok) throw new Error();
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href=url; a.download=`${paper.title}_${paper.year}.pdf`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(()=>URL.revokeObjectURL(url),5000);
      showToast("Download started ⬇");
    } catch { alert("Download failed."); }
    finally { setDown(null); }
  };

  return (
    <>
      <div style={{ minHeight:"100dvh", background:"var(--bg)", paddingBottom:"calc(max(env(safe-area-inset-bottom),14px) + 72px)" }}>
        <style>{GLOBAL}{`
          .page { animation:fadeUp 0.3s ease both; }
          @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
          .card { animation:cardIn 0.3s ease both; }
          @keyframes cardIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
          .btn { flex:1; padding:12px 10px; border-radius:12px; font-family:var(--font); font-size:13px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; text-decoration:none; transition:all 0.18s; border:1.5px solid; }
          .btn:active { transform:scale(0.96); }
          .btn:disabled { opacity:0.4; cursor:not-allowed; transform:none!important; }
        `}</style>

        {/* Toast */}
        <div style={{
          position:"fixed", bottom:88, left:"50%", transform:`translateX(-50%) translateY(${toast?0:16}px)`,
          background:"var(--ink)", borderRadius:100, padding:"10px 22px",
          fontFamily:"var(--font)", fontSize:13, fontWeight:700, color:"#fff",
          whiteSpace:"nowrap", zIndex:500, opacity:toast?1:0,
          transition:"opacity 0.22s, transform 0.22s", pointerEvents:"none",
          boxShadow:"0 6px 20px rgba(0,0,0,0.15)",
        }}>{toast}</div>

        {/* Top bar */}
        <div style={{
          background:"rgba(247,247,245,0.94)", borderBottom:"1px solid var(--line)",
          backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
          padding:"max(env(safe-area-inset-top),48px) 20px 22px",
          position:"sticky", top:0, zIndex:20,
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"var(--ink)", borderRadius:100, padding:"5px 14px 5px 7px" }}>
              <div style={{ width:22, height:22, borderRadius:8, background:"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"#fff", fontFamily:"var(--font)" }}>Q</div>
              <span style={{ fontSize:11, fontWeight:700, color:"#fff", letterSpacing:"0.08em", textTransform:"uppercase", fontFamily:"var(--font)" }}>Question Bank</span>
            </div>
          </div>
          <div style={{ fontFamily:"var(--font)", fontSize:30, fontWeight:900, color:"var(--ink)", letterSpacing:"-0.7px", lineHeight:1.1, marginBottom:5 }}>
            Saved <span style={{ color:"var(--blue)" }}>Papers</span>
          </div>
          <div style={{ fontFamily:"var(--font)", fontSize:14, fontWeight:500, color:"var(--ink3)" }}>
            Your bookmarked papers in one place
          </div>
        </div>

        <div className="page">
          {/* Count banner */}
          {bookmarks.length > 0 && (
            <div style={{ padding:"14px 20px 0" }}>
              <div style={{
                background:"var(--white)", border:"1px solid var(--line)",
                borderRadius:14, padding:"14px 18px", display:"flex", alignItems:"center", gap:12,
                boxShadow:"0 1px 6px rgba(0,0,0,0.04)",
              }}>
                <span style={{ fontSize:26 }}>⭐</span>
                <div>
                  <div style={{ fontFamily:"var(--font)", fontSize:22, fontWeight:900, color:"var(--ink)" }}>{bookmarks.length}</div>
                  <div style={{ fontFamily:"var(--font)", fontSize:12, fontWeight:500, color:"var(--ink3)", marginTop:1 }}>
                    Saved Paper{bookmarks.length!==1?"s":""}
                  </div>
                </div>
                <button
                  onClick={()=>{ setBm([]); localStorage.removeItem("bookmarks"); showToast("All cleared"); }}
                  style={{
                    marginLeft:"auto", background:"var(--red-bg)", border:"1.5px solid #FECACA",
                    borderRadius:10, padding:"8px 14px", fontFamily:"var(--font)",
                    fontSize:12, fontWeight:700, color:"#B91C1C", cursor:"pointer",
                  }}
                >Clear All</button>
              </div>
            </div>
          )}

          {bookmarks.length > 0 && (
            <div style={{ padding:"16px 20px 10px" }}>
              <span style={{ fontFamily:"var(--font)", fontSize:11, fontWeight:700, color:"var(--ink3)", textTransform:"uppercase", letterSpacing:"0.14em" }}>Saved Papers</span>
            </div>
          )}

          {/* List */}
          <div style={{ padding:"0 20px 20px", display:"flex", flexDirection:"column", gap:10 }}>
            {bookmarks.map((paper, i) => (
              <div key={paper.id} className="card" style={{
                background:"var(--white)", border:"1px solid var(--line)",
                borderRadius:16, overflow:"hidden",
                boxShadow:"0 2px 10px rgba(0,0,0,0.05)",
                animationDelay:`${i*0.06}s`,
              }}>
                <div style={{ padding:"12px 18px", borderBottom:"1px solid var(--line)", background:"#FAFAF8", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <span style={{ fontFamily:"var(--font)", fontSize:26, fontWeight:900, color:"var(--ink)", letterSpacing:"-0.8px" }}>{paper.year}</span>
                    <span style={{ fontFamily:"var(--font)", fontSize:10, fontWeight:600, color:"var(--ink3)", textTransform:"uppercase", letterSpacing:"0.1em", marginLeft:6 }}>Year</span>
                  </div>
                  <button
                    onClick={()=>remove(paper.id)}
                    style={{
                      width:32, height:32, borderRadius:9, background:"var(--red-bg)",
                      border:"1.5px solid #FECACA", fontSize:13, cursor:"pointer",
                      display:"flex", alignItems:"center", justifyContent:"center", color:"#B91C1C",
                      transition:"transform 0.15s",
                    }}
                    onTouchStart={e=>e.currentTarget.style.transform="scale(0.88)"}
                    onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}
                  >✕</button>
                </div>
                <div style={{ padding:"14px 18px 16px" }}>
                  <div style={{ fontFamily:"var(--font)", fontSize:15, fontWeight:700, color:"var(--ink)", lineHeight:1.5, marginBottom:14 }}>{paper.title}</div>
                  {paper.pdf ? (
                    <div style={{ display:"flex", gap:8 }}>
                      <a href={paper.pdf} target="_blank" rel="noopener noreferrer"
                        className="btn"
                        style={{ color:"var(--blue)", borderColor:"#BFDBFE", background:"var(--blue-bg)" }}>
                        👁 View
                      </a>
                      <button
                        onClick={()=>download(paper)}
                        disabled={downloading===paper.id}
                        className="btn"
                        style={{ color:"#15803D", borderColor:"#86EFAC", background:"var(--green-bg)" }}>
                        {downloading===paper.id?"⏳ Saving…":"⬇ Download"}
                      </button>
                    </div>
                  ) : (
                    <div style={{ fontFamily:"var(--font)", fontSize:13, fontWeight:500, color:"var(--ink3)", textAlign:"center", padding:12, background:"var(--bg)", borderRadius:10, border:"1px dashed var(--line)" }}>
                      📭 PDF not available
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {bookmarks.length === 0 && (
            <div style={{ textAlign:"center", padding:"80px 20px" }}>
              <div style={{ fontSize:64, marginBottom:18 }}>⭐</div>
              <div style={{ fontFamily:"var(--font)", fontSize:20, fontWeight:800, color:"var(--ink2)", marginBottom:8 }}>No saved papers yet</div>
              <div style={{ fontFamily:"var(--font)", fontSize:14, fontWeight:500, color:"var(--ink3)", marginBottom:28 }}>
                Tap ☆ on any paper to save it here
              </div>
              <Link to="/" style={{
                display:"inline-flex", alignItems:"center", gap:8,
                background:"var(--ink)", borderRadius:14, padding:"13px 24px",
                fontFamily:"var(--font)", fontSize:14, fontWeight:700, color:"#fff",
                textDecoration:"none", boxShadow:"0 4px 16px rgba(0,0,0,0.12)",
              }}>🏠 Browse Papers</Link>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
