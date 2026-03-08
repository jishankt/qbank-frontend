import { useEffect, useState } from "react";

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 600);
    const t3 = setTimeout(() => setPhase(3), 1800);
    const t4 = setTimeout(() => onDone(), 2400);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className="sp-root" style={{ opacity: phase === 3 ? 0 : 1, transition: "opacity 0.6s ease" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .sp-root {
          position: fixed; inset: 0; z-index: 9999;
          background: #FAFAF8;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          overflow: hidden;
        }

        /* Soft background blobs */
        .sp-blob {
          position: absolute; border-radius: 50%;
          opacity: 0; transition: opacity 1.4s ease, transform 1.4s ease;
          transform: scale(0.8);
        }
        .sp-blob.on { opacity: 1; transform: scale(1); }
        .sp-b1 {
          width: 380px; height: 380px; top: -100px; right: -80px;
          background: radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%);
        }
        .sp-b2 {
          width: 320px; height: 320px; bottom: -80px; left: -60px;
          background: radial-gradient(circle, rgba(236,72,153,0.06), transparent 70%);
          transition-delay: 0.2s;
        }
        .sp-b3 {
          width: 200px; height: 200px; top: 30%; left: 10%;
          background: radial-gradient(circle, rgba(16,185,129,0.05), transparent 70%);
          transition-delay: 0.4s;
        }

        /* Subtle dot grid */
        .sp-dots-bg {
          position: absolute; inset: 0; opacity: 0.4;
          background-image: radial-gradient(circle, #D1D5DB 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .sp-center {
          position: relative; z-index: 2;
          display: flex; flex-direction: column;
          align-items: center; gap: 0;
        }

        .sp-icon-wrap {
          width: 80px; height: 80px; border-radius: 24px;
          background: #1C1C1E;
          display: flex; align-items: center; justify-content: center;
          font-size: 36px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
          opacity: 0; transform: scale(0.7) translateY(16px);
          transition: opacity 0.55s cubic-bezier(0.34,1.56,0.64,1), transform 0.55s cubic-bezier(0.34,1.56,0.64,1);
          margin-bottom: 28px;
        }
        .sp-icon-wrap.on { opacity: 1; transform: scale(1) translateY(0); }

        .sp-name {
          font-family: 'Playfair Display', serif;
          font-size: 30px; font-weight: 800;
          color: #1C1C1E; letter-spacing: -0.5px;
          opacity: 0; transform: translateY(12px);
          transition: opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s;
          margin-bottom: 8px;
        }
        .sp-name.on { opacity: 1; transform: translateY(0); }

        .sp-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 400;
          color: #9CA3AF; letter-spacing: 0.08em; text-transform: uppercase;
          opacity: 0; transform: translateY(8px);
          transition: opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s;
          margin-bottom: 40px;
        }
        .sp-sub.on { opacity: 1; transform: translateY(0); }

        .sp-track {
          width: 120px; height: 2px; border-radius: 100px;
          background: #E5E7EB;
          overflow: hidden;
          opacity: 0; transition: opacity 0.4s ease 0.3s;
        }
        .sp-track.on { opacity: 1; }

        .sp-fill {
          height: 100%; border-radius: 100px;
          background: linear-gradient(90deg, #6366F1, #EC4899);
          width: 0%;
        }
        .sp-fill.on { animation: spLoad 1.3s cubic-bezier(0.4,0,0.2,1) forwards; }
        @keyframes spLoad { 0%{width:0%} 60%{width:72%} 100%{width:100%} }

        /* Small decorative label */
        .sp-tag {
          position: absolute; bottom: 40px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; color: #C4C9D4; letter-spacing: 0.1em;
          opacity: 0; transition: opacity 0.6s ease 0.5s;
        }
        .sp-tag.on { opacity: 1; }
      `}</style>

      <div className={`sp-blob sp-b1 ${phase >= 1 ? "on" : ""}`} />
      <div className={`sp-blob sp-b2 ${phase >= 1 ? "on" : ""}`} />
      <div className={`sp-blob sp-b3 ${phase >= 1 ? "on" : ""}`} />
      <div className="sp-dots-bg" />

      <div className="sp-center">
        <div className={`sp-icon-wrap ${phase >= 2 ? "on" : ""}`}>📚</div>
        <div className={`sp-name ${phase >= 2 ? "on" : ""}`}>Question Bank</div>
        <div className={`sp-sub ${phase >= 2 ? "on" : ""}`}>Model papers · Always free</div>
        <div className={`sp-track ${phase >= 2 ? "on" : ""}`}>
          <div className={`sp-fill ${phase >= 2 ? "on" : ""}`} />
        </div>
      </div>

      <div className={`sp-tag ${phase >= 2 ? "on" : ""}`}>by SFI KOTTAKKAL LC</div>
    </div>
  );
}
