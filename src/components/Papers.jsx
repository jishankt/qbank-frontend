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
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0D0D0D; --surface: #161616; --surface2: #1E1E1E;
          --red: #E63946; --gold: #FFD166; --green: #2A9D8F;
          --text: #F5F5F5; --muted: #888; --border: rgba(255,255,255,0.07);
        }
        body { background: var(--bg); }
        .app {
          min-height: 100vh; min-height: 100dvh; background: var(--bg);
          font-family: 'Outfit', sans-serif; color: var(--text);
          padding-bottom: env(safe-area-inset-bottom, 32px);
        }

        /* Topbar */
        .topbar {
          background: var(--surface);
          padding: 52px 16px 20px;
          border-bottom: 1px solid var(--border);
          position: relative;
        }
        .topbar::after {
          content: ''; position: absolute;
          bottom: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--red), var(--gold), transparent);
        }
        .topbar-row { display: flex; align-items: center; gap: 12px; }
        .back-btn {
          width: 38px; height: 38px; border-radius: 10px;
          background: var(--surface2); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; color: var(--red);
          text-decoration: none; flex-shrink: 0;
          -webkit-tap-highlight-color: transparent; transition: opacity 0.15s;
        }
        .back-btn:active { opacity: 0.6; }
        .topbar-info { flex: 1; min-width: 0; }
        .topbar-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px; letter-spacing: 1px; line-height: 1;
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
        }
        .count-badge {
          font-family: 'Outfit', sans-serif;
          font-size: 12px; font-weight: 700;
          background: rgba(230,57,70,0.15);
          color: var(--red); border: 1px solid rgba(230,57,70,0.3);
          padding: 2px 10px; border-radius: 100px;
        }
        .topbar-sub { font-size: 12px; color: var(--muted); margin-top: 3px; font-weight: 400; }

        /* Search */
        .search-wrap { padding: 14px 16px 6px; position: relative; }
        .search-icon { position: absolute; left: 30px; top: 50%; transform: translateY(-50%); font-size: 14px; color: var(--muted); pointer-events: none; }
        .search {
          width: 100%; background: var(--surface2); border: 1px solid var(--border);
          border-radius: 10px; padding: 12px 16px 12px 38px;
          font-family: 'Outfit', sans-serif; font-size: 15px;
          color: var(--text); outline: none; -webkit-appearance: none;
          transition: border-color 0.2s;
        }
        .search::placeholder { color: var(--muted); }
        .search:focus { border-color: rgba(230,57,70,0.5); }

        /* Year pills */
        .year-scroll {
          display: flex; gap: 8px; overflow-x: auto;
          padding: 10px 16px 4px; scrollbar-width: none;
        }
        .year-scroll::-webkit-scrollbar { display: none; }
        .year-pill {
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 8px; padding: 6px 16px;
          font-family: 'Outfit', sans-serif;
          font-size: 13px; font-weight: 600; color: var(--muted);
          cursor: pointer; white-space: nowrap; flex-shrink: 0;
          transition: all 0.15s; -webkit-tap-highlight-color: transparent;
        }
        .year-pill.active {
          background: var(--red); border-color: var(--red);
          color: #fff; box-shadow: 0 4px 12px rgba(230,57,70,0.35);
        }
        .year-pill:active { transform: scale(0.95); }

        .section-label {
          padding: 12px 16px 10px;
          display: flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 800;
          color: var(--muted); text-transform: uppercase; letter-spacing: 0.12em;
        }
        .section-line { flex: 1; height: 1px; background: var(--border); }

        /* Paper cards */
        .papers { padding: 0 16px 20px; display: flex; flex-direction: column; gap: 10px; }

        .paper-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 14px; overflow: hidden;
          transition: transform 0.15s; -webkit-tap-highlight-color: transparent;
        }
        .paper-card:active { transform: scale(0.99); }

        .paper-accent { height: 3px; background: linear-gradient(90deg, var(--red), var(--gold)); }

        .paper-body { padding: 16px; }
        .paper-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 10px; margin-bottom: 10px;
        }
        .paper-title { font-size: 16px; font-weight: 700; line-height: 1.3; flex: 1; }
        .paper-year {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px; color: var(--red); flex-shrink: 0; line-height: 1;
        }
        .paper-tags { display: flex; gap: 6px; margin-bottom: 14px; }
        .tag {
          font-size: 10px; font-weight: 800; padding: 3px 10px;
          border-radius: 4px; text-transform: uppercase; letter-spacing: 0.08em;
        }
        .tag-paper { background: rgba(230,57,70,0.1); color: var(--red); border: 1px solid rgba(230,57,70,0.2); }
        .tag-pdf { background: rgba(42,157,143,0.1); color: #2A9D8F; border: 1px solid rgba(42,157,143,0.2); }

        /* Buttons */
        .actions { display: flex; gap: 8px; }
        .btn {
          flex: 1; padding: 11px 10px;
          border-radius: 10px; font-family: 'Outfit', sans-serif;
          font-size: 14px; font-weight: 700;
          cursor: pointer; border: 1px solid transparent;
          text-decoration: none;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all 0.15s; -webkit-tap-highlight-color: transparent;
        }
        .btn-view {
          background: rgba(230,57,70,0.1);
          border-color: rgba(230,57,70,0.25); color: var(--red);
        }
        .btn-view:active { background: rgba(230,57,70,0.2); transform: scale(0.97); }
        .btn-download {
          background: rgba(42,157,143,0.1);
          border-color: rgba(42,157,143,0.25); color: #2A9D8F;
        }
        .btn-download:active { background: rgba(42,157,143,0.2); transform: scale(0.97); }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

        .no-pdf {
          font-size: 13px; color: var(--muted); font-weight: 500;
          text-align: center; padding: 10px;
          background: var(--surface2); border-radius: 10px; border: 1px dashed var(--border);
        }

        .skeleton {
          background: linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite;
          border-radius: 14px; height: 140px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .footer {
          margin: 8px 16px 0; padding: 16px;
          border-top: 1px solid var(--border); text-align: center;
          font-size: 11px; color: var(--muted); font-weight: 500; letter-spacing: 0.04em;
        }
        .footer strong { color: var(--red); }

        .empty { text-align: center; padding: 52px 20px; color: var(--muted); }
        .empty-icon { font-size: 48px; margin-bottom: 14px; }
        .empty h3 { font-family: 'Bebas Neue', sans-serif; font-size: 24px; color: var(--text); margin-bottom: 6px; letter-spacing: 1px; }
        .empty p { font-size: 14px; }
      `}</style>

      <div className="topbar">
        <div className="topbar-row">
          <Link to={-1} className="back-btn">‹</Link>
          <div className="topbar-info">
            <div className="topbar-title">
              Papers
              {!loading && <span className="count-badge">{papers.length}</span>}
            </div>
            <div className="topbar-sub">
              {loading ? "Loading..." : `${filtered.length} paper${filtered.length !== 1 ? "s" : ""} found`}
            </div>
          </div>
        </div>
      </div>

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

      <div className="section-label">
        {activeYear === "All" ? "All Papers" : `Year ${activeYear}`}
        <div className="section-line" />
      </div>

      <div className="papers">
        {loading && Array(3).fill(0).map((_, i) => <div key={i} className="skeleton" />)}
        {!loading && filtered.map(paper => (
          <div key={paper.id} className="paper-card">
            <div className="paper-accent" />
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
          <h3>{search ? "Nothing Found" : "No Papers Yet"}</h3>
          <p>{search ? `No results for "${search}"` : "Check back soon!"}</p>
        </div>
      )}

      <div className="footer">
        Made with ❤️ by <strong>SFI KOTTAKKAL LC</strong>
      </div>
    </div>
  );
}

export default Papers;
