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
    <div className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #F7F7F8; --white: #FFFFFF; --ink: #111118;
          --ink2: #3D3D4A; --muted: #9898A8; --border: #E8E8EE;
          --red: #E63946; --green: #16A34A; --blue: #2D6BE4;
          --shadow-sm: 0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04);
        }
        html, body { background: var(--bg); }
        .root {
          min-height: 100vh; min-height: 100dvh;
          background: var(--bg);
          font-family: 'Inter', -apple-system, sans-serif;
          color: var(--ink);
          padding-bottom: max(env(safe-area-inset-bottom), 32px);
          -webkit-font-smoothing: antialiased;
        }

        /* Topbar */
        .topbar {
          background: var(--white);
          padding: max(env(safe-area-inset-top), 52px) 20px 18px;
          border-bottom: 1px solid var(--border);
          position: sticky; top: 0; z-index: 10;
        }
        .topbar-row { display: flex; align-items: center; gap: 12px; }
        .back-btn {
          width: 40px; height: 40px; border-radius: 12px;
          background: var(--bg); border: 1.5px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; color: var(--ink2);
          text-decoration: none; flex-shrink: 0;
          -webkit-tap-highlight-color: transparent; transition: background 0.15s;
        }
        .back-btn:active { background: var(--border); }
        .topbar-info { flex: 1; min-width: 0; }
        .topbar-row2 {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
        }
        .topbar-title { font-size: 22px; font-weight: 800; letter-spacing: -0.4px; }
        .count-badge {
          font-size: 12px; font-weight: 700;
          background: #FFF0F0; color: var(--red);
          padding: 3px 10px; border-radius: 100px;
        }
        .topbar-sub { font-size: 12px; color: var(--muted); margin-top: 2px; }

        /* Search */
        .search-section { padding: 14px 16px 0; }
        .search-box {
          display: flex; align-items: center; gap: 10px;
          background: var(--white); border: 1.5px solid var(--border);
          border-radius: 12px; padding: 0 14px;
          box-shadow: var(--shadow-sm); transition: border-color 0.2s;
        }
        .search-box:focus-within { border-color: var(--red); box-shadow: 0 0 0 3px rgba(230,57,70,0.08); }
        .search-ico { font-size: 16px; flex-shrink: 0; opacity: 0.4; }
        .search-input {
          flex: 1; border: none; outline: none; padding: 13px 0;
          font-family: 'Inter', sans-serif; font-size: 15px;
          color: var(--ink); background: transparent;
        }
        .search-input::placeholder { color: var(--muted); }
        .search-clear {
          font-size: 16px; cursor: pointer; opacity: 0.5; flex-shrink: 0;
          padding: 4px; border: none; background: none;
          -webkit-tap-highlight-color: transparent;
        }

        /* Year pills */
        .year-row {
          display: flex; gap: 8px; overflow-x: auto;
          padding: 12px 16px 0; scrollbar-width: none;
        }
        .year-row::-webkit-scrollbar { display: none; }
        .year-pill {
          background: var(--white); border: 1.5px solid var(--border);
          border-radius: 100px; padding: 7px 16px;
          font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
          color: var(--ink2); cursor: pointer; white-space: nowrap; flex-shrink: 0;
          box-shadow: var(--shadow-sm); transition: all 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .year-pill.active {
          background: var(--ink); border-color: var(--ink);
          color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .year-pill:active { transform: scale(0.95); }

        /* Section label */
        .section-label {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 16px 10px;
        }
        .label-text { font-size: 13px; font-weight: 700; color: var(--ink2); text-transform: uppercase; letter-spacing: 0.08em; }
        .label-count { font-size: 12px; font-weight: 600; background: #F0F0F5; color: var(--muted); padding: 3px 10px; border-radius: 100px; }

        /* Papers */
        .papers { padding: 0 16px 20px; display: flex; flex-direction: column; gap: 10px; }

        .paper-card {
          background: var(--white);
          border: 1.5px solid var(--border);
          border-radius: 16px; overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: transform 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .paper-card:active { transform: scale(0.99); }

        /* Year accent bar */
        .paper-top-bar {
          background: var(--ink);
          padding: 10px 16px;
          display: flex; align-items: center;
          justify-content: space-between;
        }
        .paper-year-text {
          font-size: 13px; font-weight: 800;
          color: #fff; letter-spacing: 0.06em;
        }
        .paper-tags { display: flex; gap: 6px; }
        .tag {
          font-size: 10px; font-weight: 700; padding: 3px 8px;
          border-radius: 4px; text-transform: uppercase; letter-spacing: 0.06em;
        }
        .tag-qp { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.9); }
        .tag-pdf { background: #16A34A; color: #fff; }

        .paper-body { padding: 14px 16px 16px; }
        .paper-title {
          font-size: 16px; font-weight: 700; line-height: 1.4;
          color: var(--ink); letter-spacing: -0.2px;
          margin-bottom: 14px;
        }

        /* Buttons */
        .actions { display: flex; gap: 8px; }
        .btn {
          flex: 1; padding: 12px 10px;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 700;
          cursor: pointer; border: none;
          text-decoration: none;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all 0.15s; -webkit-tap-highlight-color: transparent;
          letter-spacing: -0.1px;
        }
        .btn-view { background: #EEF3FF; color: var(--blue); }
        .btn-view:active { background: #D8E4FF; transform: scale(0.97); }
        .btn-download { background: #F0FDF4; color: var(--green); }
        .btn-download:active { background: #DCFCE7; transform: scale(0.97); }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

        .no-pdf {
          font-size: 13px; color: var(--muted); text-align: center;
          padding: 12px; background: var(--bg); border-radius: 10px;
        }

        /* Skeleton */
        .skel {
          background: linear-gradient(90deg, #ececf0 25%, #f5f5f8 50%, #ececf0 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite;
          border-radius: 16px; height: 140px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .empty { text-align: center; padding: 60px 20px; color: var(--muted); }
        .empty-icon { font-size: 52px; margin-bottom: 14px; display: block; }
        .empty-title { font-size: 18px; font-weight: 700; color: var(--ink2); margin-bottom: 6px; }
        .empty-sub { font-size: 14px; }

        .footer {
          margin: 8px 16px 0; padding: 20px 16px;
          background: var(--white); border-radius: 14px;
          border: 1px solid var(--border);
          display: flex; flex-direction: column; align-items: center; gap: 4px;
        }
        .footer-name { font-size: 13px; font-weight: 800; color: var(--red); }
        .footer-sub { font-size: 11px; color: var(--muted); }
      `}</style>

      <div className="topbar">
        <div className="topbar-row">
          <Link to={-1} className="back-btn">‹</Link>
          <div className="topbar-info">
            <div className="topbar-row2">
              <span className="topbar-title">Papers</span>
              {!loading && <span className="count-badge">{papers.length}</span>}
            </div>
            <div className="topbar-sub">
              {loading ? "Loading..." : `${filtered.length} paper${filtered.length !== 1 ? "s" : ""} found`}
            </div>
          </div>
        </div>
      </div>

      <div className="search-section">
        <div className="search-box">
          <span className="search-ico">🔍</span>
          <input className="search-input" placeholder="Search papers..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="search-clear" onClick={() => setSearch("")}>✕</button>}
        </div>
      </div>

      {!loading && years.length > 1 && (
        <div className="year-row">
          {years.map(y => (
            <button key={y} className={`year-pill ${activeYear === y ? "active" : ""}`} onClick={() => setActiveYear(y)}>
              {y === "All" ? "All Years" : y}
            </button>
          ))}
        </div>
      )}

      <div className="section-label">
        <span className="label-text">{activeYear === "All" ? "All Papers" : `Year ${activeYear}`}</span>
        {!loading && <span className="label-count">{filtered.length}</span>}
      </div>

      <div className="papers">
        {loading && Array(3).fill(0).map((_, i) => <div key={i} className="skel" />)}
        {!loading && filtered.map(paper => (
          <div key={paper.id} className="paper-card">
            <div className="paper-top-bar">
              <span className="paper-year-text">{paper.year}</span>
              <div className="paper-tags">
                <span className="tag tag-qp">Q. Paper</span>
                {paper.pdf && <span className="tag tag-pdf">PDF</span>}
              </div>
            </div>
            <div className="paper-body">
              <div className="paper-title">{paper.title}</div>
              {paper.pdf ? (
                <div className="actions">
                  <a href={paper.pdf} target="_blank" rel="noopener noreferrer" className="btn btn-view">
                    👁 View
                  </a>
                  <button onClick={() => handleDownload(paper)} disabled={downloading === paper.id} className="btn btn-download">
                    {downloading === paper.id ? "⏳ Downloading..." : "⬇ Download"}
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
        <div className="footer-name">★ SFI KOTTAKKAL LC</div>
        <div className="footer-sub">Made with love for students</div>
      </div>
    </div>
  );
}

export default Papers;
