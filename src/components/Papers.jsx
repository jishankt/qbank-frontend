import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";
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
    API.get(`papers/${subjectId}/`).then(r => setPapers(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [subjectId]);

  const years = ["All", ...new Set(papers.map(p => p.year).sort((a, b) => b - a))];
  const filtered = papers.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) &&
    (activeYear === "All" || p.year === activeYear)
  );

  const isBookmarked = (id) => bookmarks.some(b => b.id === id);

  const toggleBookmark = (paper) => {
    let next;
    if (isBookmarked(paper.id)) {
      next = bookmarks.filter(b => b.id !== paper.id);
      showToast("Removed from saved");
    } else {
      next = [...bookmarks, { id: paper.id, title: paper.title, year: paper.year, pdf: paper.pdf, subjectId }];
      showToast("Saved ⭐");
    }
    setBookmarks(next);
    localStorage.setItem("bookmarks", JSON.stringify(next));
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2200);
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
    } catch { alert("Download failed. Try opening the PDF manually."); }
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
          .bg-glow { position:fixed; top:-80px; right:-60px; width:280px; height:280px; border-radius:50%; background:radial-gradient(circle,rgba(99,102,241,0.07),transparent 70%); pointer-events:none; z-index:0; }

          .page { position:relative; z-index:2; animation:pageIn 0.4s ease both; }
          @keyframes pageIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

          .topbar { background:rgba(250,250,248,0.92); border-bottom:1px solid var(--border); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); padding:max(env(safe-area-inset-top),52px) 20px 18px; position:sticky; top:0; z-index:20; }
          .trow { display:flex; align-items:center; gap:12px; }
          .back { width:40px; height:40px; border-radius:13px; flex-shrink:0; background:var(--surface); border:1.5px solid var(--border2); display:flex; align-items:center; justify-content:center; font-size:20px; color:var(--t1); text-decoration:none; box-shadow:0 1px 4px rgba(0,0,0,0.06); transition:transform 0.2s; -webkit-tap-highlight-color:transparent; }
          .back:active { transform:scale(0.88); }
          .tinfo { flex:1; min-width:0; }
          .title-row { display:flex; align-items:center; gap:8px; }
          .ttitle { font-family:'Playfair Display',serif; font-size:24px; font-weight:800; letter-spacing:-0.4px; }
          .count-chip { font-size:12px; font-weight:700; color:#6366F1; background:#EEF2FF; border:1px solid #C7D2FE; padding:3px 10px; border-radius:100px; }
          .tsub { font-size:12px; color:var(--t2); margin-top:2px; }

          .search-wrap { padding:14px 20px 0; }
          .sbox { display:flex; align-items:center; gap:10px; background:var(--surface); border:1.5px solid var(--border2); border-radius:16px; padding:0 16px; box-shadow:0 1px 4px rgba(0,0,0,0.04); transition:border-color 0.2s, box-shadow 0.2s; }
          .sbox:focus-within { border-color:#6366F1; box-shadow:0 0 0 4px rgba(99,102,241,0.08); }
          .s-ico { font-size:15px; opacity:0.3; flex-shrink:0; }
          .s-in { flex:1; border:none; outline:none; padding:14px 0; font-family:'DM Sans',sans-serif; font-size:15px; color:var(--t1); background:transparent; }
          .s-in::placeholder { color:var(--t4); }
          .s-clr { background:#F3F4F6; border:1px solid var(--border2); color:var(--t2); width:22px; height:22px; border-radius:6px; font-size:11px; display:flex; align-items:center; justify-content:center; cursor:pointer; -webkit-tap-highlight-color:transparent; }

          .year-row { display:flex; gap:8px; overflow-x:auto; padding:12px 20px 0; scrollbar-width:none; }
          .year-row::-webkit-scrollbar { display:none; }
          .ypill { background:var(--surface); border:1.5px solid var(--border2); border-radius:100px; padding:8px 18px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; color:var(--t2); cursor:pointer; white-space:nowrap; flex-shrink:0; transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1); -webkit-tap-highlight-color:transparent; box-shadow:0 1px 4px rgba(0,0,0,0.04); }
          .ypill.active { background:#1C1C1E; border-color:#1C1C1E; color:#fff; font-weight:700; box-shadow:0 4px 14px rgba(0,0,0,0.18); }
          .ypill:not(.active):active { transform:scale(0.93); }

          .sec-bar { display:flex; align-items:center; justify-content:space-between; padding:16px 20px 10px; }
          .sec-title { font-size:11px; font-weight:700; color:var(--t3); text-transform:uppercase; letter-spacing:0.14em; }
          .sec-count { font-size:12px; color:var(--t2); }

          .papers { padding:0 20px 20px; display:flex; flex-direction:column; gap:12px; }

          .pcard { background:var(--surface); border:1.5px solid var(--border2); border-radius:22px; overflow:hidden; transition:transform 0.15s; -webkit-tap-highlight-color:transparent; animation:cardIn 0.35s ease both; box-shadow:0 2px 12px rgba(0,0,0,0.05); }
          .pcard:active { transform:scale(0.99); }
          @keyframes cardIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

          .pcard-head { padding:16px 20px 14px; border-bottom:1px solid var(--border); background:#F9FAFB; display:flex; align-items:center; justify-content:space-between; position:relative; }
          .year-block { display:flex; align-items:baseline; gap:6px; }
          .year-big { font-family:'Playfair Display',serif; font-size:32px; font-weight:800; letter-spacing:-1px; line-height:1; color:var(--t1); }
          .year-lbl { font-size:10px; font-weight:600; color:var(--t3); text-transform:uppercase; letter-spacing:0.1em; }

          .head-right { display:flex; align-items:center; gap:8px; }
          .badge-row { display:flex; gap:6px; align-items:center; }
          .badge { font-size:10px; font-weight:700; padding:5px 10px; border-radius:8px; text-transform:uppercase; letter-spacing:0.06em; }
          .b-qp { background:#F3F4F6; border:1px solid var(--border2); color:var(--t2); }
          .b-pdf { background:#D1FAE5; border:1px solid #6EE7B7; color:#065F46; }

          .bm-btn { width:34px; height:34px; border-radius:10px; flex-shrink:0; background:var(--surface); border:1.5px solid var(--border2); display:flex; align-items:center; justify-content:center; font-size:18px; cursor:pointer; transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1); -webkit-tap-highlight-color:transparent; }
          .bm-btn.saved { background:#FEF9C3; border-color:#FDE047; }
          .bm-btn:active { transform:scale(0.82); }

          .pcard-body { padding:16px 20px 18px; }
          .paper-title { font-family:'Playfair Display',serif; font-size:15px; font-weight:700; line-height:1.5; letter-spacing:-0.2px; margin-bottom:16px; color:var(--t1); }

          .actions { display:flex; gap:8px; }
          .btn { flex:1; padding:12px 10px; border-radius:13px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px; transition:all 0.2s; text-decoration:none; -webkit-tap-highlight-color:transparent; }
          .btn-view { background:#EFF6FF; border:1.5px solid #BFDBFE; color:#1D4ED8; }
          .btn-view:active { background:#DBEAFE; transform:scale(0.96); }
          .btn-dl { background:#ECFDF5; border:1.5px solid #A7F3D0; color:#065F46; }
          .btn-dl:active { background:#D1FAE5; transform:scale(0.96); }
          .btn:disabled { opacity:0.4; cursor:not-allowed; transform:none!important; }

          .no-pdf { font-size:13px; color:var(--t3); text-align:center; padding:14px; background:#F9FAFB; border-radius:12px; border:1px dashed var(--border2); }

          .skel { background:linear-gradient(90deg,#F9FAFB 25%,#F3F4F6 50%,#F9FAFB 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:22px; height:158px; border:1px solid var(--border); }
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

          .toast { position:fixed; bottom:90px; left:50%; transform:translateX(-50%) translateY(16px); background:#1C1C1E; border-radius:100px; padding:10px 22px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; color:#fff; white-space:nowrap; z-index:500; opacity:0; transition:opacity 0.25s, transform 0.25s; pointer-events:none; box-shadow:0 8px 24px rgba(0,0,0,0.18); }
          .toast.show { opacity:1; transform:translateX(-50%) translateY(0); }
        `}</style>

        <div className="bg-texture" />
        <div className="bg-glow" />
        <div className={`toast ${toastMsg ? "show" : ""}`}>{toastMsg}</div>

        <div className="page">
          <div className="topbar">
            <div className="trow">
              <Link to={-1} className="back">‹</Link>
              <div className="tinfo">
                <div className="title-row">
                  <span className="ttitle">Papers</span>
                  {!loading && <span className="count-chip">{papers.length}</span>}
                </div>
                <div className="tsub">{loading ? "Loading…" : `${filtered.length} paper${filtered.length !== 1 ? "s" : ""} found`}</div>
              </div>
            </div>
          </div>

          <div className="search-wrap">
            <div className="sbox">
              <span className="s-ico">🔍</span>
              <input className="s-in" placeholder="Search papers…" value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button className="s-clr" onClick={() => setSearch("")}>✕</button>}
            </div>
          </div>

          {!loading && years.length > 1 && (
            <div className="year-row">
              {years.map(y => (
                <button key={y} className={`ypill ${activeYear === y ? "active" : ""}`} onClick={() => setActiveYear(y)}>
                  {y === "All" ? "All Years" : y}
                </button>
              ))}
            </div>
          )}

          <div className="sec-bar">
            <span className="sec-title">{activeYear === "All" ? "All Papers" : `Year ${activeYear}`}</span>
            {!loading && <span className="sec-count">{filtered.length} papers</span>}
          </div>

          <div className="papers">
            {loading && Array(3).fill(0).map((_, i) => (
              <div key={i} className="skel" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
            {!loading && filtered.map((paper, i) => (
              <div key={paper.id} className="pcard" style={{ animationDelay: `${i * 0.07}s` }}>
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
                    <button className={`bm-btn ${isBookmarked(paper.id) ? "saved" : ""}`}
                      onClick={() => toggleBookmark(paper)}
                      title={isBookmarked(paper.id) ? "Remove bookmark" : "Save paper"}>
                      {isBookmarked(paper.id) ? "⭐" : "☆"}
                    </button>
                  </div>
                </div>
                <div className="pcard-body">
                  <div className="paper-title">{paper.title}</div>
                  {paper.pdf ? (
                    <div className="actions">
                      <a href={paper.pdf} target="_blank" rel="noopener noreferrer" className="btn btn-view">👁 View PDF</a>
                      <button onClick={() => handleDownload(paper)} disabled={downloading === paper.id} className="btn btn-dl">
                        {downloading === paper.id ? "⏳ Saving…" : "⬇ Download"}
                      </button>
                    </div>
                  ) : (
                    <div className="no-pdf">📭 PDF not yet available</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!loading && filtered.length === 0 && (
            <div className="empty">
              <span className="empty-icon">{search ? "🔍" : "📭"}</span>
              <div className="empty-title">{search ? "Nothing found" : "No papers yet"}</div>
              <div className="empty-sub">{search ? `No results for "${search}"` : "Check back soon!"}</div>
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
