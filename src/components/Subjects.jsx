import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../Api";
import { BottomNav } from "./Classes";

const subjectMeta = {
  math:{icon:"📐",acc:"#6366F1"},maths:{icon:"📐",acc:"#6366F1"},mathematics:{icon:"📐",acc:"#6366F1"},
  physics:{icon:"⚡",acc:"#0EA5E9"},chemistry:{icon:"⚗️",acc:"#F59E0B"},
  biology:{icon:"🌿",acc:"#10B981"},english:{icon:"✏️",acc:"#F97316"},
  malayalam:{icon:"🌴",acc:"#14B8A6"},hindi:{icon:"🪔",acc:"#EF4444"},
  history:{icon:"🏛️",acc:"#8B5CF6"},geography:{icon:"🌍",acc:"#06B6D4"},
  science:{icon:"🔬",acc:"#10B981"},computer:{icon:"💻",acc:"#6366F1"},
  economics:{icon:"📊",acc:"#F59E0B"},commerce:{icon:"💼",acc:"#EC4899"},
};
function getMeta(name="") {
  return subjectMeta[name.toLowerCase().split(" ")[0]] || { icon:"📖", acc:"#6366F1" };
}

export default function Subjects() {
  const { classId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get(`subjects/${classId}/`).then(r=>setSubjects(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  }, [classId]);

  const filtered = subjects.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="root">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          :root{--bg:#F6F5F2;--card:#FFFFFF;--bd:rgba(0,0,0,0.07);--bd2:rgba(0,0,0,0.1);--t1:#111110;--t2:rgba(17,17,16,0.48);--t3:rgba(17,17,16,0.26);--ac:#6366F1;}
          html,body{background:var(--bg);-webkit-font-smoothing:antialiased;overscroll-behavior:none;}
          .root{min-height:100vh;min-height:100dvh;background:var(--bg);font-family:'DM Sans',sans-serif;color:var(--t1);overflow-x:hidden;padding-bottom:calc(max(env(safe-area-inset-bottom),14px)+68px);}
          .bg-tex{position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(ellipse 55% 45% at 85% 8%,rgba(99,102,241,0.07) 0%,transparent 65%),radial-gradient(ellipse 45% 35% at 15% 85%,rgba(14,165,233,0.04) 0%,transparent 65%);}
          .page{position:relative;z-index:2;animation:pi 0.4s ease both;}
          @keyframes pi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
          @keyframes cardIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
          @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
          @keyframes heartbeat{0%,100%{transform:scale(1)}15%{transform:scale(1.3)}30%{transform:scale(1)}}

          .topbar{background:rgba(246,245,242,0.92);border-bottom:1px solid var(--bd);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);padding:max(env(safe-area-inset-top),52px) 20px 18px;position:sticky;top:0;z-index:20;}
          .trow{display:flex;align-items:center;gap:12px;}
          .back{width:40px;height:40px;border-radius:13px;flex-shrink:0;background:var(--card);border:1px solid var(--bd2);box-shadow:0 1px 4px rgba(0,0,0,0.06);display:flex;align-items:center;justify-content:center;font-size:22px;color:var(--ac);text-decoration:none;transition:transform 0.2s;-webkit-tap-highlight-color:transparent;}
          .back:active{transform:scale(0.88);}
          .ttitle{font-family:'Fraunces',serif;font-size:26px;font-weight:900;letter-spacing:-0.5px;color:var(--t1);}
          .tsub{font-size:12px;color:var(--t2);margin-top:2px;}

          .search-wrap{padding:14px 20px 0;}
          .sbox{display:flex;align-items:center;gap:10px;background:var(--card);border:1px solid var(--bd2);border-radius:16px;padding:0 16px;transition:border-color 0.2s,box-shadow 0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.05);}
          .sbox:focus-within{border-color:rgba(99,102,241,0.4);box-shadow:0 0 0 4px rgba(99,102,241,0.07);}
          .s-ico{font-size:15px;opacity:0.22;flex-shrink:0;}
          .s-in{flex:1;border:none;outline:none;padding:14px 0;font-family:'DM Sans',sans-serif;font-size:15px;color:var(--t1);background:transparent;}
          .s-in::placeholder{color:var(--t3);}
          .s-clr{background:rgba(0,0,0,0.06);color:var(--t2);width:22px;height:22px;border-radius:6px;border:none;font-size:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;-webkit-tap-highlight-color:transparent;}

          .sec-bar{display:flex;align-items:center;justify-content:space-between;padding:18px 20px 12px;}
          .sec-title{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:0.14em;}
          .sec-count{font-size:12px;font-weight:700;color:var(--ac);background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.12);padding:3px 11px;border-radius:100px;}

          .list{padding:0 20px 20px;display:flex;flex-direction:column;gap:8px;}
          .sub-card{background:var(--card);border:1px solid var(--bd);border-radius:18px;padding:16px 18px;text-decoration:none;color:var(--t1);display:flex;align-items:center;gap:14px;transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1);-webkit-tap-highlight-color:transparent;position:relative;overflow:hidden;animation:cardIn 0.35s ease both;box-shadow:0 1px 4px rgba(0,0,0,0.05);}
          .sub-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--sa);border-radius:18px 0 0 18px;}
          .sub-card:active{transform:scale(0.97);}
          .sub-icon{width:52px;height:52px;border-radius:15px;flex-shrink:0;background:var(--sa-bg);border:1px solid var(--sa-bd);display:flex;align-items:center;justify-content:center;font-size:27px;}
          .sub-info{flex:1;min-width:0;}
          .sub-name{font-family:'Fraunces',serif;font-size:17px;font-weight:700;letter-spacing:-0.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--t1);}
          .sub-hint{font-size:12px;color:var(--t2);margin-top:3px;}
          .sub-arrow{margin-left:auto;width:34px;height:34px;flex-shrink:0;border-radius:10px;background:var(--sa-bg);display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--sa);}

          .skel{background:linear-gradient(90deg,#f0eeeb 25%,#e7e5e0 50%,#f0eeeb 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:18px;height:84px;border:1px solid var(--bd);}

          .empty{text-align:center;padding:70px 20px;}
          .empty-icon{font-size:56px;display:block;margin-bottom:16px;}
          .empty-title{font-family:'Fraunces',serif;font-size:20px;font-weight:700;color:var(--t2);margin-bottom:8px;}
          .empty-sub{font-size:14px;color:var(--t3);}

          .footer{margin:8px 20px 0;background:var(--card);border:1px solid var(--bd);border-radius:20px;padding:18px 20px;display:flex;align-items:center;gap:14px;box-shadow:0 1px 4px rgba(0,0,0,0.04);}
          .footer-logo{width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#6366F1,#4F46E5);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;box-shadow:0 4px 14px rgba(99,102,241,0.28);}
          .footer-name{font-family:'Fraunces',serif;font-size:14px;font-weight:700;color:var(--t1);}
          .footer-sub{font-size:11px;color:var(--t2);margin-top:2px;}
          .footer-heart{margin-left:auto;font-size:20px;animation:heartbeat 1.8s ease-in-out infinite;}
        `}</style>

        <div className="bg-tex"/>
        <div className="page">
          <div className="topbar">
            <div className="trow">
              <Link to="/" className="back">‹</Link>
              <div>
                <div className="ttitle">Subjects</div>
                <div className="tsub">{loading?"Loading…":`${subjects.length} subject${subjects.length!==1?"s":""} available`}</div>
              </div>
            </div>
          </div>

          <div className="search-wrap">
            <div className="sbox">
              <span className="s-ico">🔍</span>
              <input className="s-in" placeholder="Search subjects…" value={search} onChange={e=>setSearch(e.target.value)}/>
              {search && <button className="s-clr" onClick={()=>setSearch("")}>✕</button>}
            </div>
          </div>

          <div className="sec-bar">
            <span className="sec-title">Available Subjects</span>
            {!loading && <span className="sec-count">{filtered.length}</span>}
          </div>

          <div className="list">
            {loading && Array(5).fill(0).map((_,i)=><div key={i} className="skel" style={{animationDelay:`${i*0.07}s`}}/>)}
            {!loading && filtered.map((sub,i)=>{
              const {icon,acc} = getMeta(sub.name);
              const bg = `${acc}12`;
              const bd = `${acc}30`;
              return (
                <Link key={sub.id} to={`/papers/${sub.id}`} className="sub-card"
                  style={{'--sa':acc,'--sa-bg':bg,'--sa-bd':bd,animationDelay:`${i*0.06}s`}}>
                  <div className="sub-icon">{icon}</div>
                  <div className="sub-info">
                    <div className="sub-name">{sub.name}</div>
                    <div className="sub-hint">Tap to view question papers</div>
                  </div>
                  <div className="sub-arrow">›</div>
                </Link>
              );
            })}
          </div>

          {!loading && filtered.length===0 && (
            <div className="empty">
              <span className="empty-icon">🔍</span>
              <div className="empty-title">Nothing found</div>
              <div className="empty-sub">No subjects match "{search}"</div>
            </div>
          )}

          <div className="footer">
            <div className="footer-logo">⭐</div>
            <div><div className="footer-name">SFI KOTTAKKAL LC</div><div className="footer-sub">Made with love for students</div></div>
            <div className="footer-heart">❤️</div>
          </div>
        </div>
      </div>
      <BottomNav/>
    </>
  );
}
