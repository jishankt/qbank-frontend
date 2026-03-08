import { useState } from "react";
import { Link } from "react-router-dom";
import { BottomNav } from "./Classes";

const TEAM = [
  { name: "SFI Kottakkal LC", role: "Official Sponsor", emoji: "⭐", accent: "#D97706", light: "#FEF3C7", border: "#FCD34D" },
  { name: "Student Council", role: "Content Curators", emoji: "🎓", accent: "#7C3AED", light: "#EDE9FE", border: "#C4B5FD" },
  { name: "Tech Team", role: "Developers", emoji: "💻", accent: "#2563EB", light: "#DBEAFE", border: "#93C5FD" },
];

const FEATURES = [
  { icon: "📚", title: "Free Forever", desc: "All question papers completely free. No paywalls, no sign-ups." },
  { icon: "🔍", title: "Smart Search", desc: "Instantly search across classes, subjects, and years." },
  { icon: "⭐", title: "Save Papers", desc: "Bookmark favourites and access them offline anytime." },
  { icon: "📥", title: "Download PDF", desc: "Download any paper directly to your device in one tap." },
  { icon: "✨", title: "Beautiful UI", desc: "Crafted with a clean, premium design for every student." },
  { icon: "📊", title: "Live Stats", desc: "Real-time visitor counter powered by our backend." },
];

const STATS = [
  { val: "3+", label: "Classes" },
  { val: "50+", label: "Subjects" },
  { val: "100+", label: "Papers" },
  { val: "Always", label: "Free" },
];

export default function About() {
  const [expanded, setExpanded] = useState(null);

  const faqs = [
    { q: "Is this app completely free?", a: "Yes! Every single question paper on this platform is 100% free. We believe education should be accessible to all students." },
    { q: "Who uploads the papers?", a: "Papers are curated by our dedicated content team and student volunteers, verified for accuracy before publishing." },
    { q: "How do I save a paper?", a: "On any paper card, tap the ☆ bookmark icon to save it. Access all saved papers from the ⭐ Saved tab in the bottom navigation." },
    { q: "Can I use this offline?", a: "You can download PDFs to your device for offline access. Saved bookmarks also persist locally in your browser." },
    { q: "How do I report a missing paper?", a: "Reach out to SFI Kottakkal LC directly through your institution. We're always working to add more content." },
  ];

  return (
    <>
      <div className="root">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
          *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
          :root { --bg:#FAFAF8; --surface:#FFFFFF; --border:#F0F0EE; --border2:#E5E5E3; --t1:#1C1C1E; --t2:#6B7280; --t3:#9CA3AF; --t4:#D1D5DB; }
          html,body { background:var(--bg); -webkit-font-smoothing:antialiased; overscroll-behavior:none; }
          .root { min-height:100vh; min-height:100dvh; background:var(--bg); font-family:'DM Sans',sans-serif; color:var(--t1); overflow-x:hidden; padding-bottom:calc(max(env(safe-area-inset-bottom),14px) + 72px); }

          .bg-texture { position:fixed; inset:0; z-index:0; pointer-events:none; background-image:radial-gradient(circle,#E5E7EB 1px,transparent 1px); background-size:32px 32px; opacity:0.5; }
          .page { position:relative; z-index:2; animation:pageIn 0.4s ease both; }
          @keyframes pageIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

          /* Hero card */
          .hero-card { margin:16px 20px 0; background:#1C1C1E; border-radius:24px; padding:28px 24px; position:relative; overflow:hidden; animation:fadeUp 0.5s ease 0.1s both; }
          @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
          .hero-card-glow { position:absolute; top:-60px; right:-60px; width:200px; height:200px; border-radius:50%; background:radial-gradient(circle, rgba(99,102,241,0.3), transparent); pointer-events:none; }
          .hero-logo { font-size:48px; display:block; margin-bottom:18px; animation:float 3s ease-in-out infinite; }
          @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
          .hero-name { font-family:'Playfair Display',serif; font-size:24px; font-weight:800; color:#fff; margin-bottom:8px; }
          .hero-desc { font-size:14px; color:rgba(255,255,255,0.55); line-height:1.65; }
          .hero-version { display:inline-flex; align-items:center; gap:6px; margin-top:16px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.15); border-radius:100px; padding:5px 14px; font-size:11px; font-weight:600; color:rgba(255,255,255,0.7); letter-spacing:0.06em; }

          /* Stats */
          .stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; padding:16px 20px 0; animation:fadeUp 0.5s ease 0.2s both; }
          .stat-box { background:var(--surface); border:1.5px solid var(--border2); border-radius:16px; padding:16px 8px; text-align:center; box-shadow:0 1px 4px rgba(0,0,0,0.04); }
          .stat-n { font-family:'Playfair Display',serif; font-size:20px; font-weight:700; color:var(--t1); margin-bottom:4px; }
          .stat-k { font-size:9px; font-weight:600; color:var(--t3); text-transform:uppercase; letter-spacing:0.12em; }

          /* Section header */
          .sec-hd { display:flex; align-items:center; gap:10px; padding:24px 20px 14px; }
          .sec-hd-line { flex:1; height:1px; background:var(--border2); }
          .sec-hd-title { font-size:11px; font-weight:700; color:var(--t3); text-transform:uppercase; letter-spacing:0.14em; white-space:nowrap; }

          /* Features grid */
          .features { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; padding:0 20px; animation:fadeUp 0.5s ease 0.3s both; }
          .feat-card { background:var(--surface); border:1.5px solid var(--border2); border-radius:20px; padding:18px 16px; box-shadow:0 1px 6px rgba(0,0,0,0.04); transition:transform 0.2s; }
          .feat-card:active { transform:scale(0.97); }
          .feat-icon { font-size:28px; display:block; margin-bottom:10px; }
          .feat-title { font-family:'Playfair Display',serif; font-size:14px; font-weight:700; color:var(--t1); margin-bottom:6px; }
          .feat-desc { font-size:12px; color:var(--t2); line-height:1.6; }

          /* Team */
          .team { padding:0 20px; display:flex; flex-direction:column; gap:8px; animation:fadeUp 0.5s ease 0.4s both; }
          .team-card { background:var(--surface); border:1.5px solid var(--border2); border-radius:18px; padding:16px 18px; display:flex; align-items:center; gap:14px; box-shadow:0 1px 6px rgba(0,0,0,0.04); transition:transform 0.2s; position:relative; overflow:hidden; }
          .team-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:var(--t-accent,#6366F1); border-radius:18px 0 0 18px; }
          .team-card:active { transform:scale(0.97); }
          .team-emoji { width:48px; height:48px; border-radius:14px; background:var(--t-light,#EEF2FF); border:1px solid var(--t-border,#C7D2FE); display:flex; align-items:center; justify-content:center; font-size:24px; flex-shrink:0; }
          .team-name { font-family:'Playfair Display',serif; font-size:15px; font-weight:700; color:var(--t1); }
          .team-role { font-size:12px; color:var(--t3); margin-top:3px; }
          .team-badge { margin-left:auto; background:#F3F4F6; border:1px solid var(--border2); border-radius:100px; padding:4px 10px; font-size:10px; font-weight:700; color:var(--t2); flex-shrink:0; }

          /* FAQ */
          .faq { padding:0 20px; display:flex; flex-direction:column; gap:8px; animation:fadeUp 0.5s ease 0.5s both; }
          .faq-item { background:var(--surface); border:1.5px solid var(--border2); border-radius:16px; overflow:hidden; transition:border-color 0.2s; box-shadow:0 1px 4px rgba(0,0,0,0.04); }
          .faq-item.open { border-color:#C7D2FE; }
          .faq-q { display:flex; align-items:center; justify-content:space-between; padding:16px 18px; cursor:pointer; -webkit-tap-highlight-color:transparent; gap:12px; }
          .faq-q-text { font-family:'Playfair Display',serif; font-size:14px; font-weight:700; color:var(--t1); flex:1; }
          .faq-chevron { width:28px; height:28px; border-radius:8px; background:#F3F4F6; border:1px solid var(--border2); display:flex; align-items:center; justify-content:center; font-size:12px; color:var(--t2); flex-shrink:0; transition:transform 0.3s, background 0.2s; }
          .faq-item.open .faq-chevron { transform:rotate(180deg); background:#EEF2FF; border-color:#C7D2FE; color:#6366F1; }
          .faq-a { padding:0 18px; max-height:0; overflow:hidden; transition:max-height 0.35s ease, padding 0.35s ease; }
          .faq-item.open .faq-a { max-height:200px; padding-bottom:16px; }
          .faq-a-text { font-size:13px; color:var(--t2); line-height:1.7; border-top:1px solid var(--border); padding-top:14px; }

          /* Sponsor */
          .sponsor-big { margin:0 20px; background:#1C1C1E; border-radius:24px; padding:28px 24px; position:relative; overflow:hidden; animation:fadeUp 0.5s ease 0.6s both; text-align:center; }
          .spon-glow { position:absolute; top:-50px; right:-50px; width:160px; height:160px; border-radius:50%; background:radial-gradient(circle,rgba(245,158,11,0.2),transparent); pointer-events:none; }
          .spon-icon-big { font-size:44px; display:block; margin-bottom:14px; animation:float 3s ease-in-out infinite; }
          .spon-title { font-size:10px; font-weight:700; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:0.16em; margin-bottom:6px; }
          .spon-name-big { font-family:'Playfair Display',serif; font-size:24px; font-weight:800; color:#fff; margin-bottom:10px; }
          .spon-desc { font-size:13px; color:rgba(255,255,255,0.5); line-height:1.65; margin-bottom:18px; }
          .spon-chips { display:flex; gap:8px; justify-content:center; flex-wrap:wrap; }
          .spon-chip { background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.15); border-radius:100px; padding:6px 14px; font-size:11px; font-weight:700; color:rgba(255,255,255,0.7); }

          /* Footer */
          .love-footer { margin:16px 20px 0; background:var(--surface); border:1.5px solid var(--border2); border-radius:22px; padding:24px; text-align:center; animation:fadeUp 0.5s ease 0.7s both; box-shadow:0 1px 6px rgba(0,0,0,0.04); }
          .love-hearts { font-size:28px; display:block; margin-bottom:12px; animation:heartbeat 2s ease-in-out infinite; }
          @keyframes heartbeat{0%,100%{transform:scale(1)}15%{transform:scale(1.25)}30%{transform:scale(1)}}
          .love-title { font-family:'Playfair Display',serif; font-size:18px; font-weight:800; color:var(--t1); margin-bottom:6px; }
          .love-sub { font-size:13px; color:var(--t2); line-height:1.65; }
          .love-divider { width:36px; height:2px; background:#E5E7EB; border-radius:2px; margin:14px auto; }
          .love-version { font-size:11px; color:var(--t4); }

          /* Browse btn */
          .browse-btn { display:block; margin:14px 20px 0; background:#1C1C1E; border:none; border-radius:18px; padding:17px 24px; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:700; color:#fff; text-decoration:none; text-align:center; cursor:pointer; box-shadow:0 4px 20px rgba(0,0,0,0.15); -webkit-tap-highlight-color:transparent; transition:transform 0.2s, box-shadow 0.2s; animation:fadeUp 0.5s ease 0.75s both; }
          .browse-btn:active { transform:scale(0.97); box-shadow:0 2px 10px rgba(0,0,0,0.1); }
        `}</style>

        <div className="bg-texture" />

        <div className="page">
          {/* Hero */}
          <div className="hero-card">
            <div className="hero-card-glow" />
            <span className="hero-logo">📚</span>
            <div className="hero-name">Question Bank</div>
            <div className="hero-desc">
              A free platform dedicated to helping Kerala students access model question papers
              effortlessly. Built with love by SFI Kottakkal LC, for every student who deserves
              the best preparation tools — at zero cost.
            </div>
            <div className="hero-version">✦ Version 2.0 · Light Edition</div>
          </div>

          {/* Stats */}
          <div className="stats-row">
            {STATS.map(({ val, label }) => (
              <div className="stat-box" key={label}>
                <div className="stat-n">{val}</div>
                <div className="stat-k">{label}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="sec-hd">
            <span className="sec-hd-title">What We Offer</span>
            <div className="sec-hd-line" />
          </div>
          <div className="features">
            {FEATURES.map((f, i) => (
              <div className="feat-card" key={i}>
                <span className="feat-icon">{f.icon}</span>
                <div className="feat-title">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Team */}
          <div className="sec-hd">
            <span className="sec-hd-title">Our Team</span>
            <div className="sec-hd-line" />
          </div>
          <div className="team">
            {TEAM.map((t, i) => (
              <div className="team-card" key={i} style={{ '--t-accent': t.accent, '--t-light': t.light, '--t-border': t.border }}>
                <div className="team-emoji">{t.emoji}</div>
                <div>
                  <div className="team-name">{t.name}</div>
                  <div className="team-role">{t.role}</div>
                </div>
                <div className="team-badge">Core</div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="sec-hd">
            <span className="sec-hd-title">FAQ</span>
            <div className="sec-hd-line" />
          </div>
          <div className="faq">
            {faqs.map((f, i) => (
              <div key={i} className={`faq-item ${expanded === i ? "open" : ""}`}>
                <div className="faq-q" onClick={() => setExpanded(expanded === i ? null : i)}>
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
            <span className="sec-hd-title">Our Sponsor</span>
            <div className="sec-hd-line" />
          </div>
          <div className="sponsor-big">
            <div className="spon-glow" />
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

          {/* Love footer */}
          <div className="love-footer">
            <span className="love-hearts">❤️</span>
            <div className="love-title">Made with Love</div>
            <div className="love-sub">
              Built by students, for students.<br />
              Every paper, every feature — crafted with care<br />
              so you can focus on what matters most.
            </div>
            <div className="love-divider" />
            <div className="love-version">© 2025 SFI Kottakkal LC · Question Bank v2.0</div>
          </div>

          <Link to="/" className="browse-btn">🚀 Start Browsing Papers</Link>
          <div style={{ height: "16px" }} />
        </div>
      </div>
      <BottomNav />
    </>
  );
}
