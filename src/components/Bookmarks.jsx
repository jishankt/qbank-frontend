import { useState } from "react";
import { Link } from "react-router-dom";
import { BottomNav } from "./Classes";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem("bookmarks") || "[]"));
  const [downloading, setDownloading] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2200);
  };

  const remove = (id) => {
    const next = bookmarks.filter(b => b.id !== id);
    setBookmarks(next);
    localStorage.setItem("bookmarks", JSON.stringify(next));
    showToast("Removed from saved ✕");
  };

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
    } catch { alert("Download failed."); }
    finally { setDownloading(null); }
  };

  return (
    <>
      <div className="root">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          :root{--g1:rgba(255,255,255,0.06);--gb:rgba(255,255,255,0.11);--t1:rgba(255,255,255,0.95);--t2:rgba(255,255,255,0.52);--t3:rgba(255,255,255,0.26);--ac:#C084FC;--green:#34D399;--blue:#60A5FA;--bg:#050510;}
          html,body{background:var(--bg);-webkit-font-smoothing:antialiased;overscroll-behavior:none;}
          .root{min-height:100vh;min-height:100dvh;background:var(--bg);font-family:'Outfit',sans-serif;color:var(--t1);overflow-x:hidden;padding-bottom:calc(max(env(safe-area-inset-bottom),14px) + 68px);}

          .scene{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;}
          .o1{position:absolute;width:420px;height:420px;top:-80px;left:-80px;border-radius:50%;background:radial-gradient(circle,#7C3AED,#4F46E5,transparent 70%);filter:blur(100px);opacity:0.28;animation:drift 18s ease-in-out infinite alternate;}
          .o2{position:absolute;width:340px;height:340px;bottom:15%;right:-60px;border-radius:50%;background:radial-gradient(circle,#F59E0B,#EC4899,transparent 70%);filter:blur(100px);opacity:0.2;animation:drift 22s ease-in-out infinite alternate;}
          @keyframes drift{0%{transform:translate(0,0)}100%{transform:translate(30px,-30px)}}
          .grid-bg{position:fixed;inset:0;pointer-events:none;z-index:1;opacity:0.025;background-image:linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px);background-size:60px 60px;}
          .grain{position:fixed;inset:0;pointer-events:none;z-index:1;opacity:0.04;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:256px;}
          .page{position:relative;z-index:2;animation:pageIn 0.5s ease 0.1s both;}
          @keyframes pageIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

          .topbar{background:rgba(5,5,16,0.8);border-bottom:1px solid var(--gb);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);padding:max(env(safe-area-inset-top),52px) 20px 24px;position:sticky;top:0;z-index:20;}
          .brand-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;}
          .brand-pill{display:inline-flex;align-items:center;gap:8px;background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.25);border-radius:100px;padding:5px 14px 5px 6px;}
          .brand-cube{width:22px;height:22px;border-radius:7px;background:linear-gradient(135deg,#A855F7,#6366F1);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:11px;font-weight:800;color:#fff;box-shadow:0 0 12px rgba(168,85,247,0.5);}
          .brand-text{font-size:11px;font-weight:600;color:var(--ac);letter-spacing:0.1em;text-transform:uppercase;}
          .page-title{font-family:'Syne',sans-serif;font-size:32px;font-weight:800;letter-spacing:-0.8px;line-height:1.1;margin-bottom:6px;}
          .page-title span{background:linear-gradient(90deg,#C084FC,#818CF8,#67E8F9);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}
          .page-sub{font-size:14px;color:var(--t2);}

          .count-banner{margin:14px 20px 0;background:linear-gradient(135deg,rgba(168,85,247,0.14),rgba(99,102,241,0.09));border:1px solid rgba(168,85,247,0.22);border-radius:16px;padding:14px 18px;display:flex;align-items:center;gap:12px;backdrop-filter:blur(12px);}
          .count-icon{font-size:28px;}
          .count-val{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;background:linear-gradient(135deg,#fff,#C084FC);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}
          .count-lbl{font-size:12px;color:var(--t2);margin-top:2px;}
          .clear-btn{margin-left:auto;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);border-radius:10px;padding:8px 14px;font-family:'Outfit',sans-serif;font-size:12px;font-weight:700;color:#FCA5A5;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:all 0.2s;}
          .clear-btn:active{background:rgba(239,68,68,0.2);transform:scale(0.95);}

          .sec-bar{display:flex;align-items:center;justify-content:space-between;padding:18px 20px 12px;}
          .sec-title{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;color:var(--t2);text-transform:uppercase;letter-spacing:0.14em;display:flex;align-items:center;gap:8px;}
          .sec-title::before{content:'';display:block;width:14px;height:2px;background:linear-gradient(90deg,#C084FC,#818CF8);border-radius:2px;}

          .list{padding:0 20px 20px;display:flex;flex-direction:column;gap:10px;}

          .bm-card{background:var(--g1);border:1px solid var(--gb);backdrop-filter:blur(16px);border-radius:20px;overflow:hidden;animation:cardIn 0.35s ease both;}
          @keyframes cardIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

          .bm-head{padding:14px 18px;border-bottom:1px solid var(--gb);background:rgba(255,255,255,0.025);display:flex;align-items:center;justify-content:space-between;position:relative;overflow:hidden;}
          .bm-head::after{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent 10%,rgba(192,132,252,0.5) 50%,transparent 90%);}
          .bm-year{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;background:linear-gradient(135deg,#E9D5FF,#C084FC);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}
          .bm-year-lbl{font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:0.1em;}
          .del-btn{width:32px;height:32px;border-radius:9px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:all 0.2s;color:#FCA5A5;}
          .del-btn:active{background:rgba(239,68,68,0.25);transform:scale(0.88);}

          .bm-body{padding:14px 18px 16px;}
          .bm-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;line-height:1.5;margin-bottom:12px;color:rgba(255,255,255,0.9);}
          .actions{display:flex;gap:8px;}
          .btn{flex:1;padding:12px 10px;border-radius:12px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all 0.2s;text-decoration:none;-webkit-tap-highlight-color:transparent;}
          .btn-view{background:rgba(96,165,250,0.1);border:1px solid rgba(96,165,250,0.22);color:var(--blue);}
          .btn-view:active{background:rgba(96,165,250,0.22);transform:scale(0.95);}
          .btn-dl{background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.22);color:var(--green);}
          .btn-dl:active{background:rgba(52,211,153,0.22);transform:scale(0.95);}
          .btn:disabled{opacity:0.35;cursor:not-allowed;transform:none!important;}

          .empty{text-align:center;padding:80px 20px;}
          .empty-icon{font-size:72px;display:block;margin-bottom:20px;filter:drop-shadow(0 0 30px rgba(168,85,247,0.3));}
          .empty-title{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:var(--t2);margin-bottom:8px;}
          .empty-sub{font-size:14px;color:var(--t3);margin-bottom:28px;}
          .go-home{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#7C3AED,#4F46E5);border:none;border-radius:14px;padding:13px 24px;font-family:'Outfit',sans-serif;font-size:14px;font-weight:700;color:#fff;text-decoration:none;cursor:pointer;box-shadow:0 4px 20px rgba(124,58,237,0.4);-webkit-tap-highlight-color:transparent;transition:transform 0.2s;}
          .go-home:active{transform:scale(0.95);}

          .toast{position:fixed;bottom:90px;left:50%;transform:translateX(-50%) translateY(20px);background:rgba(30,10,50,0.95);border:1px solid rgba(192,132,252,0.3);backdrop-filter:blur(20px);border-radius:100px;padding:10px 22px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;color:var(--t1);white-space:nowrap;z-index:500;opacity:0;transition:opacity 0.25s,transform 0.25s;pointer-events:none;box-shadow:0 8px 32px rgba(0,0,0,0.4);}
          .toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
        `}</style>

        <div className="scene"><div className="o1"/><div className="o2"/></div>
        <div className="grid-bg"/><div className="grain"/>
        <div className={`toast ${toastMsg?"show":""}`}>{toastMsg}</div>

        <div className="page">
          <div className="topbar">
            <div className="brand-row">
              <div className="brand-pill">
                <div className="brand-cube">Q</div>
                <span className="brand-text">Question Bank</span>
              </div>
            </div>
            <div className="page-title">Your <span>Saved</span><br/>Papers.</div>
            <div className="page-sub">All your bookmarked papers in one place</div>
          </div>

          {bookmarks.length > 0 && (
            <div className="count-banner">
              <span className="count-icon">⭐</span>
              <div>
                <div className="count-val">{bookmarks.length}</div>
                <div className="count-lbl">Saved Paper{bookmarks.length!==1?"s":""}</div>
              </div>
              <button className="clear-btn" onClick={()=>{ setBookmarks([]); localStorage.removeItem("bookmarks"); showToast("All cleared"); }}>
                Clear All
              </button>
            </div>
          )}

          {bookmarks.length > 0 && (
            <div className="sec-bar">
              <span className="sec-title">Saved Papers</span>
            </div>
          )}

          <div className="list">
            {bookmarks.map((paper,i)=>(
              <div key={paper.id} className="bm-card" style={{animationDelay:`${i*0.07}s`}}>
                <div className="bm-head">
                  <div style={{display:"flex",alignItems:"baseline",gap:"6px"}}>
                    <span className="bm-year">{paper.year}</span>
                    <span className="bm-year-lbl">Year</span>
                  </div>
                  <button className="del-btn" onClick={()=>remove(paper.id)} title="Remove">✕</button>
                </div>
                <div className="bm-body">
                  <div className="bm-title">{paper.title}</div>
                  {paper.pdf ? (
                    <div className="actions">
                      <a href={paper.pdf} target="_blank" rel="noopener noreferrer" className="btn btn-view">👁 View PDF</a>
                      <button onClick={()=>handleDownload(paper)} disabled={downloading===paper.id} className="btn btn-dl">
                        {downloading===paper.id?"⏳ Saving…":"⬇ Download"}
                      </button>
                    </div>
                  ) : (
                    <div style={{fontSize:"13px",color:"var(--t3)",padding:"10px",textAlign:"center",background:"rgba(255,255,255,0.02)",borderRadius:"10px",border:"1px dashed rgba(255,255,255,0.1)"}}>
                      📭 PDF not available
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {bookmarks.length === 0 && (
            <div className="empty">
              <span className="empty-icon">⭐</span>
              <div className="empty-title">No saved papers yet</div>
              <div className="empty-sub">Tap ☆ on any paper to save it here for quick access</div>
              <Link to="/" className="go-home">🏠 Browse Papers</Link>
            </div>
          )}
        </div>
      </div>
      <BottomNav/>
    </>
  );
}
