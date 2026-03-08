import { useEffect, useState } from "react";

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 800);
    const t3 = setTimeout(() => setPhase(3), 2000);
    const t4 = setTimeout(() => onDone(), 2700);
    return () => [t1,t2,t3,t4].forEach(clearTimeout);
  }, [onDone]);

  return (
    <div style={{ opacity: phase === 3 ? 0 : 1, transition: "opacity 0.7s ease" }}
      className="sp-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@400;500&display=swap');
        .sp-root {
          position: fixed; inset: 0; z-index: 9999;
          background: #050510;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          overflow: hidden; font-family: 'Syne', sans-serif;
        }
        .sp-orb {
          position: absolute; border-radius: 50%; filter: blur(100px);
          opacity: 0; transition: opacity 1.2s ease, transform 1.2s ease;
        }
        .sp-orb.on { opacity: var(--op); transform: scale(1.08); }
        .sp-o1 { width:500px;height:500px;top:-150px;left:-150px; background:radial-gradient(circle,#7C3AED,#4F46E5,transparent 70%); --op:0.4; }
        .sp-o2 { width:400px;height:400px;top:5%;right:-100px; background:radial-gradient(circle,#EC4899,#8B5CF6,transparent 70%); --op:0.3; transition-delay:0.15s; }
        .sp-o3 { width:420px;height:420px;bottom:-100px;left:0; background:radial-gradient(circle,#06B6D4,#3B82F6,transparent 70%); --op:0.32; transition-delay:0.3s; }
        .sp-o4 { width:280px;height:280px;bottom:5%;right:0; background:radial-gradient(circle,#10B981,#6366F1,transparent 70%); --op:0.22; transition-delay:0.45s; }

        .sp-grid {
          position:absolute;inset:0;opacity:0.03;
          background-image:linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px);
          background-size:60px 60px;
        }
        .sp-grain {
          position:absolute;inset:0;opacity:0.04;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size:256px;
        }

        .sp-center { position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:0; }

        .sp-ring {
          width:90px;height:90px;border-radius:26px;
          background:linear-gradient(135deg,#7C3AED,#4F46E5);
          display:flex;align-items:center;justify-content:center;
          font-size:42px;
          box-shadow:0 0 60px rgba(124,58,237,0.6), 0 0 120px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.2);
          opacity:0;transform:scale(0.6) translateY(20px);
          transition:opacity 0.6s cubic-bezier(0.34,1.56,0.64,1), transform 0.6s cubic-bezier(0.34,1.56,0.64,1);
          margin-bottom:24px;
        }
        .sp-ring.on { opacity:1;transform:scale(1) translateY(0); }

        .sp-name {
          font-size:32px;font-weight:800;letter-spacing:-0.8px;
          background:linear-gradient(90deg,#C084FC,#818CF8,#67E8F9);
          -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
          opacity:0;transform:translateY(14px);
          transition:opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s;
          margin-bottom:6px;
        }
        .sp-name.on { opacity:1;transform:translateY(0); }

        .sp-sub {
          font-family:'Outfit',sans-serif;font-size:14px;font-weight:400;
          color:rgba(255,255,255,0.4);letter-spacing:0.04em;
          opacity:0;transform:translateY(10px);
          transition:opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s;
          margin-bottom:40px;
        }
        .sp-sub.on { opacity:1;transform:translateY(0); }

        .sp-bar-wrap {
          width:140px;height:3px;border-radius:100px;
          background:rgba(255,255,255,0.08);
          overflow:hidden;
          opacity:0;transition:opacity 0.4s ease 0.3s;
        }
        .sp-bar-wrap.on { opacity:1; }
        .sp-bar {
          height:100%;border-radius:100px;
          background:linear-gradient(90deg,#7C3AED,#C084FC,#67E8F9);
          width:0%;animation:none;
        }
        .sp-bar.on { animation:loadBar 1.4s ease forwards; }
        @keyframes loadBar { 0%{width:0%}60%{width:75%}100%{width:100%} }

        .sp-dots {
          display:flex;gap:6px;margin-top:16px;
          opacity:0;transition:opacity 0.4s ease 0.4s;
        }
        .sp-dots.on { opacity:1; }
        .sp-dot {
          width:5px;height:5px;border-radius:50%;
          background:rgba(255,255,255,0.2);
          animation:dotPop 0.6s ease both;
        }
        .sp-dot:nth-child(1){animation-delay:0.5s;}
        .sp-dot:nth-child(2){animation-delay:0.65s;background:rgba(192,132,252,0.6);}
        .sp-dot:nth-child(3){animation-delay:0.8s;}
        @keyframes dotPop{from{transform:scale(0)}to{transform:scale(1)}}
      `}</style>

      <div className={`sp-orb sp-o1 ${phase>=1?"on":""}`}/>
      <div className={`sp-orb sp-o2 ${phase>=1?"on":""}`}/>
      <div className={`sp-orb sp-o3 ${phase>=1?"on":""}`}/>
      <div className={`sp-orb sp-o4 ${phase>=1?"on":""}`}/>
      <div className="sp-grid"/>
      <div className="sp-grain"/>

      <div className="sp-center">
        <div className={`sp-ring ${phase>=2?"on":""}`}>📚</div>
        <div className={`sp-name ${phase>=2?"on":""}`}>Question Bank</div>
        <div className={`sp-sub ${phase>=2?"on":""}`}>Model papers · Free · Always</div>
        <div className={`sp-bar-wrap ${phase>=2?"on":""}`}>
          <div className={`sp-bar ${phase>=2?"on":""}`}/>
        </div>
        <div className={`sp-dots ${phase>=2?"on":""}`}>
          <div className="sp-dot"/><div className="sp-dot"/><div className="sp-dot"/>
        </div>
      </div>
    </div>
  );
}
