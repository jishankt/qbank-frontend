import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../Api";
import { BottomNav } from "./Classes";

export default function Papers() {
  const { subjectId } = useParams();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [downloading, setDownloading] = useState(null);
  const [activeYear, setActiveYear] = useState("All");
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem("bookmarks") || "[]"));
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    API.get(`papers/${subjectId}/`).then(r=>setPapers(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  }, [subjectId]);

  const years = ["All", ...new Set(papers.map(p=>p.year).sort((a,b)=>b-a))];
  const filtered = papers.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) &&
    (activeYear==="All" || p.year===activeYear)
  );

  const isBookmarked = (id) => bookmarks.some(b => b.id === id);

  const toggleBookmark = (paper) => {
    let next;
    if (isBookmarked(paper.id)) {
      next = bookmarks.filter(b => b.id !== paper.id);
      showToast("Removed from saved ✕");
    } else {
      next = [...bookmarks, { id: paper.id, title: paper.title, year: paper.year, pdf: paper.pdf, subjectId }];
      showToast("Saved! ⭐");
    }
    setBookmarks(next);
    localStorage.setItem("bookmarks", JSON.stringify(next));
  };

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 2200); };

  const handleDownload = async (paper) => {
    if (!paper.pdf) return;
    setDownloading(paper.id);
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
    } catch { alert("Download failed. Try opening the PDF manually."); }
    finally { setDownloading(null); }
  };

  return (
    <>
      <div className="root">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          :root{--bg:#F6F5F2;--card:#FFFFFF;--bd:rgba(0,0,0,0.07);--bd2:rgba(0,0,0,0.1);--t1:#111110;--t2:rgba(17,17,16,0.48);--t3:rgba(17,17,16,0.26);--ac:#6366F1;--green:#059669;--blue:#0284C7;}
          html,body{background:var(--bg);-webkit-font-smoothing:antialiased;overscroll-behavior:none;}
          .root{min-height:100vh;min-height:100dvh;background:var(--bg);font-family:'DM Sans',sans-serif;color:var(--t1);overflow-x:hidden;padding-bottom:calc(max(env(safe-area-inset-bottom),14px)+68px);}
          .bg-tex{position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(ellipse 55% 45% at 85% 5%,rgba(99,102,241,0.07) 0%,transparent 65%),radial-gradient(ellipse 45% 35% at 15% 90%,rgba(236,72,153,0.04) 0%,transparent 65%);}
          .page{position:relative;z-index:2;animation:pi 0.4s ease both;}
          @keyframes pi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
          @keyframes cardIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
          @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
          @keyframes heartbeat{0%,100%{transform:scale(1)}15%{transform:scale(1.3)}30%{transform:scale(1)}}

          .topbar{background:rgba(246,245,242,0.92);border-bottom:1px solid var(--bd);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);padding:max(env(safe-area-inset-top),52px) 20px 18px;position:sticky;top:0;z-index:20;}
          .trow{display:flex;align-items:center;gap:12px;}
          .back{width:40px;height:40px;border-radius:13px;flex-shrink:0;background:var(--card);border:1px solid var(--bd2);box-shadow:0 1px 4px rgba(0,0,0,0.06);display:flex;align-items:center;justify-content:center;font-size:22px;color:var(--ac);text-decoration:none;transition:transform 0.2s;-webkit-tap-highlight-color:transparent;}
          .back:active{transform:scale(0.88);}
          .tinfo{flex:1;min-width:0;}
          .title-row{display:flex;align-items:center;gap:8px;}
          .ttitle{font-family:'Fraunces',serif;font-size:26px;font-weight:900;letter-spacing:-0.5px;color:var(--t1);}
          .count-chip{font-size:12px;font-weight:700;color:var(--ac);background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.12);padding:3px 11px;border-radius:100px;}
          .tsub{font-size:12px;color:var(--t2);margin-top:2px;}

          .search-wrap{padding:14px 20px 0;}
          .sbox{display:flex;align-items:center;gap:10px;background:var(--card);border:1px solid var(--bd2);border-radius:16px;padding:0 16px;transition:border-color 0.2s,box-shadow 0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.05);}
          .sbox:focus-within{border-color:rgba(99,102,241,0.4);box-shadow:0 0 0 4px rgba(99,102,241,0.07);}
          .s-ico{font-size:15px;opacity:0.22;flex-shrink:0;}
          .s-in{flex:1;border:none;outline:none;padding:14px 0;font-family:'DM Sans',sans-serif;font-size:15px;color:var(--t1);background:transparent;}
          .s-in::placeholder{color:var(--t3);}
          .s-clr{background:rgba(0,0,0,0.06);color:var(--t2);width:22px;height:22px;border-radius:6px;border:none;font-size:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;-webkit-tap-highlight-color:transparent;}

          .year-row{display:flex;gap:8px;overflow-x:auto;padding:12px 20px 0;scrollbar-width:none;}
          .year-row::-webkit-scrollbar{display:none;}
          .ypill{background:var(--card);border:1px solid var(--bd2);border-radius:100px;padding:8px 18px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:var(--t2);cursor:pointer;white-space:nowrap;flex-shrink:0;transition:all 0.2s;-webkit-tap-highlight-color:transparent;box-shadow:0 1px 3px rgba(0,0,0,0.05);}
          .ypill.active{background:linear-gradient(135deg,#6366F1,#4F46E5);border-color:transparent;color:#fff;font-weight:700;box-shadow:0 4px 14px rgba(99,102,241,0.28);}
          .ypill:not(.active):active{transform:scale(0.93);}

          .sec-bar{display:flex;align-items:center;justify-content:space-between;padding:16px 20px 10px;}
          .sec-title{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:0.14em;}
          .sec-count{font-size:12px;color:var(--t2);}

          .papers{padding:0 20px 20px;display:flex;flex-direction:column;gap:12px;}
          .pcard{background:var(--card);border:1px solid var(--bd);border-radius:22px;overflow:hidden;transition:transform 0.15s;-webkit-tap-highlight-color:transparent;animation:cardIn 0.35s ease both;box-shadow:0 1px 4px rgba(0,0,0,0.05);}
          .pcard:active{transform:scale(0.99);}

          .pcard-head{padding:18px 20px 16px;border-bottom:1px solid var(--bd);background:rgba(0,0,0,0.015);display:flex;align-items:center;justify-content:space-between;position:relative;}
          .pcard-head::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#6366F1,#8B5CF6);}
          .year-block{display:flex;align-items:baseline;gap:6px;}
          .year-big{font-family:'Fraunces',serif;font-size:36px;font-weight:900;letter-spacing:-1px;line-height:1;color:var(--t1);}
          .year-lbl{font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:0.1em;}
          .head-right{display:flex;align-items:center;gap:8px;}
          .badge-row{display:flex;gap:6px;align-items:center;}
          .badge{font-size:10px;font-weight:700;padding:4px 10px;border-radius:7px;text-transform:uppercase;letter-spacing:0.07em;}
          .b-qp{background:rgba(0,0,0,0.04);border:1px solid var(--bd2);color:var(--t2);}
          .b-pdf{background:#ECFDF5;border:1px solid #A7F3D0;color:#059669;}
          .bm-btn{width:34px;height:34px;border-radius:10px;flex-shrink:0;background:rgba(0,0,0,0.04);border:1px solid var(--bd2);display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);-webkit-tap-highlight-color:transparent;}
          .bm-btn.saved{background:#FFFBEB;border-color:#FDE68A;}
          .bm-btn:active{transform:scale(0.82);}

          .pcard-body{padding:16px 20px 18px;}
          .paper-title{font-family:'Fraunces',serif;font-size:16px;font-weight:700;line-height:1.5;letter-spacing:-0.2px;margin-bottom:16px;color:var(--t1);}
          .actions{display:flex;gap:8px;}
          .btn{flex:1;padding:13px 10px;border-radius:13px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;transition:all 0.2s;text-decoration:none;-webkit-tap-highlight-color:transparent;}
          .btn-view{background:#EFF6FF;border:1px solid #BFDBFE;color:var(--blue);}
          .btn-view:active{background:#DBEAFE;transform:scale(0.96);}
          .btn-dl{background:#ECFDF5;border:1px solid #A7F3D0;color:var(--green);}
          .btn-dl:active{background:#D1FAE5;transform:scale(0.96);}
          .btn:disabled{opacity:0.35;cursor:not-allowed;transform:none!important;}
          .no-pdf{font-size:13px;color:var(--t3);text-align:center;padding:14px;background:rgba(0,0,0,0.02);border-radius:12px;border:1px dashed var(--bd2);}

          .skel{background:linear-gradient(90deg,#f0eeeb 25%,#e7e5e0 50%,#f0eeeb 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:22px;height:155px;border:1px solid var(--bd);}

          .empty{text-align:center;padding:70px 20px;}
          .empty-icon{font-size:56px;display:block;margin-bottom:16px;}
          .empty-title{font-family:'Fraunces',serif;font-size:20px;font-weight:700;color:var(--t2);margin-bottom:8px;}
          .empty-sub{font-size:14px;color:var(--t3);}

          .footer{margin:8px 20px 0;background:var(--card);border:1px solid var(--bd);border-radius:20px;padding:18px 20px;display:flex;align-items:center;gap:14px;box-shadow:0 1px 4px rgba(0,0,0,0.04);}
          .footer-logo{width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#6366F1,#4F46E5);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;box-shadow:0 4px 14px rgba(99,102,241,0.28);}
          .footer-name{font-family:'Fraunces',serif;font-size:14px;font-weight:700;color:var(--t1);}
          .footer-sub{font-size:11px;color:var(--t2);margin-top:2px;}
          .footer-heart{margin-left:auto;font-size:20px;animation:heartbeat 1.8s ease-in-out infinite;}

          .toast{position:fixed;bottom:90px;left:50%;transform:translateX(-50%) translateY(20px);background:rgba(17,17,16,0.9);border-radius:100px;padding:10px 22px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:#fff;white-space:nowrap;z-index:500;opacity:0;transition:opacity 0.25s,transform 0.25s;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,0.15);}
          .toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
        `}</style>

        <div className="bg-tex"/>
        <div className={`toast ${toastMsg?"show":""}`}>{toastMsg}</div>

        <div className="page">
          <div className="topbar">
            <div className="trow">
              <Link to={-1} className="back">‹</Link>
              <div className="tinfo">
                <div className="title-row">
                  <span className="ttitle">Papers</span>
                  {!loading && <span className="count-chip">{papers.length}</span>}
                </div>
                <div className="tsub">{loading?"Loading…":`${filtered.length} paper${filtered.length!==1?"s":""} found`}</div>
              </div>
            </div>
          </div>

          <div className="search-wrap">
            <div className="sbox">
              <span className="s-ico">🔍</span>
              <input className="s-in" placeholder="Search papers…" value={search} onChange={e=>setSearch(e.target.value)}/>
              {search && <button className="s-clr" onClick={()=>setSearch("")}>✕</button>}
            </div>
          </div>

          {!loading && years.length>1 && (
            <div className="year-row">
              {years.map(y=>(
                <button key={y} className={`ypill ${activeYear===y?"active":""}`} onClick={()=>setActiveYear(y)}>
                  {y==="All"?"✦ All Years":y}
                </button>
              ))}
            </div>
          )}

          <div className="sec-bar">
            <span className="sec-title">{activeYear==="All"?"All Papers":`Year ${activeYear}`}</span>
            {!loading && <span className="sec-count">{filtered.length} papers</span>}
          </div>

          <div className="papers">
            {loading && Array(3).fill(0).map((_,i)=><div key={i} className="skel" style={{animationDelay:`${i*0.1}s`}}/>)}
            {!loading && filtered.map((paper,i)=>(
              <div key={paper.id} className="pcard" style={{animationDelay:`${i*0.07}s`}}>
                <div className="pcard-head">
                  <div className="year-block">
                    <span className="year-big">{paper.year}</span>
                    <span className="year-lbl">Year</span>
                  </div>
                  <div className="head-right">
                    <div className="badge-row">
                      <span className="badge b-qp">Q·Paper</span>
                      {paper.pdf && <span className="badge b-pdf">PDF ✓</span>}
                    </div>
                    <button
                      className={`bm-btn ${isBookmarked(paper.id)?"saved":""}`}
                      onClick={()=>toggleBookmark(paper)}
                      title={isBookmarked(paper.id)?"Remove bookmark":"Save paper"}
                    >
                      {isBookmarked(paper.id) ? "⭐" : "☆"}
                    </button>
                  </div>
                </div>
                <div className="pcard-body">
                  <div className="paper-title">{paper.title}</div>
                  {paper.pdf ? (
                    <div className="actions">
                      <a href={paper.pdf} target="_blank" rel="noopener noreferrer" className="btn btn-view">👁 View PDF</a>
                      <button onClick={()=>handleDownload(paper)} disabled={downloading===paper.id} className="btn btn-dl">
                        {downloading===paper.id?"⏳ Saving…":"⬇ Download"}
                      </button>
                    </div>
                  ) : (
                    <div className="no-pdf">📭 PDF not yet available</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!loading && filtered.length===0 && (
            <div className="empty">
              <span className="empty-icon">{search?"🔍":"📭"}</span>
              <div className="empty-title">{search?"Nothing found":"No papers yet"}</div>
              <div className="empty-sub">{search?`No results for "${search}"`:"Check back soon!"}</div>
            </div>
          )}

          <div className="footer">
            <div className="footer-logo">⭐</div>
            <div><div className="footer-name">SFI KOTTAKKAL LC</div><div className="footer-sub">Made with love for students</div></div>
            <div className="footer-heart">❤️</div>
          </div>
        </div>
      </div>
      <BottomNav/>
    </>
  );
}
