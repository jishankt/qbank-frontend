import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

function Papers() {
  const { subjectId } = useParams();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [downloading, setDownloading] = useState(null);
  const [viewYear, setViewYear] = useState("All");

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
    const matchYear = viewYear === "All" || p.year === viewYear;
    return matchSearch && matchYear;
  });

  const handleDownload = async (paper) => {
    if (!paper.pdf) return;
    setDownloading(paper.id);
    try {
      const response = await fetch(paper.pdf);
      if (!response.ok) throw new Error("Failed to fetch PDF");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${paper.title}_${paper.year}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Try opening the PDF and saving it manually.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="qb-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #080b14; --card: #131929;
          --border: rgba(255,255,255,0.06); --border-hover: rgba(139,92,246,0.5);
          --accent: #7c3aed; --accent2: #06b6d4; --green: #10b981;
          --text: #f0f4ff; --muted: #6b7a99;
        }
        .qb-root {
          min-height: 100vh; background: var(--bg);
          font-family: 'DM Sans', sans-serif; color: var(--text);
          padding: 0 16px 80px; position: relative; overflow-x: hidden;
        }
        .qb-root::before {
          content: ''; position: fixed;
          top: -150px; right: -150px; width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .qb-inner { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }

        .qb-topbar { display: flex; align-items: center; gap: 14px; padding: 24px 0 28px; }
        .qb-back {
          display: flex; align-items: center; justify-content: center;
          width: 40px; height: 40px; background: var(--card);
          border: 1px solid var(--border); border-radius: 12px;
          text-decoration: none; font-size: 16px; color: var(--text);
          flex-shrink: 0; transition: all 0.2s;
        }
        .qb-back:hover { border-color: var(--border-hover); background: rgba(124,58,237,0.1); }
        .qb-topbar-text h1 {
          font-family: 'Syne', sans-serif; font-size: 22px;
          font-weight: 800; letter-spacing: -0.5px;
          display: flex; align-items: center; flex-wrap: wrap; gap: 8px;
        }
        .qb-topbar-text p { font-size: 13px; color: var(--muted); margin-top: 2px; }

        .qb-search-wrap { position: relative; margin-bottom: 16px; }
        .qb-search-icon {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%); color: var(--muted); font-size: 15px; pointer-events: none;
        }
        .qb-search {
          width: 100%; background: var(--card); border: 1px solid var(--border);
          border-radius: 14px; padding: 13px 16px 13px 44px;
          color: var(--text); font-family: 'DM Sans', sans-serif;
          font-size: 15px; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .qb-search::placeholder { color: var(--muted); }
        .qb-search:focus { border-color: rgba(124,58,237,0.5); box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }

        .qb-filters {
          display: flex; gap: 8px; overflow-x: auto;
          padding-bottom: 4px; margin-bottom: 24px; scrollbar-width: none;
        }
        .qb-filters::-webkit-scrollbar { display: none; }
        .qb-pill {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 100px; padding: 6px 14px;
          font-size: 13px; font-weight: 500; color: var(--muted);
          cursor: pointer; white-space: nowrap;
          transition: all 0.18s; flex-shrink: 0; font-family: 'DM Sans', sans-serif;
        }
        .qb-pill:hover { border-color: var(--border-hover); color: var(--text); }
        .qb-pill.active {
          background: rgba(124,58,237,0.2); border-color: rgba(124,58,237,0.5);
          color: #a78bfa; font-weight: 600;
        }

        .qb-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--muted); margin-bottom: 14px;
        }
        .qb-papers { display: flex; flex-direction: column; gap: 10px; }

        .qb-paper-card {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 18px; padding: 18px; transition: all 0.22s;
          position: relative; overflow: hidden;
        }
        .qb-paper-card::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 3px; background: linear-gradient(180deg, var(--accent), var(--accent2));
          border-radius: 3px 0 0 3px; opacity: 0; transition: opacity 0.2s;
        }
        .qb-paper-card:hover {
          border-color: var(--border-hover);
          box-shadow: 0 8px 32px rgba(124,58,237,0.15);
          transform: translateY(-2px);
        }
        .qb-paper-card:hover::before { opacity: 1; }

        .qb-paper-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 10px; margin-bottom: 14px;
        }
        .qb-paper-info { flex: 1; min-width: 0; }
        .qb-paper-title {
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .qb-paper-meta { display: flex; align-items: center; gap: 8px; margin-top: 5px; }
        .qb-year-tag {
          display: inline-block; background: rgba(124,58,237,0.15);
          border: 1px solid rgba(124,58,237,0.25); color: #a78bfa;
          font-size: 12px; font-weight: 600; padding: 2px 10px; border-radius: 6px;
        }
        .qb-pdf-badge {
          font-size: 11px; color: var(--muted);
          background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 6px;
        }

        .qb-actions { display: flex; gap: 8px; }
        .qb-btn {
          flex: 1; display: flex; align-items: center; justify-content: center;
          gap: 7px; padding: 10px 12px; border-radius: 11px;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          cursor: pointer; border: none; text-decoration: none; transition: all 0.18s;
        }
        .qb-btn-view {
          background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.3); color: #a78bfa;
        }
        .qb-btn-view:hover { background: rgba(124,58,237,0.25); border-color: rgba(124,58,237,0.5); transform: translateY(-1px); }
        .qb-btn-download {
          background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.25); color: #34d399;
        }
        .qb-btn-download:hover { background: rgba(16,185,129,0.22); border-color: rgba(16,185,129,0.45); transform: translateY(-1px); }
        .qb-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

        .qb-no-pdf {
          font-size: 12px; color: var(--muted);
          background: rgba(255,255,255,0.03);
          border: 1px dashed var(--border);
          border-radius: 10px; padding: 8px; text-align: center; margin-top: 10px;
        }

        .qb-skeleton {
          background: linear-gradient(90deg, var(--card) 25%, #1a2235 50%, var(--card) 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite;
          border-radius: 18px; height: 110px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; } 100% { background-position: -200% 0; }
        }

        .qb-empty { text-align: center; padding: 52px 0; color: var(--muted); }
        .qb-empty-icon { font-size: 44px; margin-bottom: 14px; }
        .qb-empty h3 {
          font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700;
          color: var(--text); margin-bottom: 6px;
        }

        .qb-count {
          display: inline-flex; align-items: center;
          background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.2);
          color: #22d3ee; border-radius: 100px;
          font-size: 12px; font-weight: 600; padding: 2px 10px;
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      <div className="qb-inner">
        <div className="qb-topbar">
          <Link to={-1} className="qb-back">⬅</Link>
          <div className="qb-topbar-text">
            <h1>📄 Papers <span className="qb-count">{papers.length}</span></h1>
            <p>{loading ? "Loading..." : `${filtered.length} paper${filtered.length !== 1 ? "s" : ""} found`}</p>
          </div>
        </div>

        <div className="qb-search-wrap">
          <span className="qb-search-icon">🔍</span>
          <input
            className="qb-search"
            placeholder="Search papers by title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {!loading && years.length > 1 && (
          <div className="qb-filters">
            {years.map(y => (
              <button key={y} className={`qb-pill ${viewYear === y ? "active" : ""}`} onClick={() => setViewYear(y)}>
                {y === "All" ? "All Years" : y}
              </button>
            ))}
          </div>
        )}

        <div className="qb-label">
          {viewYear === "All" ? "All Papers" : `Papers from ${viewYear}`}
        </div>

        <div className="qb-papers">
          {loading && Array(3).fill(0).map((_, i) => <div key={i} className="qb-skeleton" />)}

          {!loading && filtered.map(paper => (
            <div key={paper.id} className="qb-paper-card">
              <div className="qb-paper-top">
                <div className="qb-paper-info">
                  <div className="qb-paper-title">📑 {paper.title}</div>
                  <div className="qb-paper-meta">
                    <span className="qb-year-tag">{paper.year}</span>
                    {paper.pdf && <span className="qb-pdf-badge">PDF</span>}
                  </div>
                </div>
              </div>

              {paper.pdf ? (
                <div className="qb-actions">
                  <a href={paper.pdf} target="_blank" rel="noopener noreferrer" className="qb-btn qb-btn-view">
                    <span>👁</span> View
                  </a>
                  <button
                    onClick={() => handleDownload(paper)}
                    disabled={downloading === paper.id}
                    className="qb-btn qb-btn-download"
                  >
                    <span>{downloading === paper.id ? "⏳" : "⬇"}</span>
                    {downloading === paper.id ? "Downloading..." : "Download"}
                  </button>
                </div>
              ) : (
                <div className="qb-no-pdf">📭 PDF not available yet</div>
              )}
            </div>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="qb-empty">
            <div className="qb-empty-icon">{search ? "🔍" : "📭"}</div>
            <h3>{search ? `No results for "${search}"` : "No papers yet"}</h3>
            <p>{search ? "Try a different search term" : "Check back soon!"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Papers;
