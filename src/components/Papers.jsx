import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

export default function Papers() {
  const { subjectId } = useParams();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [downloading, setDownloading] = useState(null);
  const [activeYear, setActiveYear] = useState("All");

  useEffect(() => {
    setLoading(true);
    API.get(`papers/${subjectId}/`).then(r=>setPapers(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  }, [subjectId]);

  const years = ["All", ...new Set(papers.map(p=>p.year).sort((a,b)=>b-a))];
  const filtered = papers.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) &&
    (activeYear === "All" || p.year === activeYear)
  );

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
      setTimeout(()=>URL.revokeObjectURL(url), 5000);
    } catch { alert("Download failed. Try opening the PDF manually."); }
    finally { setDownloading(null); }
  };

  return (
    <div className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --g1: rgba(255,255,255,0.06); --gb: rgba(255,255,255,0.11);
          --t1: rgba(255,255,255,0.95); --t2: rgba(255,255,255,0.52); --t3: rgba(255,255,255,0.26);
          --ac: #C084FC; --green: #34D399; --blue: #60A5FA; --bg: #050510;
        }
        html,body { background: var(--bg); -webkit-font-smoothing: antialiased; overscroll-behavior: none; }
        .root {
          min-height: 100vh; min-height: 100dvh; background: var(--bg);
          font-family: 'Outfit', sans-serif; color: var(--t1);
          overflow-x: hidden; padding-bottom: max(env(safe-area-inset-bottom), 40px);
        }

        .scene { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .o { position: absolute; border-radius: 50%; filter: blur(100px); animation: float var(--d,14s) ease-in-out infinite alternate; }
        .o1 { width: 450px; height: 450px; top: -100px; left: -100px; background: radial-gradient(circle,#4F46E5,#7C3AED,transparent 70%); opacity: 0.28; --d:18s; }
        .o2 { width: 350px; height: 350px; bottom: 15%; right: -70px; background: radial-gradient(circle,#EC4899,#8B5CF6,transparent 70%); opacity: 0.22; --d:22s; }
        @keyframes float { 0%{transform:translate(0,0)}100%{transform:translate(25px,-25px)} }

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
        .tinfo { flex: 1; min-width: 0; }
        .title-row { display: flex; align-items: center; gap: 8px; }
        .ttitle { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; letter-spacing: -0.4px; }
        .count-chip {
          font-size: 12px; font-weight: 700; color: var(--ac);
          background: rgba(168,85,247,0.12); border: 1px solid rgba(168,85,247,0.22);
          padding: 3px 11px; border-radius: 100px;
        }
        .tsub { font-size: 12px; color: var(--t2); margin-top: 2px; }

        /* Search */
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
        .s-clr { border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.07); color: var(--t2); width: 22px; height: 22px; border-radius: 6px; font-size: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; -webkit-tap-highlight-color: transparent; }

        /* Year pills */
        .year-row { display: flex; gap: 8px; overflow-x: auto; padding: 12px 20px 0; scrollbar-width: none; }
        .year-row::-webkit-scrollbar { display: none; }
        .ypill {
          background: var(--g1); border: 1px solid var(--gb);
          backdrop-filter: blur(10px); border-radius: 100px;
          padding: 8px 18px; font-family: 'Outfit', sans-serif;
          font-size: 13px; font-weight: 600; color: var(--t2);
          cursor: pointer; white-space: nowrap; flex-shrink: 0;
          transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
          -webkit-tap-highlight-color: transparent;
        }
        .ypill.active {
          background: linear-gradient(135deg, #7C3AED, #4F46E5); border-color: transparent;
          color: #fff; font-weight: 700;
          box-shadow: 0 4px 18px rgba(124,58,237,0.4), 0 0 0 1px rgba(168,85,247,0.3);
        }
        .ypill:not(.active):active { transform: scale(0.93); }

        .sec-bar { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px 10px; }
        .sec-title { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; color: var(--t2); text-transform: uppercase; letter-spacing: 0.14em; display: flex; align-items: center; gap: 8px; }
        .sec-title::before { content:''; display: block; width: 14px; height: 2px; background: linear-gradient(90deg, #C084FC, #818CF8); border-radius: 2px; }
        .sec-count { font-size: 12px; color: var(--ac); }

        /* Papers */
        .papers { padding: 0 20px 20px; display: flex; flex-direction: column; gap: 12px; }

        .pcard {
          background: var(--g1); border: 1px solid var(--gb);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border-radius: 22px; overflow: hidden;
          transition: transform 0.15s; -webkit-tap-highlight-color: transparent;
          animation: cardIn 0.35s ease both;
        }
        .pcard:active { transform: scale(0.99); }
        @keyframes cardIn { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }

        .pcard-head {
          padding: 18px 20px 16px;
          border-bottom: 1px solid var(--gb);
          background: rgba(255,255,255,0.025);
          position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: space-between;
        }
        .pcard-head::after {
          content:''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 10%, rgba(192,132,252,0.5) 50%, transparent 90%);
        }
        .pcard-blob {
          position: absolute; right: -20px; top: -20px;
          width: 90px; height: 90px; border-radius: 50%;
          background: radial-gradient(circle, rgba(168,85,247,0.18), transparent);
          pointer-events: none;
        }

        .year-block { display: flex; align-items: baseline; gap: 6px; }
        .year-big {
          font-family: 'Syne', sans-serif; font-size: 34px; font-weight: 800;
          letter-spacing: -1px; line-height: 1;
          background: linear-gradient(135deg, #E9D5FF, #C084FC, #818CF8);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
        }
        .year-lbl { font-size: 10px; font-weight: 600; color: var(--t3); text-transform: uppercase; letter-spacing: 0.1em; }

        .badge-row { display: flex; gap: 6px; align-items: center; }
        .badge {
          font-size: 10px; font-weight: 800; padding: 5px 10px;
          border-radius: 7px; text-transform: uppercase; letter-spacing: 0.07em;
        }
        .b-qp { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); color: var(--t2); }
        .b-pdf { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); color: var(--green); }

        .pcard-body { padding: 16px 20px 18px; }
        .paper-title {
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
          line-height: 1.5; letter-spacing: -0.2px; margin-bottom: 16px;
          color: rgba(255,255,255,0.9);
        }

        .actions { display: flex; gap: 8px; }
        .btn {
          flex: 1; padding: 13px 10px; border-radius: 13px;
          font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          gap: 7px; transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
          text-decoration: none; -webkit-tap-highlight-color: transparent;
        }
        .btn-view {
          background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.22); color: var(--blue);
        }
        .btn-view:active { background: rgba(96,165,250,0.22); transform: scale(0.95); }
        .btn-dl {
          background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.22); color: var(--green);
        }
        .btn-dl:active { background: rgba(52,211,153,0.22); transform: scale(0.95); }
        .btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none !important; }

        .no-pdf {
          font-size: 13px; color: var(--t3); text-align: center;
          padding: 14px; background: rgba(255,255,255,0.02);
          border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1);
        }

        .skel {
          background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 75%);
          background-size: 200% 100%; animation: shimmer 1.5s infinite;
          border-radius: 22px; height: 155px; border: 1px solid var(--gb);
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
            <Link to={-1} className="back">‹</Link>
            <div className="tinfo">
              <div className="title-row">
                <span className="ttitle">Papers</span>
                {!loading && <span className="count-chip">{papers.length}</span>}
              </div>
              <div className="tsub">{loading ? "Loading…" : `${filtered.length} paper${filtered.length!==1?"s":""} found`}</div>
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

        {!loading && years.length > 1 && (
          <div className="year-row">
            {years.map(y=>(
              <button key={y} className={`ypill ${activeYear===y?"active":""}`} onClick={()=>setActiveYear(y)}>
                {y==="All" ? "✦ All Years" : y}
              </button>
            ))}
          </div>
        )}

        <div className="sec-bar">
          <span className="sec-title">{activeYear==="All" ? "All Papers" : `Year ${activeYear}`}</span>
          {!loading && <span className="sec-count">{filtered.length} papers</span>}
        </div>

        <div className="papers">
          {loading && Array(3).fill(0).map((_,i)=><div key={i} className="skel" style={{animationDelay:`${i*0.1}s`}}/>)}
          {!loading && filtered.map((paper, i) => (
            <div key={paper.id} className="pcard" style={{animationDelay:`${i*0.07}s`}}>
              <div className="pcard-head">
                <div className="pcard-blob"/>
                <div className="year-block">
                  <span className="year-big">{paper.year}</span>
                  <span className="year-lbl">Year</span>
                </div>
                <div className="badge-row">
                  <span className="badge b-qp">Q·Paper</span>
                  {paper.pdf && <span className="badge b-pdf">PDF ✓</span>}
                </div>
              </div>
              <div className="pcard-body">
                <div className="paper-title">{paper.title}</div>
                {paper.pdf ? (
                  <div className="actions">
                    <a href={paper.pdf} target="_blank" rel="noopener noreferrer" className="btn btn-view">
                      👁 View PDF
                    </a>
                    <button onClick={()=>handleDownload(paper)} disabled={downloading===paper.id} className="btn btn-dl">
                      {downloading===paper.id ? "⏳ Saving…" : "⬇ Download"}
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
  );
}
