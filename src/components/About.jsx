import { useState } from "react";
import { Link } from "react-router-dom";
import { BottomNav } from "./Classes";

const GLOBAL = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  :root {
    --bg:#F7F7F5; --white:#FFFFFF; --ink:#1A1A1A; --ink2:#555555;
    --ink3:#999999; --ink4:#CCCCCC; --line:#EDEDED;
    --blue:#3B7CF4; --blue-bg:#EBF1FE;
    --font:'Nunito',sans-serif;
  }
  html,body { background:var(--bg); font-family:var(--font); -webkit-font-smoothing:antialiased; overscroll-behavior:none; }
  a { -webkit-tap-highlight-color:transparent; }
  button { -webkit-tap-highlight-color:transparent; }
`;

const FEATURES = [
  { icon:"📚", title:"Free Forever",   desc:"All papers free. No paywalls, no sign-ups, ever." },
  { icon:"🔍", title:"Smart Search",   desc:"Search across classes, subjects, and years instantly." },
  { icon:"⭐", title:"Save Papers",    desc:"Bookmark papers and access them offline anytime." },
  { icon:"📥", title:"Download PDF",   desc:"Download any paper directly to your device." },
  { icon:"✨", title:"Clean Design",   desc:"Simple, fast UI built for students on mobile." },
  { icon:"📊", title:"Live Stats",     desc:"Real-time visitor count powered by our backend." },
];

const TEAM = [
  { emoji:"⭐", name:"SFI Kottakkal LC", role:"Official Sponsor",   color:"#F59E0B" },
  { emoji:"🎓", name:"Student Council",  role:"Content Curators",   color:"#8B5CF6" },
  { emoji:"💻", name:"Tech Team",        role:"Developers",          color:"#3B7CF4" },
];

const FAQS = [
  { q:"Is this app completely free?",      a:"Yes! Every single question paper is 100% free. We believe education should be accessible to all." },
  { q:"Who uploads the papers?",           a:"Papers are curated by our content team and student volunteers, verified before publishing." },
  { q:"How do I save a paper?",            a:"Tap the ☆ icon on any paper card to save it. Access saved papers from the ⭐ Saved tab." },
  { q:"Can I use this offline?",           a:"Yes — download PDFs to your device. Saved bookmarks also persist locally." },
  { q:"How do I report a missing paper?",  a:"Reach out to SFI Kottakkal LC through your institution. We're always adding more." },
];

export default function About() {
  const [open, setOpen] = useState(null);

  return (
    <>
      <div style={{ minHeight:"100dvh", background:"var(--bg)", paddingBottom:"calc(max(env(safe-area-inset-bottom),14px) + 72px)" }}>
        <style>{GLOBAL}{`
          .page { animation:fadeUp 0.3s ease both; }
          @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
          .faq-body { max-height:0; overflow:hidden; transition:max-height 0.3s ease, padding 0.3s ease; padding:0 16px; }
          .faq-body.open { max-height:200px; padding:0 16px 14px; }
          .float { animation:float 3s ease-in-out infinite; }
          @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
          .hb { animation:hb 2s ease-in-out infinite; }
          @keyframes hb{0%,100%{transform:scale(1)}15%{transform:scale(1.3)}30%{transform:scale(1)}}
        `}</style>

        <div className="page" style={{ padding:"max(env(safe-area-inset-top),20px) 0 0" }}>

          {/* ── Hero block ── */}
          <div style={{
            margin:"16px 20px 0", background:"var(--ink)",
            borderRadius:20, padding:"28px 24px",
            position:"relative", overflow:"hidden",
          }}>
            <span className="float" style={{ fontSize:46, display:"block", marginBottom:16 }}>📚</span>
            <div style={{ fontFamily:"var(--font)", fontSize:22, fontWeight:900, color:"#fff", marginBottom:8, letterSpacing:"-0.4px" }}>
              Question Bank
            </div>
            <div style={{ fontFamily:"var(--font)", fontSize:14, fontWeight:500, color:"rgba(255,255,255,0.5)", lineHeight:1.7 }}>
              A free platform for Kerala students to access model question papers. Built by SFI Kottakkal LC — for every student who deserves the best preparation tools at zero cost.
            </div>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:5, marginTop:16,
              background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.12)",
              borderRadius:100, padding:"5px 14px",
              fontFamily:"var(--font)", fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.6)", letterSpacing:"0.06em",
            }}>✦ Version 2.0</div>
          </div>

          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, padding:"14px 20px 0" }}>
            {[{v:"12+",k:"Classes"},{v:"50+",k:"Subjects"},{v:"200+",k:"Papers"},{v:"∞",k:"Free"}].map(({v,k})=>(
              <div key={k} style={{ background:"var(--white)", border:"1px solid var(--line)", borderRadius:14, padding:"14px 6px", textAlign:"center", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ fontFamily:"var(--font)", fontSize:18, fontWeight:900, color:"var(--ink)", marginBottom:3 }}>{v}</div>
                <div style={{ fontFamily:"var(--font)", fontSize:9, fontWeight:700, color:"var(--ink3)", textTransform:"uppercase", letterSpacing:"0.12em" }}>{k}</div>
              </div>
            ))}
          </div>

          {/* Section: Features */}
          <div style={{ padding:"22px 20px 12px" }}>
            <span style={{ fontFamily:"var(--font)", fontSize:11, fontWeight:700, color:"var(--ink3)", textTransform:"uppercase", letterSpacing:"0.14em" }}>What We Offer</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8, padding:"0 20px" }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background:"var(--white)", border:"1px solid var(--line)",
                borderRadius:16, padding:"18px 16px",
                boxShadow:"0 1px 6px rgba(0,0,0,0.04)",
              }}>
                <span style={{ fontSize:26, display:"block", marginBottom:10 }}>{f.icon}</span>
                <div style={{ fontFamily:"var(--font)", fontSize:14, fontWeight:800, color:"var(--ink)", marginBottom:5 }}>{f.title}</div>
                <div style={{ fontFamily:"var(--font)", fontSize:12, fontWeight:500, color:"var(--ink3)", lineHeight:1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Section: Team */}
          <div style={{ padding:"22px 20px 12px" }}>
            <span style={{ fontFamily:"var(--font)", fontSize:11, fontWeight:700, color:"var(--ink3)", textTransform:"uppercase", letterSpacing:"0.14em" }}>Our Team</span>
          </div>
          <div style={{ padding:"0 20px", display:"flex", flexDirection:"column", gap:8 }}>
            {TEAM.map((t, i) => (
              <div key={i} style={{
                background:"var(--white)", border:"1px solid var(--line)", borderLeft:`3px solid ${t.color}`,
                borderRadius:14, padding:"14px 16px", display:"flex", alignItems:"center", gap:14,
                boxShadow:"0 1px 6px rgba(0,0,0,0.04)",
              }}>
                <div style={{
                  width:46, height:46, borderRadius:13,
                  background:`${t.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:23, flexShrink:0,
                }}>{t.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"var(--font)", fontSize:15, fontWeight:800, color:"var(--ink)" }}>{t.name}</div>
                  <div style={{ fontFamily:"var(--font)", fontSize:12, fontWeight:500, color:"var(--ink3)", marginTop:2 }}>{t.role}</div>
                </div>
                <span style={{ fontFamily:"var(--font)", fontSize:10, fontWeight:700, background:"var(--bg)", border:"1px solid var(--line)", borderRadius:100, padding:"4px 10px", color:"var(--ink3)" }}>Core</span>
              </div>
            ))}
          </div>

          {/* Section: FAQ */}
          <div style={{ padding:"22px 20px 12px" }}>
            <span style={{ fontFamily:"var(--font)", fontSize:11, fontWeight:700, color:"var(--ink3)", textTransform:"uppercase", letterSpacing:"0.14em" }}>FAQ</span>
          </div>
          <div style={{ padding:"0 20px", display:"flex", flexDirection:"column", gap:8 }}>
            {FAQS.map((f, i) => (
              <div key={i} style={{
                background:"var(--white)", border:`1px solid ${open===i?"#BFDBFE":"var(--line)"}`,
                borderRadius:14, overflow:"hidden",
                boxShadow:"0 1px 6px rgba(0,0,0,0.04)",
                transition:"border-color 0.2s",
              }}>
                <button
                  onClick={()=>setOpen(open===i?null:i)}
                  style={{
                    width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"14px 16px", background:"transparent", border:"none", cursor:"pointer",
                    gap:12, textAlign:"left",
                  }}
                >
                  <span style={{ fontFamily:"var(--font)", fontSize:14, fontWeight:700, color:"var(--ink)", flex:1 }}>{f.q}</span>
                  <div style={{
                    width:28, height:28, borderRadius:8,
                    background: open===i ? "var(--blue-bg)" : "var(--bg)",
                    border:`1px solid ${open===i?"#BFDBFE":"var(--line)"}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:13, color: open===i ? "var(--blue)" : "var(--ink3)",
                    transform:`rotate(${open===i?180:0}deg)`, transition:"transform 0.25s, background 0.2s",
                    flexShrink:0,
                  }}>▾</div>
                </button>
                <div className={`faq-body${open===i?" open":""}`}>
                  <div style={{ fontFamily:"var(--font)", fontSize:13, fontWeight:500, color:"var(--ink2)", lineHeight:1.7, borderTop:"1px solid var(--line)", paddingTop:12 }}>{f.a}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Section: Sponsor */}
          <div style={{ padding:"22px 20px 12px" }}>
            <span style={{ fontFamily:"var(--font)", fontSize:11, fontWeight:700, color:"var(--ink3)", textTransform:"uppercase", letterSpacing:"0.14em" }}>Our Sponsor</span>
          </div>
          <div style={{ margin:"0 20px", background:"var(--ink)", borderRadius:20, padding:"28px 24px", textAlign:"center", position:"relative", overflow:"hidden" }}>
            <span className="float" style={{ fontSize:42, display:"block", marginBottom:14 }}>⭐</span>
            <div style={{ fontFamily:"var(--font)", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"0.16em", marginBottom:5 }}>Official Sponsor</div>
            <div style={{ fontFamily:"var(--font)", fontSize:22, fontWeight:900, color:"#fff", marginBottom:10, letterSpacing:"-0.4px" }}>SFI Kottakkal LC</div>
            <div style={{ fontFamily:"var(--font)", fontSize:13, fontWeight:500, color:"rgba(255,255,255,0.5)", lineHeight:1.7, marginBottom:18 }}>
              The Student Federation of India, Kottakkal Local Committee — supporting student education and free access to knowledge for all.
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
              {["🎓 Education First","✊ Student Power","💜 Free For All"].map(label => (
                <span key={label} style={{
                  background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.12)",
                  borderRadius:100, padding:"6px 14px",
                  fontFamily:"var(--font)", fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.7)",
                }}>{label}</span>
              ))}
            </div>
          </div>

          {/* Made with love */}
          <div style={{ margin:"14px 20px 0", background:"var(--white)", border:"1px solid var(--line)", borderRadius:18, padding:"24px", textAlign:"center" }}>
            <span className="hb" style={{ fontSize:28, display:"block", marginBottom:12 }}>❤️</span>
            <div style={{ fontFamily:"var(--font)", fontSize:17, fontWeight:900, color:"var(--ink)", marginBottom:6 }}>Made with Love</div>
            <div style={{ fontFamily:"var(--font)", fontSize:13, fontWeight:500, color:"var(--ink3)", lineHeight:1.7 }}>
              Built by students, for students.<br />Every paper crafted with care so you can focus on what matters.
            </div>
            <div style={{ width:32, height:2, background:"var(--line)", borderRadius:2, margin:"14px auto" }} />
            <div style={{ fontFamily:"var(--font)", fontSize:11, fontWeight:500, color:"var(--ink4)" }}>© 2025 SFI Kottakkal LC · v2.0</div>
          </div>

          {/* CTA */}
          <Link to="/" style={{
            display:"block", margin:"14px 20px 0",
            background:"var(--ink)", borderRadius:16, padding:"17px 24px",
            fontFamily:"var(--font)", fontSize:15, fontWeight:800, color:"#fff",
            textDecoration:"none", textAlign:"center",
            boxShadow:"0 4px 18px rgba(0,0,0,0.13)",
          }}>🚀 Start Browsing Papers</Link>

          <div style={{ height:16 }} />
        </div>
      </div>
      <BottomNav />
    </>
  );
}
