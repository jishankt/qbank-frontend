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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #F2F2F7; --surface: #FFFFFF; --ink: #1C1C1E;
          --muted: #8E8E93; --border: rgba(0,0,0,0.06);
          --blue: #007AFF; --green: #34C759; --shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        body { background: var(--bg); }
        .app {
          min-height: 100vh; min-height: 100dvh; background: var(--bg);
          font-family: 'Plus Jakarta Sans', sans-serif; color: var(--ink);
          padding-bottom: env(safe-area-inset-bottom, 32px);
        }

        /* Topbar */
        .topbar {
          background: var(--surface);
          padding: 52px 20px 18px;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; gap: 14px;
        }
        .back-btn {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--bg); border: none;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; color: var(--blue); line-height: 1;
          text-decoration: none; flex-shrink: 0;
          -webkit-tap-highlight-color: transparent; transition: opacity 0.15s;
        }
        .back-btn:active { opacity: 0.6; }
        .topbar-text { flex: 1; min-width: 0; }
        .topbar-text h1 {
          font-size: 26px; font-weight: 800; letter-spacing: -0.5px;
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
        }
        .count-badge {
          font-size: 13px; font-weight: 700;
          background: rgba(0,122,255,0.1); color: var(--blue);
          padding: 2px 10px; border-radius: 100px;
        }
        .topbar-text p { font-size: 13px; color: var(--muted); margin-top: 2px; }

        /* Search */
        .search-wrap { padding: 14px 20px 4px; position: relative; }
        .search-icon { position: absolute; left: 34px; top: 50%; transform: translateY(-50%); font-size: 14px; color: var(--muted); pointer-events: none; }
        .search {
          width: 100%; background: var(--surface); border: none;
          border-radius: 12px; padding: 11px 16px 11px 38px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; color: var(--ink); outline: none;
          box-shadow: var(--shadow); -webkit-appearance: none;
        }
        .search::placeholder { color: var(--muted); }
        .search:focus { box-shadow: 0 0 0 3px rgba(0,122,255,0.15), var(--shadow); }

        /* Year pills */
        .year-scroll {
          display: flex; gap: 8px; overflow-x: auto;
          padding: 12px 20px 4px; scrollbar-width: none;
        }
        .year-scroll::-webkit-scrollbar { display: none; }
        .year-pill {
          background: var(--surface); border: none;
          border-radius: 100px; padding: 7px 16px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 600; color: var(--muted);
          cursor: pointer; white-space: nowrap; flex-shrink: 0;
          box-shadow: var(--shadow); transition: all 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .year-pill.active { background: var(--blue); color: #fff; box-shadow: 0 4px 12px rgba(0,122,255,0.3); }
        .year-pill:active { transform: scale(0.95); }

        .section-label {
          padding: 12px 20px 8px;
          font-size: 13px; font-weight: 700;
          color: var(--muted); text-transform: uppercase; letter-spacing: 0.07em;
        }

        /* Paper cards */
        .papers { padding: 0 20px 20px; display: flex; flex-direction: column; gap: 12px; }

        .paper-card {
          background: var(--surface); border-radius: 18px;
          overflow: hidden; box-shadow: var(--shadow);
          transition: transform 0.15s;
        }
        .paper-card:active { transform: scale(0.99); }

        /* Colored top strip */
        .paper-strip { height: 4px; background: linear-gradient(90deg, var(--blue), #5AC8FA); }

        .paper-body { padding: 16px; }
        .paper-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 12px;
          margin-bottom: 12px;
        }
        .paper-title {
          font-size: 16px; font-weight: 700; line-height: 1.3;
          flex: 1;
        }
        .paper-year {
          font-size: 24px; font-weight: 800;
          color: var(--blue); flex-shrink: 0;
          line-height: 1;
        }
        .paper-tags { display: flex; gap: 6px; margin-bottom: 14px; }
        .tag {
          font-size: 11px; font-weight: 700;
          padding: 3px 10px; border-radius: 100px;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .tag-paper { background: rgba(0,122,255,0.08); color: var(--blue); }
        .tag-pdf { background: rgba(52,199,89,0.1); color: var(--green); }

        /* Buttons */
        .actions { display: flex; gap: 10px; }
        .btn {
          flex: 1; padding: 11px 10px;
          border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 700;
          cursor: pointer; border: none; text-decoration: none;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all 0.15s; -webkit-tap-highlight-color: transparent;
        }
        .btn-view {
          background: rgba(0,122,255,0.1); color: var(--blue);
        }
        .btn-view:active { background: rgba(0,122,255,0.2); transform: scale(0.97); }
        .btn-download {
          background: rgba(52,199,89,0.1); color: var(--green);
        }
        .btn-download:active { background: rgba(52,199,89,0.2); transform: scale(0.97); }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

        .no-pdf {
          font-size: 13px; color: var(--muted); font-weight: 500;
          text-align: center; padding: 10px;
          background: var(--bg); border-radius: 10px;
        }

        /* Skeleton */
        .skeleton {
          background: linear-gradient(90deg, #E5E5EA 25%, #F2F2F7 50%, #E5E5EA 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite;
          border-radius: 18px; height: 140px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .empty { text-align: center; padding: 52px 20px; color: var(--muted); }
        .empty-icon { font-size: 48px; margin-bottom: 14px; }
        .empty h3 { font-size: 18px; font-weight: 700; color: var(--ink); margin-bottom: 6px; }
        .empty p { font-size: 14px; }
      `}</style>

      {/* Topbar */}
      <div className="topbar">
        <Link to={-1} className="back-btn">‹</Link>
        <div className="topbar-text">
          <h1>
            Papers
            {!loading && <span className="count-badge">{papers.length}</span>}
          </h1>
          <p>{loading ? "Loading..." : `${filtered.length} paper${filtered.length !== 1 ? "s" : ""} found`}</p>
        </div>
      </div>

      {/* Search */}
      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input className="search" placeholder="Search papers..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Year filter */}
      {!loading && years.length > 1 && (
        <div className="year-scroll">
          {years.map(y => (
            <button key={y} className={`year-pill ${activeYear === y ? "active" : ""}`} onClick={() => setActiveYear(y)}>
              {y === "All" ? "All Years" : y}
            </button>
          ))}
        </div>
      )}

      <div className="section-label">
        {activeYear === "All" ? "All Papers" : `Year ${activeYear}`}
      </div>

      <div className="papers">
        {loading && Array(3).fill(0).map((_, i) => <div key={i} className="skeleton" />)}

        {!loading && filtered.map(paper => (
          <div key={paper.id} className="paper-card">
            <div className="paper-strip" />
            <div className="paper-body">
              <div className="paper-top">
                <div className="paper-title">{paper.title}</div>
                <div className="paper-year">{paper.year}</div>
              </div>
              <div className="paper-tags">
                <span className="tag tag-paper">Question Paper</span>
                {paper.pdf && <span className="tag tag-pdf">PDF Ready</span>}
              </div>
              {paper.pdf ? (
                <div className="actions">
                  <a href={paper.pdf} target="_blank" rel="noopener noreferrer" className="btn btn-view">
                    👁 View
                  </a>
                  <button
                    onClick={() => handleDownload(paper)}
                    disabled={downloading === paper.id}
                    className="btn btn-download"
                  >
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
          <h3>{search ? "Nothing found" : "No papers yet"}</h3>
          <p>{search ? `No results for "${search}"` : "Check back soon!"}</p>
        </div>
      )}
    </div>
  );
}

export default Papers;
