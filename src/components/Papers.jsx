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
    --blue:#3B7CF4; --blue-bg:#EBF1FE;
    --green:#22C55E; --green-bg:#DCFCE7;
    --font:'Nunito',sans-serif;
  }
  html,body { background:var(--bg); font-family:var(--font); -webkit-font-smoothing:antialiased; overscroll-behavior:none; }
  input { outline:none; }
  a { -webkit-tap-highlight-color:transparent; }
  button { -webkit-tap-highlight-color:transparent; }
`;

export default function Papers() {
  const { subjectId } = useParams();
  const [papers, setPapers]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [downloading, setDown]    = useState(null);
  const [activeYear, setYear]     = useState("All");
  const [bookmarks, setBm]        = useState(() => JSON.parse(localStorage.getItem("bookmarks")||"[]"));
  const [toast, setToast]         = useState("");

  useEffect(() => {
    setLoading(true);
    API.get(`papers/${subjectId}/`).then(r=>setPapers(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  }, [subjectId]);

  const years    = ["All", ...new Set(papers.map(p=>p.year).sort((a,b)=>b-a))];
  const filtered = papers.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) &&
    (activeYear==="All" || p.year===activeYear)
  );

  const isBm = id => bookmarks.some(b=>b.id===id);

  const toggleBm = (paper) => {
    const next = isBm(paper.id)
      ? bookmarks.filter(b=>b.id!==paper.id)
      : [...bookmarks, { id:paper.id, title:paper.title, year:paper.year, pdf:paper.pdf, subjectId }];
    setBm(next);
    localStorage.setItem("bookmarks", JSON.stringify(next));
    showToast(isBm(paper.id) ? "Removed from saved" : "Saved ⭐");
  };

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(""), 2000); };

  const download = async (paper) => {
    if (!paper.pdf) return;
    setDown(paper.id);
    try {
      const r = await fetch(paper.pdf);
      if (!r.ok) throw new Error();
      const blob = await r.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
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
          .skel { background:linear-gradient(90deg,#F0F0EE 25%,#E8E8E6 50%,#F0F0EE 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; border-radius:16px; }
          @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
          .ypill { background:var(--white); border:1px solid var(--line); border-radius:100px; padding:8px 18px; font-family:var(--font); font-size:13px; font-weight:600; color:var(--ink3); cursor:pointer; white-space:nowrap; flex-shrink:0; transition:all 0.2s; }
          .ypill.on { background:var(--ink); border-color:var(--ink); color:#fff; font-weight:700; }
          .btn { flex:1; padding:12px 10px; border-radius:12px; font-family:var(--font); font-size:14px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; text-decoration:none; transition:all 0.18s; border:1.5px solid; }
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
          padding:"max(env(safe-area-inset-top),48px) 20px 16px",
          position:"sticky", top:0, zIndex:20,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <Link to={-1} style={{
              width:40, height:40, borderRadius:12, background:"var(--white)",
              border:"1px solid var(--line)", display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:20, color:"var(--ink)", textDecoration:"none",
              boxShadow:"0 1px 4px rgba(0,0,0,0.06)", flexShrink:0,
            }}>‹</Link>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontFamily:"var(--font)", fontSize:22, fontWeight:900, color:"var(--ink)", letterSpacing:"-0.4px" }}>Papers</span>
                {!loading && (
                  <span style={{ fontFamily:"var(--font)", fontSize:12, fontWeight:700, color:"var(--blue)", background:"var(--blue-bg)", borderRadius:100, padding:"3px 10px" }}>{papers.length}</span>
                )}
              </div>
              <div style={{ fontFamily:"var(--font)", fontSize:12, fontWeight:500, color:"var(--ink3)", marginTop:1 }}>
                {loading ? "Loading…" : `${filtered.length} paper${filtered.length!==1?"s":""} found`}
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
                placeholder="Search papers…"
                value={search}
                onChange={e=>setSearch(e.target.value)}
              />
              {search && (
                <button onClick={()=>setSearch("")} style={{ width:22, height:22, borderRadius:6, background:"var(--bg)", border:"1px solid var(--line)", fontSize:11, color:"var(--ink3)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
              )}
            </div>
          </div>

          {/* Year pills */}
          {!loading && years.length > 1 && (
            <div style={{ display:"flex", gap:8, overflowX:"auto", padding:"12px 20px 0", scrollbarWidth:"none" }}>
              {years.map(y => (
                <button key={y} className={`ypill${activeYear===y?" on":""}`} onClick={()=>setYear(y)}>
                  {y==="All"?"All Years":y}
                </button>
              ))}
            </div>
          )}

          {/* Section label */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px 10px" }}>
            <span style={{ fontFamily:"var(--font)", fontSize:11, fontWeight:700, color:"var(--ink3)", textTransform:"uppercase", letterSpacing:"0.14em" }}>
              {activeYear==="All"?"All Papers":`Year ${activeYear}`}
            </span>
            {!loading && <span style={{ fontFamily:"var(--font)", fontSize:12, fontWeight:500, color:"var(--ink3)" }}>{filtered.length} papers</span>}
          </div>

          {/* Papers list */}
          <div style={{ padding:"0 20px 20px", display:"flex", flexDirection:"column", gap:12 }}>
            {loading && Array(3).fill(0).map((_,i)=>(
              <div key={i} className="skel" style={{ height:155, animationDelay:`${i*0.1}s` }} />
            ))}

            {!loading && filtered.map((paper, i) => (
              <div key={paper.id} className="card" style={{
                background:"var(--white)", border:"1px solid var(--line)",
                borderRadius:16, overflow:"hidden",
                boxShadow:"0 2px 10px rgba(0,0,0,0.05)",
                animationDelay:`${i*0.06}s`,
              }}>
                {/* Card head */}
                <div style={{
                  padding:"14px 18px", borderBottom:"1px solid var(--line)",
                  background:"#FAFAF8", display:"flex", alignItems:"center", justifyContent:"space-between",
                }}>
                  <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
                    <span style={{ fontFamily:"var(--font)", fontSize:30, fontWeight:900, color:"var(--ink)", lineHeight:1, letterSpacing:"-1px" }}>{paper.year}</span>
                    <span style={{ fontFamily:"var(--font)", fontSize:10, fontWeight:600, color:"var(--ink3)", textTransform:"uppercase", letterSpacing:"0.1em" }}>Year</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ display:"flex", gap:6 }}>
                      <span style={{ fontFamily:"var(--font)", fontSize:10, fontWeight:700, background:"var(--bg)", border:"1px solid var(--line)", borderRadius:7, padding:"4px 9px", color:"var(--ink3)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Q·Paper</span>
                      {paper.pdf && (
                        <span style={{ fontFamily:"var(--font)", fontSize:10, fontWeight:700, background:"var(--green-bg)", border:"1px solid #86EFAC", borderRadius:7, padding:"4px 9px", color:"#15803D", textTransform:"uppercase", letterSpacing:"0.06em" }}>PDF ✓</span>
                      )}
                    </div>
                    <button
                      onClick={()=>toggleBm(paper)}
                      style={{
                        width:34, height:34, borderRadius:10, flexShrink:0,
                        background: isBm(paper.id) ? "#FEF9C3" : "var(--bg)",
                        border: `1.5px solid ${isBm(paper.id)?"#FDE047":"var(--line)"}`,
                        fontSize:17, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                        transition:"all 0.2s",
                      }}
                    >
                      {isBm(paper.id)?"⭐":"☆"}
                    </button>
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding:"14px 18px 16px" }}>
                  <div style={{ fontFamily:"var(--font)", fontSize:15, fontWeight:700, color:"var(--ink)", lineHeight:1.5, marginBottom:14 }}>
                    {paper.title}
                  </div>
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
                      📭 PDF not yet available
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!loading && filtered.length===0 && (
            <div style={{ textAlign:"center", padding:"60px 20px" }}>
              <div style={{ fontSize:48, marginBottom:14 }}>{search?"🔍":"📭"}</div>
              <div style={{ fontFamily:"var(--font)", fontSize:18, fontWeight:800, color:"var(--ink2)", marginBottom:6 }}>{search?"Nothing found":"No papers yet"}</div>
              <div style={{ fontFamily:"var(--font)", fontSize:14, fontWeight:500, color:"var(--ink3)" }}>{search?`No results for "${search}"`:"Check back soon!"}</div>
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
