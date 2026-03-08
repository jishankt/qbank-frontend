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
    showToast("Removed from saved");
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
      a.href = url; a.download = `${paper.title}_${paper.year}.pdf`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      showToast("Download started ⬇");
    } catch { alert("Download failed."); }
    finally { setDownloading(null); }
  };

  return (
    <>
      <div className="root">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
          *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
          :root { --bg:#FAFAF8; --surface:#FFFFFF; --border:#F0F0EE; --border2:#E5E5E3; --t1:#1C1C1E; --t2:#6B7280; --t3:#9CA3AF; --t4:#D1D5DB; }
          html,body { background:var(--bg); -webkit-font-smoothing:antialiased; overscroll-behavior:none; }
          .root { min-height:100vh; min-height:100dvh; background:var(--bg); font-family:'DM Sans',sans-serif; color:var(--t1); overflow-x:hidden; padding-bottom:calc(max(env(safe-area-inset-bottom),14px) + 72px); }

          .bg-texture { position:fixed; inset:0; z-index:0; pointer-events:none; background-image:radial-gradient(circle,#E5E7EB 1px,transparent 1px); background-size:32px 32px; opacity:0.5; }
          .page { position:relative; z-index:2; animation:pageIn 0.4s ease both; }
          @keyframes pageIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

          .topbar { background:rgba(250,250,248,0.92); border-bottom:1px solid var(--border); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); padding:max(env(safe-area-inset-top),52px) 20px 24px; position:sticky; top:0; z-index:20; }
          .brand-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
          .brand-pill { display:inline-flex; align-items:center; gap:8px; background:#1C1C1E; border-radius:100px; padding:6px 14px 6px 8px; }
          .brand-cube { width:22px; height:22px; border-radius:7px; background:linear-gradient(135deg,#6366F1,#8B5CF6); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:#fff; }
          .brand-text { font-size:11px; font-weight:600; color:#fff; letter-spacing:0.08em; text-transform:uppercase; }
          .page-title { font-family:'Playfair Display',serif; font-size:34px; font-weight:800; letter-spacing:-0.8px; line-height:1.1; margin-bottom:6px; color:var(--t1); }
          .page-title em { font-style:normal; color:#6366F1; }
          .page-sub { font-size:14px; color:var(--t2); }

          .count-banner { margin:14px 20px 0; background:var(--surface); border:1.5px solid var(--border2); border-radius:18px; padding:14px 18px; display:flex; align-items:center; gap:12px; box-shadow:0 2px 10px rgba(0,0,0,0.05); }
          .count-icon { font-size:26px; }
          .count-val { font-family:'Playfair Display',serif; font-size:22px; font-weight:800; color:var(--t1); }
          .count-lbl { font-size:12px; color:var(--t3); margin-top:2px; }
          .clear-btn { margin-left:auto; background:#FEF2F2; border:1.5px solid #FECACA; border-radius:10px; padding:8px 14px; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:700; color:#B91C1C; cursor:pointer; -webkit-tap-highlight-color:transparent; transition:all 0.2s; }
          .clear-btn:active { background:#FEE2E2; transform:scale(0.95); }

          .sec-bar { display:flex; align-items:center; justify-content:space-between; padding:18px 20px 12px; }
          .sec-title { font-size:11px; font-weight:700; color:var(--t3); text-transform:uppercase; letter-spacing:0.14em; }

          .list { padding:0 20px 20px; display:flex; flex-direction:column; gap:10px; }

          .bm-card { background:var(--surface); border:1.5px solid var(--border2); border-radius:22px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.05); animation:cardIn 0.35s ease both; }
          @keyframes cardIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

          .bm-head { padding:14px 18px; border-bottom:1px solid var(--border); background:#F9FAFB; display:flex; align-items:center; justify-content:space-between; }
          .bm-year { font-family:'Playfair Display',serif; font-size:28px; font-weight:800; color:var(--t1); }
          .bm-year-lbl { font-size:10px; font-weight:600; color:var(--t3); text-transform:uppercase; letter-spacing:0.1em; margin-left:6px; }
          .del-btn { width:32px; height:32px; border-radius:9px; background:#FEF2F2; border:1.5px solid #FECACA; display:flex; align-items:center; justify-content:center; font-size:14px; cursor:pointer; -webkit-tap-highlight-color:transparent; transition:all 0.2s; color:#B91C1C; }
          .del-btn:active { background:#FEE2E2; transform:scale(0.88); }

          .bm-body { padding:14px 18px 16px; }
          .bm-title { font-family:'Playfair Display',serif; font-size:15px; font-weight:700; line-height:1.5; margin-bottom:14px; color:var(--t1); }
          .actions { display:flex; gap:8px; }
          .btn { flex:1; padding:12px 10px; border-radius:13px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; transition:all 0.2s; text-decoration:none; -webkit-tap-highlight-color:transparent; }
          .btn-view { background:#EFF6FF; border:1.5px solid #BFDBFE; color:#1D4ED8; }
          .btn-view:active { background:#DBEAFE; transform:scale(0.96); }
          .btn-dl { background:#ECFDF5; border:1.5px solid #A7F3D0; color:#065F46; }
          .btn-dl:active { background:#D1FAE5; transform:scale(0.96); }
          .btn:disabled { opacity:0.4; cursor:not-allowed; transform:none!important; }

          .empty { text-align:center; padding:80px 20px; }
          .empty-icon { font-size:68px; display:block; margin-bottom:20px; }
          .empty-title { font-family:'Playfair Display',serif; font-size:22px; font-weight:800; color:var(--t2); margin-bottom:8px; }
          .empty-sub { font-size:14px; color:var(--t3); margin-bottom:28px; }
          .go-home { display:inline-flex; align-items:center; gap:8px; background:#1C1C1E; border:none; border-radius:14px; padding:13px 24px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:700; color:#fff; text-decoration:none; cursor:pointer; box-shadow:0 4px 18px rgba(0,0,0,0.14); -webkit-tap-highlight-color:transparent; transition:transform 0.2s; }
          .go-home:active { transform:scale(0.96); }

          .toast { position:fixed; bottom:90px; left:50%; transform:translateX(-50%) translateY(16px); background:#1C1C1E; border-radius:100px; padding:10px 22px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; color:#fff; white-space:nowrap; z-index:500; opacity:0; transition:opacity 0.25s, transform 0.25s; pointer-events:none; box-shadow:0 8px 24px rgba(0,0,0,0.18); }
          .toast.show { opacity:1; transform:translateX(-50%) translateY(0); }
        `}</style>

        <div className="bg-texture" />
        <div className={`toast ${toastMsg ? "show" : ""}`}>{toastMsg}</div>

        <div className="page">
          <div className="topbar">
            <div className="brand-row">
              <div className="brand-pill">
                <div className="brand-cube">Q</div>
                <span className="brand-text">Question Bank</span>
              </div>
            </div>
            <div className="page-title">Your <em>Saved</em><br />Papers.</div>
            <div className="page-sub">All your bookmarked papers in one place</div>
          </div>

          {bookmarks.length > 0 && (
            <div className="count-banner">
              <span className="count-icon">⭐</span>
              <div>
                <div className="count-val">{bookmarks.length}</div>
                <div className="count-lbl">Saved Paper{bookmarks.length !== 1 ? "s" : ""}</div>
              </div>
              <button className="clear-btn" onClick={() => {
                setBookmarks([]); localStorage.removeItem("bookmarks"); showToast("All cleared");
              }}>Clear All</button>
            </div>
          )}

          {bookmarks.length > 0 && (
            <div className="sec-bar">
              <span className="sec-title">Saved Papers</span>
            </div>
          )}

          <div className="list">
            {bookmarks.map((paper, i) => (
              <div key={paper.id} className="bm-card" style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="bm-head">
                  <div>
                    <span className="bm-year">{paper.year}</span>
                    <span className="bm-year-lbl">Year</span>
                  </div>
                  <button className="del-btn" onClick={() => remove(paper.id)} title="Remove">✕</button>
                </div>
                <div className="bm-body">
                  <div className="bm-title">{paper.title}</div>
                  {paper.pdf ? (
                    <div className="actions">
                      <a href={paper.pdf} target="_blank" rel="noopener noreferrer" className="btn btn-view">👁 View PDF</a>
                      <button onClick={() => handleDownload(paper)} disabled={downloading === paper.id} className="btn btn-dl">
                        {downloading === paper.id ? "⏳ Saving…" : "⬇ Download"}
                      </button>
                    </div>
                  ) : (
                    <div style={{ fontSize: "13px", color: "var(--t3)", padding: "12px", textAlign: "center", background: "#F9FAFB", borderRadius: "10px", border: "1px dashed var(--border2)" }}>
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
              <div className="empty-sub">Tap ☆ on any paper to save it here</div>
              <Link to="/" className="go-home">🏠 Browse Papers</Link>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
