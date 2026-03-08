import { useEffect, useState } from "react";

export default function SplashScreen({ onDone }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 80);
    const t2 = setTimeout(() => onDone(), 2000);
    return () => [t1, t2].forEach(clearTimeout);
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#FFFFFF",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&display=swap');
        .sp-wrap {
          display: flex; flex-direction: column; align-items: center;
          opacity: 0; transform: translateY(12px);
          animation: spIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both;
        }
        @keyframes spIn { to { opacity:1; transform:translateY(0); } }
        .sp-icon {
          width: 76px; height: 76px; border-radius: 22px;
          background: #1A1A1A;
          display: flex; align-items: center; justify-content: center;
          font-size: 34px; margin-bottom: 18px;
          box-shadow: 0 8px 28px rgba(0,0,0,0.12);
        }
        .sp-title {
          font-family: 'Nunito', sans-serif;
          font-size: 24px; font-weight: 900;
          color: #1A1A1A; letter-spacing: -0.3px; margin-bottom: 5px;
        }
        .sp-sub {
          font-family: 'Nunito', sans-serif;
          font-size: 14px; font-weight: 500; color: #AAAAAA;
          margin-bottom: 36px;
        }
        .sp-track {
          width: 90px; height: 3px; background: #F0F0F0;
          border-radius: 100px; overflow: hidden;
        }
        .sp-fill {
          height: 100%; background: #1A1A1A; border-radius: 100px;
          animation: spLoad 1.5s ease 0.4s both;
        }
        @keyframes spLoad { from{width:0%} to{width:100%} }
      `}</style>
      <div className="sp-wrap">
        <div className="sp-icon">📚</div>
        <div className="sp-title">Question Bank</div>
        <div className="sp-sub">Free papers for every student</div>
        <div className="sp-track"><div className="sp-fill" /></div>
      </div>
    </div>
  );
}
