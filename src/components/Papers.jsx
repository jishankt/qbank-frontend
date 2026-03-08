import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";
import { BottomNav } from "./Classes";

// Detect language from paper title
function detectLang(title = "") {
  // Malayalam Unicode range: \u0D00-\u0D7F
  const hasMal = /[\u0D00-\u0D7F]/.test(title);
  if (hasMal) return "mal";
  // If title contains known Malayalam keywords
  const malKeywords = ["malayalam", "മലയാളം", "mal", "ഭാഷ"];
  const lower = title.toLowerCase();
  if (malKeywords.some(k => lower.includes(k))) return "mal";
  return "eng";
}

export default function Papers() {
  const { subjectId } = useParams();
  const [papers,      setPapers]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [downloading, setDownloading] = useState(null);
  const [activeYear,  setActiveYear]  = useState("All");
  const [activeLang,  setActiveLang]  = useState("all"); // "all" | "eng" | "mal"
  const [bookmarks,   setBookmarks]   = useState(
    () => JSON.parse(localStorage.getItem("bookmarks") || "[]")
  );
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    API.get(`papers/${subjectId}/`)
      .then(r => setPapers(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [subjectId]);

  // Attach lang to each paper
  const papersWithLang = papers.map(p => ({ ...p, lang: detectLang(p.title) }));

  // Check if this subject has both languages
  const hasEng = papersWithLang.some(p => p.lang === "eng");
  const hasMal = papersWithLang.some(p => p.lang === "mal");
  const showLangTabs = hasEng && hasMal;

  const years = ["All", ...new Set(papers.map(p => p.year).sort((a, b) => b - a))];

  const filtered = papersWithLang.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchYear   = activeYear === "All" || p.year === activeYear;
    const matchLang   = activeLang === "all"  || p.lang === activeLang;
    return matchSearch && matchYear && matchLang;
  });

  const isBookmarked = id => bookmarks.some(b => b.id === id);

  const toggleBookmark = paper => {
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

  const showToast = msg => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2200);
  };

  const handleDownload = async paper => {
    if (!paper.pdf) return;
    setDownloading(paper.id);
    try {
      const r = await fetch(paper.pdf);
      if (!r.ok) throw new Error();
      const blob = await r.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url;
      a.download = `${paper.title}_${paper.year}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      showToast("Download started ⬇");
    } catch {
      alert("Download failed. Try opening the PDF manually.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <>
      <div style={{
        minHeight: "100dvh",
        background: "#F7F7F7",
        paddingBottom: "calc(max(env(safe-area-inset-bottom),12px) + 68px)",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
          *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
          :root {
            --accent: #FF6B35;
            --accent-light: #FFF0EB;
            --accent-mid: #FFD5C5;
            --bg: #F7F7F7;
            --card: #FFFFFF;
            --t1: #1A1A1A;
            --t2: #666;
            --t3: #AAA;
            --border: #EBEBEB;
          }
          html, body { background: var(--bg); -webkit-font-smoothing: antialiased; overscroll-behavior: none; }
          * { font-family: 'Nunito', sans-serif; }

          .page { animation: fadeUp 0.3s ease both; }
          @keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

          /* top bar */
          .topbar {
            background: #fff; border-bottom: 1px solid var(--border);
            padding: max(env(safe-area-inset-top), 48px) 20px 16px;
            position: sticky; top: 0; z-index: 20;
          }
          .trow { display:flex; align-items:center; gap:12px; }
          .back {
            width: 38px; height: 38px; border-radius: 12px; flex-shrink: 0;
            background: var(--bg); border: 1px solid var(--border);
            display: flex; align-items: center; justify-content: center;
            font-size: 20px; color: var(--t1); text-decoration: none;
            -webkit-tap-highlight-color: transparent;
            transition: transform 0.15s;
          }
          .back:active { transform: scale(0.88); }
          .tinfo { flex: 1; min-width: 0; }
          .title-row { display: flex; align-items: center; gap: 8px; }
          .ttitle { font-size: 22px; font-weight: 900; color: var(--t1); letter-spacing: -0.3px; }
          .count-chip {
            font-size: 11px; font-weight: 800; color: var(--accent);
            background: var(--accent-light); border-radius: 100px; padding: 3px 10px;
          }
          .tsub { font-size: 12px; font-weight: 600; color: var(--t3); margin-top: 2px; }

          /* language tabs */
          .lang-tabs {
            display: flex; gap: 6px; padding: 12px 20px 0;
          }
          .lang-tab {
            flex: 1; padding: 10px 8px; border-radius: 12px;
            font-size: 13px; font-weight: 800; cursor: pointer;
            border: 1.5px solid var(--border);
            background: #fff; color: var(--t2);
            display: flex; align-items: center; justify-content: center; gap: 6px;
            transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
            -webkit-tap-highlight-color: transparent;
          }
          .lang-tab.active {
            background: var(--accent); border-color: var(--accent);
            color: #fff;
            box-shadow: 0 4px 14px rgba(255,107,53,0.28);
          }
          .lang-tab:not(.active):active { transform: scale(0.95); }
          .lang-flag { font-size: 16px; }
          .lang-count {
            font-size: 10px; font-weight: 800;
            background: rgba(255,255,255,0.25); border-radius: 100px;
            padding: 1px 7px; margin-left: 2px;
          }
          .lang-tab:not(.active) .lang-count {
            background: var(--bg); color: var(--t3);
          }

          /* search */
          .srch-wrap { padding: 12px 20px 0; }
          .srch {
            display: flex; align-items: center; gap: 8px;
            background: #fff; border: 1.5px solid var(--border);
            border-radius: 14px; padding: 0 14px;
            transition: border-color 0.2s, box-shadow 0.2s;
          }
          .srch:focus-within {
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(255,107,53,0.1);
          }
          .srch-ico { font-size: 14px; opacity: 0.3; flex-shrink: 0; }
          .srch input {
            flex: 1; border: none; outline: none; padding: 13px 0;
            font-size: 14px; font-weight: 600; color: var(--t1); background: transparent;
          }
          .srch input::placeholder { color: var(--t3); font-weight: 500; }
          .srch-clr {
            background: #f5f5f5; border: none; border-radius: 6px;
            width: 20px; height: 20px; font-size: 10px;
            color: var(--t2); display: flex; align-items: center; justify-content: center;
            cursor: pointer; -webkit-tap-highlight-color: transparent;
          }

          /* year pills */
          .year-row { display: flex; gap: 7px; overflow-x: auto; padding: 10px 20px 0; scrollbar-width: none; }
          .year-row::-webkit-scrollbar { display: none; }
          .ypill {
            background: #fff; border: 1.5px solid var(--border);
            border-radius: 100px; padding: 7px 16px;
            font-size: 12px; font-weight: 700; color: var(--t2);
            cursor: pointer; white-space: nowrap; flex-shrink: 0;
            transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
            -webkit-tap-highlight-color: transparent;
          }
          .ypill.active {
            background: var(--t1); border-color: var(--t1);
            color: #fff; box-shadow: 0 3px 10px rgba(0,0,0,0.18);
          }
          .ypill:not(.active):active { transform: scale(0.93); }

          /* section bar */
          .sec { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px 8px; }
          .sec-t { font-size: 11px; font-weight: 800; color: var(--t3); text-transform: uppercase; letter-spacing: 0.12em; }
          .sec-c { font-size: 12px; font-weight: 700; color: var(--t2); }

          /* paper cards */
          .papers { padding: 0 20px 20px; display: flex; flex-direction: column; gap: 10px; }

          .pcard {
            background: #fff; border: 1.5px solid var(--border);
            border-radius: 20px; overflow: hidden;
            animation: cardIn 0.3s ease both;
            box-shadow: 0 1px 6px rgba(0,0,0,0.04);
          }
          @keyframes cardIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

          .pcard-head {
            padding: 14px 18px 12px;
            border-bottom: 1px solid var(--border);
            background: #FAFAFA;
            display: flex; align-items: center; justify-content: space-between;
          }
          .year-block { display: flex; align-items: baseline; gap: 5px; }
          .year-big { font-size: 28px; font-weight: 900; color: var(--t1); line-height: 1; letter-spacing: -0.5px; }
          .year-lbl { font-size: 10px; font-weight: 700; color: var(--t3); text-transform: uppercase; letter-spacing: 0.1em; }

          .head-right { display: flex; align-items: center; gap: 8px; }

          /* lang badge on card */
          .lang-badge {
            font-size: 10px; font-weight: 800; padding: 4px 10px;
            border-radius: 8px; text-transform: uppercase; letter-spacing: 0.06em;
          }
          .lang-badge.eng { background: #EFF6FF; color: #2563EB; }
          .lang-badge.mal { background: #F0FDF4; color: #15803D; }

          .pdf-badge {
            font-size: 10px; font-weight: 800; padding: 4px 10px;
            border-radius: 8px; background: var(--accent-light); color: var(--accent);
          }

          .bm-btn {
            width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
            background: #fff; border: 1.5px solid var(--border);
            display: flex; align-items: center; justify-content: center;
            font-size: 16px; cursor: pointer;
            transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
            -webkit-tap-highlight-color: transparent;
          }
          .bm-btn.saved { background: #FEFCE8; border-color: #FDE047; }
          .bm-btn:active { transform: scale(0.78); }

          .pcard-body { padding: 14px 18px 16px; }
          .paper-title {
            font-size: 14px; font-weight: 700; line-height: 1.5;
            color: var(--t1); margin-bottom: 14px;
          }

          .actions { display: flex; gap: 8px; }
          .btn {
            flex: 1; padding: 11px 8px; border-radius: 12px;
            font-size: 13px; font-weight: 800; cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 6px;
            transition: transform 0.15s; text-decoration: none;
            -webkit-tap-highlight-color: transparent;
          }
          .btn-view { background: #EFF6FF; border: 1.5px solid #BFDBFE; color: #1D4ED8; }
          .btn-view:active { transform: scale(0.95); background: #DBEAFE; }
          .btn-dl   { background: var(--accent-light); border: 1.5px solid var(--accent-mid); color: var(--accent); }
          .btn-dl:active { transform: scale(0.95); background: var(--accent-mid); }
          .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

          .no-pdf {
            font-size: 12px; font-weight: 600; color: var(--t3);
            text-align: center; padding: 12px;
            background: #FAFAFA; border-radius: 10px;
            border: 1px dashed var(--border);
          }

          /* skeleton */
          .skel {
            border-radius: 20px; height: 148px; border: 1px solid var(--border);
            background: linear-gradient(90deg,#f8f8f8 25%,#f0f0f0 50%,#f8f8f8 75%);
            background-size: 200% 100%; animation: shim 1.4s infinite;
          }
          @keyframes shim { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

          /* empty */
          .empty { text-align: center; padding: 60px 20px; }
          .empty-icon { font-size: 48px; display: block; margin-bottom: 12px; }
          .empty-t { font-size: 18px; font-weight: 800; color: var(--t2); margin-bottom: 6px; }
          .empty-s { font-size: 13px; font-weight: 500; color: var(--t3); }

          /* footer */
          .footer {
            margin: 4px 20px 0; background: #fff; border: 1px solid var(--border);
            border-radius: 18px; padding: 15px 18px;
            display: flex; align-items: center; gap: 12px;
          }
          .footer-ico { width: 38px; height: 38px; border-radius: 11px; background: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; }
          .footer-name { font-size: 13px; font-weight: 800; color: var(--t1); }
          .footer-sub { font-size: 11px; font-weight: 500; color: var(--t3); margin-top: 1px; }
          .footer-heart { margin-left: auto; font-size: 17px; animation: hb 2s ease-in-out infinite; }
          @keyframes hb { 0%,100%{transform:scale(1)} 15%{transform:scale(1.3)} 30%{transform:scale(1)} }

          /* toast */
          .toast {
            position: fixed; bottom: 84px; left: 50%;
            transform: translateX(-50%) translateY(12px);
            background: #1A1A1A; border-radius: 100px;
            padding: 10px 20px; font-size: 13px; font-weight: 700; color: #fff;
            white-space: nowrap; z-index: 500;
            opacity: 0; transition: opacity 0.22s, transform 0.22s;
            pointer-events: none; box-shadow: 0 6px 20px rgba(0,0,0,0.18);
          }
          .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
        `}</style>

        <div className={`toast ${toastMsg ? "show" : ""}`}>{toastMsg}</div>

        <div className="page">
          {/* Top bar */}
          <div className="topbar">
            <div className="trow">
              <Link to={-1} className="back">‹</Link>
              <div className="tinfo">
                <div className="title-row">
                  <span className="ttitle">Papers</span>
                  {!loading && <span className="count-chip">{papers.length}</span>}
                </div>
                <div className="tsub">
                  {loading ? "Loading…" : `${filtered.length} paper${filtered.length !== 1 ? "s" : ""} found`}
                </div>
              </div>
            </div>
          </div>

          {/* Language tabs — only shown when both languages exist */}
          {!loading && showLangTabs && (
            <div className="lang-tabs">
              <button
                className={`lang-tab ${activeLang === "all" ? "active" : ""}`}
                onClick={() => setActiveLang("all")}
              >
                <span className="lang-flag">📋</span>
                All
                <span className="lang-count">{papers.length}</span>
              </button>
              <button
                className={`lang-tab ${activeLang === "eng" ? "active" : ""}`}
                onClick={() => setActiveLang("eng")}
              >
                <span className="lang-flag">🇬🇧</span>
                English
                <span className="lang-count">
                  {papersWithLang.filter(p => p.lang === "eng").length}
                </span>
              </button>
              <button
                className={`lang-tab ${activeLang === "mal" ? "active" : ""}`}
                onClick={() => setActiveLang("mal")}
              >
                <span className="lang-flag">🌴</span>
                Malayalam
                <span className="lang-count">
                  {papersWithLang.filter(p => p.lang === "mal").length}
                </span>
              </button>
            </div>
          )}

          {/* Search */}
          <div className="srch-wrap">
            <div className="srch">
              <span className="srch-ico">🔍</span>
              <input
                placeholder="Search papers…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="srch-clr" onClick={() => setSearch("")}>✕</button>
              )}
            </div>
          </div>

          {/* Year filter pills */}
          {!loading && years.length > 1 && (
            <div className="year-row">
              {years.map(y => (
                <button
                  key={y}
                  className={`ypill ${activeYear === y ? "active" : ""}`}
                  onClick={() => setActiveYear(y)}
                >
                  {y === "All" ? "All Years" : y}
                </button>
              ))}
            </div>
          )}

          {/* Section label */}
          <div className="sec">
            <span className="sec-t">
              {activeLang === "mal" ? "Malayalam Papers" :
               activeLang === "eng" ? "English Papers"  : "All Papers"}
              {activeYear !== "All" ? ` · ${activeYear}` : ""}
            </span>
            {!loading && <span className="sec-c">{filtered.length}</span>}
          </div>

          {/* Paper list */}
          <div className="papers">
            {loading && Array(3).fill(0).map((_, i) => (
              <div key={i} className="skel" style={{ animationDelay: `${i * 0.09}s` }} />
            ))}

            {!loading && filtered.map((paper, i) => (
              <div key={paper.id} className="pcard" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="pcard-head">
                  <div className="year-block">
                    <span className="year-big">{paper.year}</span>
                    <span className="year-lbl">Year</span>
                  </div>
                  <div className="head-right">
                    {/* Show lang badge only when showing "all" */}
                    {activeLang === "all" && showLangTabs && (
                      <span className={`lang-badge ${paper.lang}`}>
                        {paper.lang === "mal" ? "🌴 Mal" : "🇬🇧 Eng"}
                      </span>
                    )}
                    {paper.pdf && <span className="pdf-badge">PDF ✓</span>}
                    <button
                      className={`bm-btn ${isBookmarked(paper.id) ? "saved" : ""}`}
                      onClick={() => toggleBookmark(paper)}
                      title={isBookmarked(paper.id) ? "Remove bookmark" : "Save paper"}
                    >
                      {isBookmarked(paper.id) ? "⭐" : "☆"}
                    </button>
                  </div>
                </div>

                <div className="pcard-body">
                  <div className="paper-title">{paper.title}</div>
                  {paper.pdf ? (
                    <div className="actions">
                      <a
                        href={paper.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-view"
                      >
                        👁 View
                      </a>
                      <button
                        onClick={() => handleDownload(paper)}
                        disabled={downloading === paper.id}
                        className="btn btn-dl"
                      >
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

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="empty">
              <span className="empty-icon">{search ? "🔍" : "📭"}</span>
              <div className="empty-t">
                {search ? "Nothing found" : "No papers yet"}
              </div>
              <div className="empty-s">
                {search
                  ? `No results for "${search}"`
                  : activeLang === "mal"
                  ? "No Malayalam papers available"
                  : activeLang === "eng"
                  ? "No English papers available"
                  : "Check back soon!"}
              </div>
            </div>
          )}

          <div className="footer">
            <div className="footer-ico">⭐</div>
            <div>
              <div className="footer-name">SFI Kottakkal LC</div>
              <div className="footer-sub">Made with love for students</div>
            </div>
            <div className="footer-heart">❤️</div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
