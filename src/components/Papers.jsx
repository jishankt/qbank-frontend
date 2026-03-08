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
  const filtered = papers.filter(p => {
    return p.title.toLowerCase().includes(search.toLowerCase()) &&
      (activeYear === "All" || p.year === activeYear);
  });

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
    } catch { alert("Download failed. Please try opening the PDF manually."); }
    finally { setDownloading(null); }
  };

  return (
    <div className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --glass: rgba(255,255,255,0.07); --glass-border: rgba(255,255,255,0.13);
          --text: rgba(255,255,255,0.95); --text2: rgba(255,255,255,0.5); --text3: rgba(255,255,255,0.28);
          --accent: #C084FC; --green: #34D399; --blue: #60A5FA;
        }
        html, body { background: #060612; -webkit-font-smoothing: antialiased; }
        .root {
          min-height: 100vh; min-height: 100dvh; background: #060612;
          font-family: 'Outfit', sans-serif; color: var(--text);
          padding-bottom: max(env(safe-area-inset-bottom), 40px);
          position: relative; overflow-x: hidden;
        }
        .aurora { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .o1 { position: absolute; width: 400px; height: 400px; top: -100px; left: -100px; border-radius: 50%; background: radial-gradient(circle, #4F46E5, #7C3AED); filter: blur(90px); opacity: 0.25; }
        .o2 { position: absolute; width: 300px; height: 300px; bottom: 20%; right: -60px; border-radius: 50%; background: radial-gradient(circle, #EC4899, #8B5CF6); filter: blur(80px); opacity: 0.2; }
        .content { position: relative; z-index: 2; }

        .topbar {
          background: rgba(6,6,18,0.7); border-bottom: 1px solid var(--glass-border);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          padding: max(env(safe-area-inset-top), 52px) 20px 18px;
          position: sticky; top: 0; z-index: 10;
        }
        .topbar-row { display: flex; align-items: center; gap: 12px; }
        .back {
          width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
          background: var(--glass); border: 1px solid var(--glass-border);
          backdrop-filter: blur(10px); display: flex; align-items: center;
          justify-content: center; font-size: 20px; color: var(--accent);
          text-decoration: none; transition: opacity 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .back:active { opacity: 0.5; }
        .topbar-info { flex: 1; min-width: 0; }
        .title-row { display: flex; align-items: center; gap: 8px; }
        .topbar-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; letter-spacing: -0.3px; }
        .count-chip {
          font-size: 12px; font-weight: 600; color: var(--accent);
          background: rgba(168,85,247,0.12); border: 1px solid rgba(168,85,247,0.2);
          padding: 3px 10px; border-radius: 100px;
        }
        .topbar-sub { font-size: 12px; color: var(--text2); margin-top: 2px; }

        .search-wrap { padding: 14px 20px 0; }
        .sbox {
          display: flex; align-items: center; gap: 10px;
          background: var(--glass); border: 1px solid var(--glass-border);
          backdrop-filter: blur(16px); border-radius: 14px; padding: 0 16px;
          transition: border-color 0.2s;
        }
        .sbox:focus-within { border-color: rgba(192,132,252,0.45); box-shadow: 0 0 0 3px rgba(168,85,247,0.1); }
        .s-ico { font-size: 15px; opacity: 0.3; flex-shrink: 0; }
        .s-in { flex: 1; border: none; outline: none; padding: 14px 0; font-family: 'Outfit', sans-serif; font-size: 15px; color: var(--text); background: transparent; }
        .s-in::placeholder { color: var(--text3); }
        .s-clr { border: none; background: none; color: var(--text2); font-size: 14px; padding: 4px; cursor: pointer; -webkit-tap-highlight-color: transparent; }

        .year-row { display: flex; gap: 8px; overflow-x: auto; padding: 12px 20px 0; scrollbar-width: none; }
        .year-row::-webkit-scrollbar { display: none; }
        .ypill {
          background: var(--glass); border: 1px solid var(--glass-border);
          backdrop-filter: blur(10px); border-radius: 100px;
          padding: 7px 16px; font-family: 'Outfit', sans-serif;
          font-size: 13px; font-weight: 600; color: var(--text2);
          cursor: pointer; white-space: nowrap; flex-shrink: 0;
          transition: all 0.15s; -webkit-tap-highlight-color: transparent;
        }
        .ypill.active {
          background: linear-gradient(135deg, #7C3AED, #4F46E5);
          border-color: rgba(124,58,237,0.5); color: #fff; font-weight: 700;
          box-shadow: 0 4px 16px rgba(124,58,237,0.3);
        }
        .ypill:active { transform: scale(0.95); }

        .sec-bar { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px 10px; }
        .sec-title { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; color: var(--text2); text-transform: uppercase; letter-spacing: 0.12em; }
        .sec-count { font-size: 12px; color: var(--accent); }

        .papers { padding: 0 20px 20px; display: flex; flex-direction: column; gap: 10px; }

        .paper {
          background: var(--glass); border: 1px solid var(--glass-border);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border-radius: 20px; overflow: hidden;
          transition: transform 0.15s; -webkit-tap-highlight-color: transparent;
        }
        .paper:active { transform: scale(0.99); }

        .paper-head {
          padding: 16px 18px;
          border-bottom: 1px solid var(--glass-border);
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(255,255,255,0.03);
        }
        .year-block { display: flex; align-items: baseline; gap: 5px; }
        .year-big {
          font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 800;
          letter-spacing: -0.5px; line-height: 1;
          background: linear-gradient(135deg, #C084FC, #818CF8);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
        }
        .year-lbl { font-size: 10px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: 0.1em; }
        .tags { display: flex; gap: 6px; }
        .tag {
          font-size: 10px; font-weight: 700; padding: 4px 10px;
          border-radius: 6px; text-transform: uppercase; letter-spacing: 0.06em;
        }
        .tag-qp { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); color: var(--text2); }
        .tag-pdf { background: rgba(16,185,129,0.2); border: 1px solid rgba(16,185,129,0.3); color: var(--green); }

        .paper-body { padding: 16px 18px 18px; }
        .paper-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; line-height: 1.45; letter-spacing: -0.2px; margin-bottom: 14px; color: var(--text); }

        .actions { display: flex; gap: 8px; }
        .btn {
          flex: 1; padding: 12px 10px; border-radius: 12px;
          font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          gap: 6px; transition: all 0.15s; text-decoration: none;
          -webkit-tap-highlight-color: transparent;
        }
        .btn-view {
          background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.25); color: var(--blue);
        }
        .btn-view:active { background: rgba(96,165,250,0.2); transform: scale(0.97); }
        .btn-dl {
          background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.25); color: var(--green);
        }
        .btn-dl:active { background: rgba(52,211,153,0.2); transform: scale(0.97); }
        .btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none !important; }

        .no-pdf {
          font-size: 13px; color: var(--text3); text-align: center;
          padding: 12px; background: rgba(255,255,255,0.03);
          border-radius: 10px; border: 1px dashed rgba(255,255,255,0.1);
        }

        .skel {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite;
          border-radius: 20px; height: 150px; border: 1px solid var(--glass-border);
        }
        @keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }

        .empty { text-align: center; padding: 64px 20px; }
        .empty-icon { font-size: 52px; display: block; margin-bottom: 14px; }
        .empty-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: var(--text2); margin-bottom: 6px; }
        .empty-sub { font-size: 14px; color: var(--text3); }

        .footer {
          margin: 8px 20px 0; background: var(--glass); border: 1px solid var(--glass-border);
          border-radius: 18px; padding: 16px 18px; backdrop-filter: blur(16px);
          display: flex; align-items: center; gap: 12px;
        }
        .footer-logo { width: 38px; height: 38px; border-radius: 11px; background: linear-gradient(135deg,#7C3AED,#4F46E5); display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; box-shadow: 0 4px 14px rgba(124,58,237,0.3); }
        .footer-name { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: var(--text); }
        .footer-sub { font-size: 11px; color: var(--text2); margin-top: 2px; }
      `}</style>

      <div className="aurora"><div className="o1"/><div className="o2"/></div>
      <div className="content">
        <div className="topbar">
          <div className="topbar-row">
            <Link to={-1} className="back">‹</Link>
            <div className="topbar-info">
              <div className="title-row">
                <span className="topbar-title">Papers</span>
                {!loading && <span className="count-chip">{papers.length}</span>}
              </div>
              <div className="topbar-sub">{loading ? "Loading…" : `${filtered.length} paper${filtered.length!==1?"s":""} found`}</div>
            </div>
          </div>
        </div>

        <div className="search-wrap">
          <div className="sbox">
            <span className="s-ico">🔍</span>
            <input className="s-in" placeholder="Search papers…" value={search} onChange={e=>setSearch(e.target.value)} />
            {search && <button className="s-clr" onClick={()=>setSearch("")}>✕</button>}
          </div>
        </div>

        {!loading && years.length > 1 && (
          <div className="year-row">
            {years.map(y=>(
              <button key={y} className={`ypill ${activeYear===y?"active":""}`} onClick={()=>setActiveYear(y)}>
                {y==="All"?"All Years":y}
              </button>
            ))}
          </div>
        )}

        <div className="sec-bar">
          <span className="sec-title">{activeYear==="All"?"All Papers":`Year ${activeYear}`}</span>
          {!loading && <span className="sec-count">{filtered.length} papers</span>}
        </div>

        <div className="papers">
          {loading && Array(3).fill(0).map((_,i)=><div key={i} className="skel"/>)}
          {!loading && filtered.map(paper=>(
            <div key={paper.id} className="paper">
              <div className="paper-head">
                <div className="year-block">
                  <span className="year-big">{paper.year}</span>
                  <span className="year-lbl">Year</span>
                </div>
                <div className="tags">
                  <span className="tag tag-qp">Q·Paper</span>
                  {paper.pdf && <span className="tag tag-pdf">PDF</span>}
                </div>
              </div>
              <div className="paper-body">
                <div className="paper-title">{paper.title}</div>
                {paper.pdf ? (
                  <div className="actions">
                    <a href={paper.pdf} target="_blank" rel="noopener noreferrer" className="btn btn-view">👁 View</a>
                    <button onClick={()=>handleDownload(paper)} disabled={downloading===paper.id} className="btn btn-dl">
                      {downloading===paper.id ? "⏳ Loading…" : "⬇ Download"}
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
        </div>
      </div>
    </div>
  );
}
