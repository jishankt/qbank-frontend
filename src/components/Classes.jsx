import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../api";
import SplashScreen from "./SplashScreen";
import Confetti from "./Cofetti";

const classEmoji = ["🎯","📐","🔬","🌍","📜","💡","🧬","🏛️","⚗️","🎨","🎭","🌿"];
const cardAccents = ["#6366F1","#EC4899","#0EA5E9","#10B981","#F59E0B","#EF4444","#8B5CF6","#14B8A6","#F97316","#84CC16","#D946EF","#06B6D4"];

function formatCount(n) {
  if (n === null || n === undefined) return "0";
  const num = parseInt(n, 10);
  if (isNaN(num)) return "0";
  if (num >= 1000000) return (num/1000000).toFixed(1)+"M";
  if (num >= 1000) return (num/1000).toFixed(1)+"K";
  return num.toString();
}

export function BottomNav() {
  const loc = useLocation();
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  const active = (path) => loc.pathname === path;
  return (
    <nav className="bnav">
      <style>{`
        .bnav{position:fixed;bottom:0;left:0;right:0;z-index:100;background:rgba(255,255,255,0.94);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);border-top:1px solid rgba(0,0,0,0.07);display:flex;align-items:center;padding:10px 0 max(env(safe-area-inset-bottom),10px);padding-bottom:max(env(safe-area-inset-bottom),14px);box-shadow:0 -1px 0 rgba(0,0,0,0.04),0 -8px 24px rgba(0,0,0,0.05);}
        .bnav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;text-decoration:none;padding:4px 0;-webkit-tap-highlight-color:transparent;transition:transform 0.15s;position:relative;}
        .bnav-item:active{transform:scale(0.88);}
        .bnav-ico{font-size:22px;line-height:1;opacity:0.22;transition:all 0.2s;filter:grayscale(1);}
        .bnav-item.active .bnav-ico{opacity:1;filter:none;}
        .bnav-lbl{font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;color:rgba(0,0,0,0.28);letter-spacing:0.04em;transition:color 0.2s;}
        .bnav-item.active .bnav-lbl{color:#6366F1;font-weight:700;}
        .bnav-dot{position:absolute;bottom:-2px;width:4px;height:4px;border-radius:50%;background:#6366F1;}
        .bnav-badge{position:absolute;top:0;right:calc(50% - 18px);background:#EC4899;color:#fff;font-size:9px;font-weight:800;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;}
      `}</style>
      <Link to="/" className={`bnav-item ${active("/")?"active":""}`}>
        <span className="bnav-ico">🏠</span><span className="bnav-lbl">Home</span>
        {active("/") && <div className="bnav-dot"/>}
      </Link>
      <Link to="/bookmarks" className={`bnav-item ${active("/bookmarks")?"active":""}`}>
        <span className="bnav-ico">⭐</span><span className="bnav-lbl">Saved</span>
        {bookmarks.length > 0 && <div className="bnav-badge">{bookmarks.length > 9 ? "9+" : bookmarks.length}</div>}
        {active("/bookmarks") && <div className="bnav-dot"/>}
      </Link>
      <Link to="/about" className={`bnav-item ${active("/about")?"active":""}`}>
        <span className="bnav-ico">ℹ️</span><span className="bnav-lbl">About</span>
        {active("/about") && <div className="bnav-dot"/>}
      </Link>
    </nav>
  );
}

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [visitors, setVisitors] = useState(null);
  const [totalPapers, setTotalPapers] = useState(null);
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem("splashDone"));
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    API.get("classes/").then(r=>setClasses(r.data)).catch(()=>{}).finally(()=>setLoading(false));
    API.get("papers/count/").then(r=>setTotalPapers(r.data.count)).catch(()=>setTotalPapers("?"));
    const seen = sessionStorage.getItem("visited");
    if (!seen) {
      sessionStorage.setItem("visited","1");
      API.post("visitors/increment/").then(r=>setVisitors(r.data.count)).catch(()=>setVisitors(0));
    } else {
      API.get("visitors/").then(r=>setVisitors(r.data.count)).catch(()=>setVisitors(0));
    }
  }, []);

  const handleSplashDone = () => {
    sessionStorage.setItem("splashDone","1");
    setShowSplash(false);
    if (!localStorage.getItem("confettiShown")) {
      localStorage.setItem("confettiShown","1");
      setShowConfetti(true);
    }
  };

  const filtered = classes.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      {showSplash && <SplashScreen onDone={handleSplashDone}/>}
      {showConfetti && <Confetti onDone={()=>setShowConfetti(false)}/>}
      <div className="root">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          :root{--bg:#F6F5F2;--card:#FFFFFF;--bd:rgba(0,0,0,0.07);--bd2:rgba(0,0,0,0.1);--t1:#111110;--t2:rgba(17,17,16,0.48);--t3:rgba(17,17,16,0.26);--ac:#6366F1;}
          html,body{background:var(--bg);-webkit-font-smoothing:antialiased;overscroll-behavior:none;}
          .root{min-height:100vh;min-height:100dvh;background:var(--bg);font-family:'DM Sans',sans-serif;color:var(--t1);overflow-x:hidden;padding-bottom:calc(max(env(safe-area-inset-bottom),14px)+68px);}
          .bg-tex{position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(ellipse 60% 45% at 10% 0%,rgba(99,102,241,0.08) 0%,transparent 65%),radial-gradient(ellipse 45% 35% at 90% 100%,rgba(236,72,153,0.05) 0%,transparent 65%);}
          .page{position:relative;z-index:2;animation:pageIn 0.4s ease both;}
          @keyframes pageIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
          @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
          @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
          @keyframes heartbeat{0%,100%{transform:scale(1)}15%{transform:scale(1.3)}30%{transform:scale(1)}}
          @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.5);opacity:0.5}}
          @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
          @keyframes cardIn{from{opacity:0;transform:scale(0.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}

          .header{background:rgba(246,245,242,0.92);border-bottom:1px solid var(--bd);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);padding:max(env(safe-area-inset-top),52px) 20px 24px;position:sticky;top:0;z-index:20;}
          .brand-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;}
          .brand-pill{display:inline-flex;align-items:center;gap:8px;background:var(--card);border:1px solid var(--bd2);border-radius:100px;padding:6px 14px 6px 6px;box-shadow:0 1px 4px rgba(0,0,0,0.06);}
          .brand-cube{width:24px;height:24px;border-radius:8px;background:linear-gradient(135deg,#6366F1,#4F46E5);display:flex;align-items:center;justify-content:center;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;color:#fff;box-shadow:0 2px 8px rgba(99,102,241,0.3);}
          .brand-text{font-size:11px;font-weight:600;color:var(--t2);letter-spacing:0.08em;text-transform:uppercase;}
          .notif-btn{width:40px;height:40px;border-radius:13px;background:var(--card);border:1px solid var(--bd2);display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;position:relative;box-shadow:0 1px 4px rgba(0,0,0,0.06);-webkit-tap-highlight-color:transparent;}
          .notif-dot{position:absolute;top:9px;right:10px;width:6px;height:6px;border-radius:50%;background:#EC4899;animation:blink 2s ease-in-out infinite;}
          .hero-title{font-family:'Fraunces',serif;font-size:46px;font-weight:900;letter-spacing:-1.5px;line-height:0.95;margin-bottom:10px;color:var(--t1);}
          .hero-accent{background:linear-gradient(135deg,#6366F1 0%,#EC4899 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}
          .hero-sub{font-size:14px;font-weight:400;color:var(--t2);}

          .sponsor-wrap{padding:16px 20px 0;}
          .sponsor{background:var(--card);border:1px solid var(--bd);border-radius:18px;padding:15px 18px;display:flex;align-items:center;gap:14px;box-shadow:0 2px 10px rgba(0,0,0,0.05);position:relative;overflow:hidden;}
          .spon-stripe{position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(180deg,#FBBF24,#F59E0B);border-radius:18px 0 0 18px;}
          .spon-icon{width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg,#FDE68A,#FBBF24);display:flex;align-items:center;justify-content:center;font-size:21px;flex-shrink:0;}
          .spon-by{font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:0.1em;}
          .spon-name{font-family:'Fraunces',serif;font-size:15px;font-weight:700;color:var(--t1);margin-top:1px;}
          .spon-chip{margin-left:auto;background:#FFFBEB;border:1px solid #FDE68A;border-radius:100px;padding:4px 12px;font-size:10px;font-weight:700;color:#B45309;flex-shrink:0;}

          .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:14px 20px 0;}
          .stat{background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:16px 8px;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,0.04);animation:fadeUp 0.4s ease both;}
          .stat:nth-child(1){animation-delay:0.1s}.stat:nth-child(2){animation-delay:0.15s}.stat:nth-child(3){animation-delay:0.2s}.stat:nth-child(4){animation-delay:0.25s}
          .stat-n{font-family:'Fraunces',serif;font-size:22px;font-weight:900;line-height:1;margin-bottom:4px;color:var(--t1);}
          .stat-k{font-size:9px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:0.12em;}

          .vis-wrap{padding:12px 20px 0;}
          .vis-card{background:linear-gradient(135deg,#6366F1,#4F46E5);border-radius:20px;padding:20px 22px;display:flex;align-items:center;gap:16px;position:relative;overflow:hidden;box-shadow:0 8px 28px rgba(99,102,241,0.22);}
          .vis-card::before{content:'';position:absolute;top:-30px;right:-30px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,0.09);}
          .vis-card::after{content:'';position:absolute;bottom:-20px;right:30px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.05);}
          .vis-icon{width:52px;height:52px;border-radius:15px;flex-shrink:0;background:rgba(255,255,255,0.16);display:flex;align-items:center;justify-content:center;font-size:28px;}
          .vis-n{font-family:'Fraunces',serif;font-size:36px;font-weight:900;line-height:1;letter-spacing:-1px;color:#fff;}
          .vis-lbl{font-size:12px;font-weight:500;color:rgba(255,255,255,0.65);margin-top:4px;}
          .live-pill{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.16);border:1px solid rgba(255,255,255,0.22);padding:6px 14px;border-radius:100px;font-size:11px;font-weight:700;color:#fff;flex-shrink:0;}
          .live-dot{width:7px;height:7px;border-radius:50%;background:#4ADE80;box-shadow:0 0 6px #4ADE80;animation:pulse 1.6s ease-in-out infinite;}
          .vis-skel{height:92px;border-radius:20px;background:linear-gradient(90deg,#edecea 25%,#e4e2de 50%,#edecea 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border:1px solid var(--bd);}

          .search-wrap{padding:14px 20px 0;}
          .sbox{display:flex;align-items:center;gap:10px;background:var(--card);border:1px solid var(--bd2);border-radius:16px;padding:0 16px;transition:border-color 0.2s,box-shadow 0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.05);}
          .sbox:focus-within{border-color:rgba(99,102,241,0.4);box-shadow:0 0 0 4px rgba(99,102,241,0.07);}
          .s-ico{font-size:16px;opacity:0.22;flex-shrink:0;}
          .s-in{flex:1;border:none;outline:none;padding:14px 0;font-family:'DM Sans',sans-serif;font-size:15px;color:var(--t1);background:transparent;}
          .s-in::placeholder{color:var(--t3);}
          .s-clr{background:rgba(0,0,0,0.06);color:var(--t2);width:22px;height:22px;border-radius:6px;border:none;font-size:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;-webkit-tap-highlight-color:transparent;}

          .sec-bar{display:flex;align-items:center;justify-content:space-between;padding:20px 20px 12px;}
          .sec-title{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:0.14em;}
          .sec-count{font-size:12px;font-weight:700;color:var(--ac);background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.12);padding:3px 11px;border-radius:100px;}

          .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;padding:0 20px 20px;}
          .cls-card{background:var(--card);border:1px solid var(--bd);border-radius:22px;padding:18px;text-decoration:none;color:var(--t1);display:flex;flex-direction:column;gap:14px;position:relative;overflow:hidden;transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.2s;-webkit-tap-highlight-color:transparent;animation:cardIn 0.35s ease both;box-shadow:0 1px 4px rgba(0,0,0,0.05);}
          .cls-stripe{position:absolute;top:0;left:0;right:0;height:3px;background:var(--acc);border-radius:22px 22px 0 0;}
          .cls-card:active{transform:scale(0.95);box-shadow:0 2px 8px rgba(0,0,0,0.08);}
          .cls-top{display:flex;align-items:flex-start;justify-content:space-between;margin-top:6px;}
          .cls-emoji-wrap{width:46px;height:46px;border-radius:14px;background:var(--acc-bg);display:flex;align-items:center;justify-content:center;font-size:24px;}
          .cls-num{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;color:var(--t3);letter-spacing:0.05em;}
          .cls-name{font-family:'Fraunces',serif;font-size:17px;font-weight:700;letter-spacing:-0.3px;line-height:1.2;color:var(--t1);}
          .cls-hint{font-size:11px;color:var(--t3);margin-top:3px;}
          .cls-foot{display:flex;align-items:center;justify-content:space-between;}
          .cls-open{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;color:var(--t3);}
          .cls-arrow{width:30px;height:30px;border-radius:9px;background:var(--acc-bg);display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--acc);}

          .skel{background:linear-gradient(90deg,#f0eeeb 25%,#e7e5e0 50%,#f0eeeb 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:22px;height:140px;border:1px solid var(--bd);}

          .empty{text-align:center;padding:70px 20px;}
          .empty-icon{font-size:56px;display:block;margin-bottom:16px;}
          .empty-title{font-family:'Fraunces',serif;font-size:22px;font-weight:700;color:var(--t2);margin-bottom:8px;}
          .empty-sub{font-size:14px;color:var(--t3);}

          .footer{margin:8px 20px 0;background:var(--card);border:1px solid var(--bd);border-radius:20px;padding:18px 20px;display:flex;align-items:center;gap:14px;box-shadow:0 1px 4px rgba(0,0,0,0.04);}
          .footer-logo{width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#6366F1,#4F46E5);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;box-shadow:0 4px 14px rgba(99,102,241,0.28);}
          .footer-name{font-family:'Fraunces',serif;font-size:14px;font-weight:700;color:var(--t1);}
          .footer-sub{font-size:11px;color:var(--t2);margin-top:2px;}
          .footer-heart{margin-left:auto;font-size:20px;animation:heartbeat 1.8s ease-in-out infinite;}
        `}</style>

        <div className="bg-tex"/>
        <div className="page">
          <div className="header">
            <div className="brand-row">
              <div className="brand-pill">
                <div className="brand-cube">Q</div>
                <span className="brand-text">Question Bank</span>
              </div>
              <div className="notif-btn">🔔<div className="notif-dot"/></div>
            </div>
            <div className="hero-title">Find your<br/><span className="hero-accent">Papers.</span></div>
            <div className="hero-sub">Model questions · Always free · Always yours</div>
          </div>

          <div className="sponsor-wrap">
            <div className="sponsor">
              <div className="spon-stripe"/>
              <div className="spon-icon">⭐</div>
              <div style={{marginLeft:'4px'}}>
                <div className="spon-by">Official Sponsor</div>
                <div className="spon-name">SFI KOTTAKKAL LC</div>
              </div>
              <div className="spon-chip">✦ Official</div>
            </div>
          </div>

          <div className="stats">
            {[
              {v: loading?"—":classes.length, k:"Classes"},
              {v: totalPapers??"—", k:"Papers"},
              {v: visitors!==null?formatCount(visitors):"—", k:"Visitors"},
              {v:"Free", k:"Always"},
            ].map(({v,k})=>(
              <div className="stat" key={k}>
                <div className="stat-n">{v}</div>
                <div className="stat-k">{k}</div>
              </div>
            ))}
          </div>

          <div className="vis-wrap">
            {visitors===null ? <div className="vis-skel"/> : (
              <div className="vis-card">
                <div className="vis-icon">👥</div>
                <div style={{flex:1}}>
                  <div className="vis-n">{formatCount(visitors)}</div>
                  <div className="vis-lbl">Total Visitors</div>
                </div>
                <div className="live-pill"><div className="live-dot"/>Live</div>
              </div>
            )}
          </div>

          <div className="search-wrap">
            <div className="sbox">
              <span className="s-ico">🔍</span>
              <input className="s-in" placeholder="Search classes…" value={search} onChange={e=>setSearch(e.target.value)}/>
              {search && <button className="s-clr" onClick={()=>setSearch("")}>✕</button>}
            </div>
          </div>

          <div className="sec-bar">
            <span className="sec-title">All Classes</span>
            {!loading && <span className="sec-count">{filtered.length}</span>}
          </div>

          <div className="grid">
            {loading && Array(6).fill(0).map((_,i)=><div key={i} className="skel" style={{animationDelay:`${i*0.07}s`}}/>)}
            {!loading && filtered.map((cls,i)=>{
              const acc = cardAccents[i % cardAccents.length];
              return (
                <Link key={cls.id} to={`/subjects/${cls.id}`} className="cls-card"
                  style={{'--acc':acc,'--acc-bg':`${acc}14`,animationDelay:`${0.05*i}s`}}>
                  <div className="cls-stripe"/>
                  <div className="cls-top">
                    <div className="cls-emoji-wrap">{classEmoji[i%classEmoji.length]}</div>
                    <span className="cls-num">{String(i+1).padStart(2,"0")}</span>
                  </div>
                  <div>
                    <div className="cls-name">Class {cls.name}</div>
                    <div className="cls-hint">Tap to explore</div>
                  </div>
                  <div className="cls-foot">
                    <span className="cls-open">Open</span>
                    <div className="cls-arrow">→</div>
                  </div>
                </Link>
              );
            })}
          </div>

          {!loading && filtered.length===0 && (
            <div className="empty">
              <span className="empty-icon">🔍</span>
              <div className="empty-title">Nothing found</div>
              <div className="empty-sub">No classes match "{search}"</div>
            </div>
          )}

          <div className="footer">
            <div className="footer-logo">⭐</div>
            <div>
              <div className="footer-name">SFI KOTTAKKAL LC</div>
              <div className="footer-sub">Made with love for students</div>
            </div>
            <div className="footer-heart">❤️</div>
          </div>
          <div style={{height:'16px'}}/>
        </div>
      </div>
      <BottomNav/>
    </>
  );
}
