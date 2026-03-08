import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

function Papers() {
  const { subjectId } = useParams();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [downloading, setDownloading] = useState(null);
  const [activeYear, setActiveYear] = useState("All");

  useEffect(() => {
    setLoading(true);
    API.get(`papers/${subjectId}/`)
      .then(res => setPapers(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [subjectId]);

  const years = ["All", ...new Set(papers.map(p => p.year).sort((a, b) => b - a))];

  const filtered = papers.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchYear = activeYear === "All" || p.year === activeYear;
    return matchSearch && matchYear;
  });

  const handleDownload = async (paper) => {
    if (!paper.pdf) return;
    setDownloading(paper.id);
    try {
      const response = await fetch(paper.pdf);
      if (!response.ok) throw new Error("Failed");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${paper.title}_${paper.year}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } catch {
      alert("Download failed. Try opening the PDF manually.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #050508; --card: #0F0F18; --card2: #141420;
          --neon: #00FF87; --neon2: #00D4FF; --pink: #FF3CAC;
          --text: #FFFFFF; --text2: #B0B0C8; --muted: #505068;
          --border: rgba(255,255,255,0.06); --border2: rgba(0,255,135,0.2);
        }
        body { background: var(--bg); }
        .app {
          min-height: 100vh; min-height: 100dvh; background: var(--bg);
          font-family: 'Barlow', sans-serif; color: var(--text);
          padding-bottom: env(safe-area-inset-bottom, 40px);
          position: relative; overflow-x: hidden;
        }
        .app::before {
          content: ''; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(ellipse 80% 40% at 50% -10%, rgba(0,255,135,0.06) 0%, transparent 60%);
          pointer-events: none; z-index: 0;
        }
        .inner { position: relative; z-index: 1; }

        /* Topbar */
        .topbar { padding: 52px 20px 24px; }
        .topbar-row { display: flex; align-items: center; gap: 14px; }
        .back-btn {
          width: 42px; height: 42px; border-radius: 12px;
          background: var(--card); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; color: var(--neon);
          text-decoration: none; flex-shrink: 0;
          -webkit-tap-highlight-color: transparent; transition: opacity 0.15s;
        }
        .back-btn:active { opacity: 0.6; }
        .topbar-info { flex: 1; min-width: 0; }
        .topbar-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 36px; font-weight: 900;
          line-height: 1; letter-spacing: 0.5px;
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
        }
        .count-chip {
          font-family: 'Barlow', sans-serif;
          font-size: 12px; font-weight: 700;
          background: rgba(0,255,135,0.1);
          color: var(--neon); border: 1px solid rgba(0,255,135,0.25);
          padding: 3px 10px; border-radius: 100px;
        }
        .topbar-sub { font-size: 12px; color: var(--muted); margin-top: 4px; }

        .divider { height: 1px; margin: 0 20px; background: linear-gradient(90deg, var(--neon), transparent); opacity: 0.3; }

        /* Search */
        .search-wrap { padding: 16px 20px 4px; position: relative; }
        .search-icon { position: absolute; left: 34px; top: 50%; transform: translateY(-50%); font-size: 14px; color: var(--muted); pointer-events: none; }
        .search {
          width: 100%; background: var(--card); border: 1px solid var(--border);
          border-radius: 12px; padding: 13px 16px 13px 40px;
          font-family: 'Barlow', sans-serif; font-size: 15px;
          color: var(--text); outline: none; -webkit-appearance: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search::placeholder { color: var(--muted); }
        .search:focus { border-color: rgba(0,255,135,0.4); box-shadow: 0 0 0 3px rgba(0,255,135,0.06); }

        /* Year filter */
        .year-scroll {
          display: flex; gap: 8px; overflow-x: auto;
          padding: 12px 20px 4px; scrollbar-width: none;
        }
        .year-scroll::-webkit-scrollbar { display: none; }
        .year-pill {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 8px; padding: 7px 16px;
          font-family: 'Barlow', sans-serif;
          font-size: 13px; font-weight: 600; color: var(--muted);
          cursor: pointer; white-space: nowrap; flex-shrink: 0;
          transition: all 0.15s; -webkit-tap-highlight-color: transparent;
        }
        .year-pill.active {
          background: var(--neon); border-color: var(--neon);
          color: #000; font-weight: 800;
          box-shadow: 0 4px 16px rgba(0,255,135,0.3);
        }
        .year-pill:active { transform: scale(0.95); }

        .section-head {
          padding: 12px 20px 10px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .section-title { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.14em; }
        .section-count { font-size: 11px; font-weight: 700; color: var(--neon); }

        /* Paper cards */
        .papers { padding: 0 20px 20px; display: flex; flex-direction: column; gap: 10px; }

        .paper-card {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 16px; overflow: hidden;
          transition: transform 0.15s; -webkit-tap-highlight-color: transparent;
          position: relative;
        }
        .paper-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.02), transparent);
          pointer-events: none;
        }
        .paper-card:active { transform: scale(0.99); }

        /* Neon top bar */
        .paper-glow-bar { height: 3px; background: linear-gradient(90deg, var(--neon), var(--neon2)); }

        .paper-body { padding: 16px; }
        .paper-main {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 12px;
          margin-bottom: 12px;
        }
        .paper-title {
          font-size: 15px; font-weight: 600;
          line-height: 1.4; flex: 1; color: var(--text);
        }
        .paper-year-box {
          background: rgba(0,255,135,0.08);
          border: 1px solid rgba(0,255,135,0.15);
          border-radius: 10px; padding: 6px 12px;
          text-align: center; flex-shrink: 0;
        }
        .paper-year {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px; font-weight: 900;
          color: var(--neon); line-height: 1;
        }
        .paper-year-label {
          font-size: 9px; font-weight: 700;
          color: var(--muted); text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .paper-chips { display: flex; gap: 6px; margin-bottom: 14px; }
        .chip {
          font-size: 10px; font-weight: 800; padding: 3px 10px;
          border-radius: 5px; text-transform: uppercase; letter-spacing: 0.08em;
          border: 1px solid;
        }
        .chip-qp { background: rgba(0,255,135,0.06); color: var(--neon); border-color: rgba(0,255,135,0.2); }
        .chip-pdf { background: rgba(0,212,255,0.06); color: var(--neon2); border-color: rgba(0,212,255,0.2); }

        /* Buttons */
        .actions { display: flex; gap: 8px; }
        .btn {
          flex: 1; padding: 11px 10px;
          border-radius: 10px; font-family: 'Barlow', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 0.02em;
          cursor: pointer; border: 1px solid;
          text-decoration: none;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all 0.15s; -webkit-tap-highlight-color: transparent;
        }
        .btn-view {
          background: rgba(0,255,135,0.08); border-color: rgba(0,255,135,0.25); color: var(--neon);
        }
        .btn-view:active { background: rgba(0,255,135,0.16); transform: scale(0.97); }
        .btn-download {
          background: rgba(0,212,255,0.08); border-color: rgba(0,212,255,0.25); color: var(--neon2);
        }
        .btn-download:active { background: rgba(0,212,255,0.16); transform: scale(0.97); }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

        .no-pdf {
          font-size: 13px; color: var(--muted); text-align: center;
          padding: 12px; background: var(--card2); border-radius: 10px;
          border: 1px dashed var(--border);
        }

        .skeleton {
          background: linear-gradient(90deg, #0f0f18 25%, #141420 50%, #0f0f18 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite;
          border-radius: 16px; height: 150px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .footer {
          margin: 4px 20px 0; padding: 20px 0;
          border-top: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .footer-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--neon); }
        .footer-text { font-size: 11px; font-weight: 600; color: var(--muted); letter-spacing: 0.08em; }
        .footer-brand { font-size: 12px; font-weight: 800; color: var(--neon); letter-spacing: 0.06em; }

        .empty { text-align: center; padding: 52px 20px; color: var(--muted); }
        .empty-icon { font-size: 48px; margin-bottom: 14px; }
        .empty-title { font-family: 'Barlow Condensed', sans-serif; font-size: 22px; font-weight: 800; color: var(--text2); margin-bottom: 6px; }
        .empty p { font-size: 14px; }
      `}</style>

      <div className="inner">
        <div className="topbar">
          <div className="topbar-row">
            <Link to={-1} className="back-btn">‹</Link>
            <div className="topbar-info">
              <div className="topbar-title">
                PAPERS
                {!loading && <span className="count-chip">{papers.length}</span>}
              </div>
              <div className="topbar-sub">
                {loading ? "Loading..." : `${filtered.length} paper${filtered.length !== 1 ? "s" : ""} found`}
              </div>
            </div>
          </div>
        </div>

        <div className="divider" />

        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input className="search" placeholder="Search papers..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {!loading && years.length > 1 && (
          <div className="year-scroll">
            {years.map(y => (
              <button key={y} className={`year-pill ${activeYear === y ? "active" : ""}`} onClick={() => setActiveYear(y)}>
                {y === "All" ? "All Years" : y}
              </button>
            ))}
          </div>
        )}

        <div className="section-head">
          <span className="section-title">{activeYear === "All" ? "All Papers" : `Year ${activeYear}`}</span>
          {!loading && <span className="section-count">{filtered.length} papers</span>}
        </div>

        <div className="papers">
          {loading && Array(3).fill(0).map((_, i) => <div key={i} className="skeleton" />)}
          {!loading && filtered.map(paper => (
            <div key={paper.id} className="paper-card">
              <div className="paper-glow-bar" />
              <div className="paper-body">
                <div className="paper-main">
                  <div className="paper-title">{paper.title}</div>
                  <div className="paper-year-box">
                    <div className="paper-year">{paper.year}</div>
                    <div className="paper-year-label">Year</div>
                  </div>
                </div>
                <div className="paper-chips">
                  <span className="chip chip-qp">Question Paper</span>
                  {paper.pdf && <span className="chip chip-pdf">PDF Ready</span>}
                </div>
                {paper.pdf ? (
                  <div className="actions">
                    <a href={paper.pdf} target="_blank" rel="noopener noreferrer" className="btn btn-view">
                      👁 View
                    </a>
                    <button onClick={() => handleDownload(paper)} disabled={downloading === paper.id} className="btn btn-download">
                      {downloading === paper.id ? "⏳ Wait..." : "⬇ Download"}
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
            <div className="empty-icon">{search ? "🔍" : "📭"}</div>
            <div className="empty-title">{search ? "Nothing Found" : "No Papers Yet"}</div>
            <p>{search ? `No results for "${search}"` : "Check back soon!"}</p>
          </div>
        )}

        <div className="footer">
          <div className="footer-dot" />
          <span className="footer-text">Made with ♥ by</span>
          <span className="footer-brand">SFI KOTTAKKAL LC</span>
          <div className="footer-dot" />
        </div>
      </div>
    </div>
  );
}

export default Papers;
