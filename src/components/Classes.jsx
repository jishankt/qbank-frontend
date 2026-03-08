import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

const classIcons = ["🎯","🔬","📐","🌍","🎨","📜","💡","🧬","🏛️","⚗️","🎭","🌿"];

function Classes() {

  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [visitors, setVisitors] = useState(0);

  useEffect(() => {

    API.get("classes/")
      .then(res => setClasses(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));

    API.get("visitors/")
      .then(res => setVisitors(res.data.visitors))
      .catch(err => console.log(err));

  }, []);

  const filtered = classes.filter(cls =>
    cls.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="qb-root">

<style>{`

@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

*{box-sizing:border-box;margin:0;padding:0}

:root{
--bg:#080b14;
--card:#131929;
--border:rgba(255,255,255,0.06);
--accent:#7c3aed;
--accent2:#06b6d4;
--text:#f0f4ff;
--muted:#6b7a99;
}

.qb-root{
min-height:100vh;
background:var(--bg);
font-family:'DM Sans',sans-serif;
color:var(--text);
padding:0 16px 60px;
}

.qb-inner{
max-width:640px;
margin:auto;
}

/* HERO */

.qb-hero{
padding:52px 0 36px;
text-align:center;
}

.qb-badge{
display:inline-flex;
background:rgba(124,58,237,0.15);
border:1px solid rgba(124,58,237,0.3);
border-radius:100px;
padding:5px 14px;
font-size:12px;
color:#a78bfa;
margin-bottom:20px;
}

.qb-hero h1{
font-family:'Syne',sans-serif;
font-size:48px;
font-weight:800;
background:linear-gradient(135deg,#f0f4ff,#a78bfa,#06b6d4);
-webkit-background-clip:text;
-webkit-text-fill-color:transparent;
margin-bottom:10px;
}

.qb-hero p{
color:var(--muted);
}

/* STATS */

.qb-stats{
display:flex;
justify-content:center;
gap:24px;
margin-bottom:30px;
}

.qb-stat{
text-align:center;
}

.qb-stat-num{
font-family:'Syne',sans-serif;
font-size:22px;
font-weight:800;
background:linear-gradient(135deg,#a78bfa,#06b6d4);
-webkit-background-clip:text;
-webkit-text-fill-color:transparent;
}

.qb-stat-label{
font-size:11px;
color:var(--muted);
text-transform:uppercase;
}

.qb-divider{
width:1px;
height:30px;
background:var(--border);
}

/* SEARCH */

.qb-search-wrap{
position:relative;
margin-bottom:30px;
}

.qb-search-icon{
position:absolute;
left:14px;
top:50%;
transform:translateY(-50%);
color:var(--muted);
}

.qb-search{
width:100%;
background:var(--card);
border:1px solid var(--border);
border-radius:14px;
padding:14px 16px 14px 40px;
color:white;
outline:none;
}

.qb-search:focus{
border-color:var(--accent);
}

/* GRID */

.qb-grid{
display:grid;
grid-template-columns:repeat(2,1fr);
gap:12px;
}

@media(min-width:420px){
.qb-grid{grid-template-columns:repeat(3,1fr)}
}

/* CARD */

.qb-card{
background:var(--card);
border:1px solid var(--border);
border-radius:16px;
padding:20px 14px;
text-decoration:none;
color:white;
display:flex;
flex-direction:column;
align-items:center;
gap:10px;
transition:.25s;
}

.qb-card:hover{
border-color:#7c3aed;
transform:translateY(-4px);
box-shadow:0 10px 30px rgba(124,58,237,.2);
}

.qb-card-icon{
font-size:28px;
}

.qb-card-label{
font-family:'Syne',sans-serif;
font-weight:700;
font-size:13px;
}

.qb-card-sub{
font-size:11px;
color:var(--muted);
}

/* SKELETON */

.qb-skeleton{
height:96px;
border-radius:16px;
background:linear-gradient(90deg,#131929 25%,#1a2235 50%,#131929 75%);
background-size:200% 100%;
animation:shimmer 1.4s infinite;
}

@keyframes shimmer{
0%{background-position:200% 0}
100%{background-position:-200% 0}
}

/* EMPTY */

.qb-empty{
text-align:center;
padding:48px 0;
color:var(--muted);
}

`}</style>


<div className="qb-inner">

<div className="qb-hero">
<div className="qb-badge">📚 Question Bank</div>
<h1>Find Your Papers</h1>
<p>Past papers organized by class</p>
</div>


<div className="qb-stats">

<div className="qb-stat">
<div className="qb-stat-num">{classes.length}</div>
<div className="qb-stat-label">Classes</div>
</div>

<div className="qb-divider"></div>

<div className="qb-stat">
<div className="qb-stat-num">{visitors}</div>
<div className="qb-stat-label">Visitors</div>
</div>

<div className="qb-divider"></div>

<div className="qb-stat">
<div className="qb-stat-num">Free</div>
<div className="qb-stat-label">Always</div>
</div>

</div>


<div className="qb-search-wrap">

<span className="qb-search-icon">🔍</span>

<input
className="qb-search"
placeholder="Search classes..."
value={search}
onChange={e=>setSearch(e.target.value)}
/>

</div>


<div className="qb-grid">

{loading && Array(6).fill(0).map((_,i)=>(
<div key={i} className="qb-skeleton"></div>
))}


{!loading && filtered.map((cls,i)=>(

<Link
key={cls.id}
to={`/subjects/${cls.id}`}
className="qb-card"
>

<div className="qb-card-icon">
{classIcons[i % classIcons.length]}
</div>

<div className="qb-card-label">
Class {cls.name}
</div>

<div className="qb-card-sub">
View subjects →
</div>

</Link>

))}

</div>


{!loading && filtered.length===0 &&(

<div className="qb-empty">

<div style={{fontSize:"40px"}}>🔍</div>
<p>No classes match "{search}"</p>

</div>

)}

</div>

</div>

  );
}

export default Classes;