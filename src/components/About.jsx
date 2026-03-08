import { useState } from "react";
import { Link } from "react-router-dom";
import { BottomNav } from "./classes";

const TEAM = [
  { name: "SFI Kottakkal LC", role: "Official Sponsor", emoji: "⭐", glow: "#F59E0B" },
  { name: "Student Council", role: "Content Curators", emoji: "🎓", glow: "#A855F7" },
  { name: "Tech Team", role: "Developers", emoji: "💻", glow: "#3B82F6" },
];

const FEATURES = [
  { icon: "📚", title: "Free Forever", desc: "All question papers are completely free. No paywalls, no sign-ups." },
  { icon: "🔍", title: "Smart Search", desc: "Instantly search across classes, subjects, and years." },
  { icon: "⭐", title: "Save Papers", desc: "Bookmark your favourites and access them anytime offline." },
  { icon: "📥", title: "Download PDF", desc: "Download any paper directly to your device in one tap." },
  { icon: "🌙", title: "Beautiful UI", desc: "Crafted with aurora glassmorphism design for a premium feel." },
  { icon: "📊", title: "Live Stats", desc: "Real-time visitor counter powered by our backend." },
];

const STATS = [
  { val: "12+", label: "Classes" },
  { val: "50+", label: "Subjects" },
  { val: "200+", label: "Papers" },
  { val: "∞", label: "Free" },
];

export default function About() {
  const [expanded, setExpanded] = useState(null);
  const faqs = [
    { q: "Is this app completely free?", a: "Yes! Every single question paper on this platform is 100% free. We believe education should be accessible to all students." },
    { q: "Who uploads the papers?", a: "Papers are curated and uploaded by our dedicated content team and student volunteers, verified for accuracy before publishing." },
    { q: "How do I save a paper?", a: "On any paper card, tap the ☆ bookmark icon to save it. Access all saved papers from the ⭐ Saved tab in the bottom navigation." },
    { q: "Can I use this offline?", a: "You can download PDFs to your device for offline access. Saved bookmarks also persist locally in your browser." },
    { q: "How do I report a missing paper?", a: "Reach out to SFI Kottakkal LC directly through your institution. We're always working to add more content." },
  ];

  return (
    <>
      <div className="root">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          :root{
            --g1:rgba(255,255,255,0.06);--gb:rgba(255,255,255,0.11);
            --t1:rgba(255,255,255,0.95);--t2:rgba(255,255,255,0.52);--t3:rgba(255,255,255,0.26);
            --ac:#C084FC;--bg:#050510;
          }
          html,body{background:var(--bg);-webkit-font-smoothing:antialiased;overscroll-behavior:none;}
          .root{min-height:100vh;min-height:100dvh;background:var(--bg);font-family:'Outfit',sans-serif;color:var(--t1);overflow-x:hidden;padding-bottom:calc(max(env(safe-area-inset-bottom),14px) + 68px);}

          /* Aurora */
          .scene{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;}
          .o{position:absolute;border-radius:50%;filter:blur(100px);animation:drift var(--d,16s) ease-in-out infinite alternate;}
          .o1{width:460px;height:460px;top:-100px;left:-100px;background:radial-gradient(circle,#7C3AED,#4F46E5,transparent 70%);opacity:0.3;--d:18s;}
          .o2{width:360px;height:360px;top:30%;right:-80px;background:radial-gradient(circle,#EC4899,#8B5CF6,transparent 70%);opacity:0.22;--d:22s;}
          .o3{width:380px;height:380px;bottom:10%;left:-60px;background:radial-gradient(circle,#06B6D4,#3B82F6,transparent 70%);opacity:0.2;--d:20s;}
          .o4{width:260px;height:260px;bottom:20%;right:0;background:radial-gradient(circle,#10B981,#6366F1,transparent 70%);opacity:0.18;--d:14s;}
          @keyframes drift{0%{transform:translate(0,0)}100%{transform:translate(30px,-30px)}}
          .grid-bg{position:fixed;inset:0;pointer-events:none;z-index:1;opacity:0.025;background-image:linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px);background-size:60px 60px;}
          .grain{position:fixed;inset:0;pointer-events:none;z-index:1;opacity:0.04;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:256px;}
          .page{position:relative;z-index:2;animation:pageIn 0.5s ease 0.1s both;}
          @keyframes pageIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

          /* Hero card */
          .hero-card{margin:16px 20px 0;background:linear-gradient(135deg,rgba(124,58,237,0.25),rgba(79,70,229,0.15));border:1px solid rgba(167,139,250,0.25);border-radius:22px;padding:24px 22px;backdrop-filter:blur(16px);position:relative;overflow:hidden;animation:fadeUp 0.5s ease 0.2s both;}
          @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
          .hero-card::after{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent 10%,rgba(192,132,252,0.6) 50%,transparent 90%);}
          .hero-blob{position:absolute;right:-30px;top:-30px;width:140px;height:140px;border-radius:50%;background:radial-gradient(circle,rgba(168,85,247,0.25),transparent);pointer-events:none;}
          .hero-logo{font-size:52px;margin-bottom:16px;filter:drop-shadow(0 0 20px rgba(168,85,247,0.5));display:block;animation:float 3s ease-in-out infinite;}
          @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
          .hero-name{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:var(--t1);margin-bottom:6px;}
          .hero-desc{font-size:14px;font-weight:400;color:var(--t2);line-height:1.6;}
          .hero-version{display:inline-flex;align-items:center;gap:6px;margin-top:14px;background:rgba(168,85,247,0.12);border:1px solid rgba(168,85,247,0.25);border-radius:100px;padding:5px 12px;font-size:11px;font-weight:600;color:var(--ac);letter-spacing:0.06em;}

          /* Stats */
          .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:16px 20px 0;animation:fadeUp 0.5s ease 0.3s both;}
          .stat-box{background:var(--g1);border:1px solid var(--gb);border-radius:16px;padding:16px 8px;text-align:center;backdrop-filter:blur(12px);position:relative;overflow:hidden;}
          .stat-box::before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:60%;height:1px;background:linear-gradient(90deg,transparent,rgba(192,132,252,0.5),transparent);}
          .stat-n{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;background:linear-gradient(135deg,#E9D5FF,#C084FC);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:4px;}
          .stat-k{font-size:9px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:0.12em;}

          /* Section header */
          .sec-hd{display:flex;align-items:center;gap:10px;padding:24px 20px 14px;}
          .sec-hd-line{flex:1;height:1px;background:linear-gradient(90deg,rgba(192,132,252,0.3),transparent);}
          .sec-hd-title{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;color:var(--t2);text-transform:uppercase;letter-spacing:0.14em;white-space:nowrap;display:flex;align-items:center;gap:7px;}
          .sec-hd-title::before{content:'';width:14px;height:2px;background:linear-gradient(90deg,#C084FC,#818CF8);border-radius:2px;}

          /* Features grid */
          .features{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;padding:0 20px;animation:fadeUp 0.5s ease 0.4s both;}
          .feat-card{background:var(--g1);border:1px solid var(--gb);border-radius:18px;padding:18px 16px;backdrop-filter:blur(12px);position:relative;overflow:hidden;transition:transform 0.2s;}
          .feat-card:active{transform:scale(0.97);}
          .feat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(192,132,252,0.4),transparent);}
          .feat-icon{font-size:28px;margin-bottom:10px;display:block;filter:drop-shadow(0 0 10px rgba(168,85,247,0.3));}
          .feat-title{font-family:'Syne',sans-serif;font-size:13px;font-weight:800;color:var(--t1);margin-bottom:6px;}
          .feat-desc{font-size:11px;font-weight:400;color:var(--t2);line-height:1.6;}

          /* Team */
          .team{padding:0 20px;display:flex;flex-direction:column;gap:10px;animation:fadeUp 0.5s ease 0.5s both;}
          .team-card{background:var(--g1);border:1px solid var(--gb);border-radius:18px;padding:16px 18px;backdrop-filter:blur(14px);display:flex;align-items:center;gap:14px;position:relative;overflow:hidden;transition:transform 0.2s;}
          .team-card:active{transform:scale(0.97);}
          .team-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,var(--gc,#C084FC),transparent);border-radius:18px 0 0 18px;opacity:0.8;}
          .team-card::after{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gc,rgba(192,132,252,0.4)),transparent);}
          .team-emoji{width:50px;height:50px;border-radius:15px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;}
          .team-name{font-family:'Syne',sans-serif;font-size:15px;font-weight:800;color:var(--t1);}
          .team-role{font-size:12px;color:var(--t2);margin-top:3px;}
          .team-badge{margin-left:auto;background:rgba(168,85,247,0.12);border:1px solid rgba(168,85,247,0.22);border-radius:100px;padding:4px 10px;font-size:10px;font-weight:700;color:var(--ac);flex-shrink:0;}

          /* FAQ */
          .faq{padding:0 20px;display:flex;flex-direction:column;gap:8px;animation:fadeUp 0.5s ease 0.6s both;}
          .faq-item{background:var(--g1);border:1px solid var(--gb);border-radius:16px;overflow:hidden;backdrop-filter:blur(12px);transition:border-color 0.2s;}
          .faq-item.open{border-color:rgba(192,132,252,0.3);}
          .faq-q{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;cursor:pointer;-webkit-tap-highlight-color:transparent;gap:12px;}
          .faq-q-text{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:var(--t1);flex:1;}
          .faq-chevron{width:28px;height:28px;border-radius:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--ac);flex-shrink:0;transition:transform 0.3s,background 0.2s;}
          .faq-item.open .faq-chevron{transform:rotate(180deg);background:rgba(168,85,247,0.15);border-color:rgba(168,85,247,0.3);}
          .faq-a{padding:0 18px;max-height:0;overflow:hidden;transition:max-height 0.35s ease,padding 0.35s ease;}
          .faq-item.open .faq-a{max-height:200px;padding-bottom:16px;}
          .faq-a-text{font-size:13px;color:var(--t2);line-height:1.7;border-top:1px solid rgba(255,255,255,0.06);padding-top:14px;}

          /* Sponsor */
          .sponsor-big{margin:0 20px;background:linear-gradient(135deg,rgba(124,58,237,0.22),rgba(79,70,229,0.14));border:1px solid rgba(167,139,250,0.25);border-radius:22px;padding:24px 22px;backdrop-filter:blur(16px);position:relative;overflow:hidden;animation:fadeUp 0.5s ease 0.7s both;text-align:center;}
          .sponsor-big::after{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent 10%,rgba(192,132,252,0.6) 50%,transparent 90%);}
          .spon-glow{position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,rgba(168,85,247,0.2),transparent);pointer-events:none;}
          .spon-glow2{position:absolute;bottom:-40px;left:-40px;width:140px;height:140px;border-radius:50%;background:radial-gradient(circle,rgba(99,102,241,0.2),transparent);pointer-events:none;}
          .spon-icon-big{font-size:44px;display:block;margin-bottom:14px;filter:drop-shadow(0 0 20px rgba(251,191,36,0.5));animation:float 3s ease-in-out infinite;}
          .spon-title{font-family:'Syne',sans-serif;font-size:11px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:0.14em;margin-bottom:6px;}
          .spon-name-big{font-family:'Syne',sans-serif;font-size:24px;font-weight:800;color:var(--t1);margin-bottom:10px;letter-spacing:-0.3px;}
          .spon-desc{font-size:13px;color:var(--t2);line-height:1.6;margin-bottom:18px;}
          .spon-chips{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;}
          .spon-chip{background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.3);border-radius:100px;padding:6px 14px;font-size:11px;font-weight:700;color:var(--ac);}

          /* Made with love footer */
          .love-footer{margin:16px 20px 0;background:var(--g1);border:1px solid var(--gb);border-radius:20px;padding:22px;backdrop-filter:blur(16px);position:relative;overflow:hidden;text-align:center;animation:fadeUp 0.5s ease 0.8s both;}
          .love-footer::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(192,132,252,0.4),transparent);}
          .love-hearts{font-size:28px;margin-bottom:12px;display:block;animation:heartbeat 1.8s ease-in-out infinite;}
          @keyframes heartbeat{0%,100%{transform:scale(1)}15%{transform:scale(1.25)}30%{transform:scale(1)}}
          .love-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:800;color:var(--t1);margin-bottom:6px;}
          .love-sub{font-size:13px;color:var(--t2);line-height:1.6;}
          .love-divider{width:40px;height:2px;background:linear-gradient(90deg,#C084FC,#818CF8);border-radius:2px;margin:14px auto;}
          .love-version{font-size:11px;color:var(--t3);}

          /* Browse btn */
          .browse-btn{display:block;margin:16px 20px 0;background:linear-gradient(135deg,#7C3AED,#4F46E5);border:none;border-radius:16px;padding:16px 24px;font-family:'Syne',sans-serif;font-size:15px;font-weight:800;color:#fff;text-decoration:none;text-align:center;cursor:pointer;box-shadow:0 4px 24px rgba(124,58,237,0.4),inset 0 1px 0 rgba(255,255,255,0.2);-webkit-tap-highlight-color:transparent;transition:transform 0.2s,box-shadow 0.2s;animation:fadeUp 0.5s ease 0.85s both;letter-spacing:-0.2px;}
          .browse-btn:active{transform:scale(0.97);box-shadow:0 2px 12px rgba(124,58,237,0.3);}
        `}</style>

        <div className="scene">
          <div className="o o1"/><div className="o o2"/>
          <div className="o o3"/><div className="o o4"/>
        </div>
        <div className="grid-bg"/><div className="grain"/>

        <div className="page">
          {/* Hero card */}
          <div className="hero-card">
            <div className="hero-blob"/>
            <span className="hero-logo">📚</span>
            <div className="hero-name">Question Bank</div>
            <div className="hero-desc">
              A free platform dedicated to helping Kerala students access model question papers
              effortlessly. Built with love by SFI Kottakkal LC, for every student who deserves
              the best preparation tools — at zero cost.
            </div>
            <div className="hero-version">✦ Version 2.0 · Aurora Edition</div>
          </div>

          {/* Features */}
          <div className="sec-hd">
            <div className="sec-hd-title">What We Offer</div>
            <div className="sec-hd-line"/>
          </div>
          <div className="features">
            {FEATURES.map((f,i)=>(
              <div className="feat-card" key={i} style={{animationDelay:`${i*0.06}s`}}>
                <span className="feat-icon">{f.icon}</span>
                <div className="feat-title">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Team */}
          <div className="sec-hd">
            <div className="sec-hd-title">Our Team</div>
            <div className="sec-hd-line"/>
          </div>
          <div className="team">
            {TEAM.map((t,i)=>(
              <div className="team-card" key={i} style={{'--gc':t.glow,animationDelay:`${i*0.08}s`}}>
                <div className="team-emoji" style={{boxShadow:`0 0 20px ${t.glow}44`}}>{t.emoji}</div>
                <div>
                  <div className="team-name">{t.name}</div>
                  <div className="team-role">{t.role}</div>
                </div>
                <div className="team-badge">✦ Core</div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="sec-hd">
            <div className="sec-hd-title">FAQ</div>
            <div className="sec-hd-line"/>
          </div>
          <div className="faq">
            {faqs.map((f,i)=>(
              <div key={i} className={`faq-item ${expanded===i?"open":""}`}>
                <div className="faq-q" onClick={()=>setExpanded(expanded===i?null:i)}>
                  <span className="faq-q-text">{f.q}</span>
                  <div className="faq-chevron">▾</div>
                </div>
                <div className="faq-a">
                  <div className="faq-a-text">{f.a}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Sponsor */}
          <div className="sec-hd">
            <div className="sec-hd-title">Our Sponsor</div>
            <div className="sec-hd-line"/>
          </div>
          <div className="sponsor-big">
            <div className="spon-glow"/><div className="spon-glow2"/>
            <span className="spon-icon-big">⭐</span>
            <div className="spon-title">Official Sponsor</div>
            <div className="spon-name-big">SFI Kottakkal LC</div>
            <div className="spon-desc">
              The Student Federation of India, Kottakkal Local Committee — proudly supporting
              student education, empowerment, and free access to knowledge for all.
            </div>
            <div className="spon-chips">
              <span className="spon-chip">🎓 Education First</span>
              <span className="spon-chip">✊ Student Power</span>
              <span className="spon-chip">💜 Free For All</span>
            </div>
          </div>

          {/* Made with love */}
          <div className="love-footer">
            <span className="love-hearts">❤️</span>
            <div className="love-title">Made with Love</div>
            <div className="love-sub">
              Built by students, for students.<br/>
              Every paper, every feature — crafted with care<br/>
              so you can focus on what matters most.
            </div>
            <div className="love-divider"/>
            <div className="love-version">© 2025 SFI Kottakkal LC · Question Bank v2.0</div>
          </div>

          {/* CTA */}
          <Link to="/" className="browse-btn">🚀 Start Browsing Papers</Link>

          <div style={{height:"16px"}}/>
        </div>
      </div>
      <BottomNav/>
    </>
  );
}
