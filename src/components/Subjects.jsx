import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

const subjectIcons = {
  math: "📐", maths: "📐", mathematics: "📐",
  physics: "⚛️", chemistry: "⚗️", biology: "🧬",
  english: "📝", malayalam: "🌴", hindi: "🇮🇳",
  history: "🏛️", geography: "🌍", science: "🔬",
  computer: "💻", economics: "📊", commerce: "💹",
  default: "📖"
};

function getIcon(name = "") {
  const key = name.toLowerCase().split(" ")[0];
  return subjectIcons[key] || subjectIcons.default;
}

function Subjects() {
  const { classId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get(`subjects/${classId}/`)
      .then(res => setSubjects(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, [classId]);

  const filtered = subjects.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <style>{`

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');

*{
margin:0;
padding:0;
box-sizing:border-box;
}

.page{
min-height:100vh;
background:linear-gradient(180deg,#070a13,#0f172a);
font-family:'Inter',sans-serif;
color:white;
padding:20px;
position:relative;
overflow:hidden;
}

/* ambient glow */

.page::before{
content:'';
position:fixed;
top:-200px;
left:-200px;
width:500px;
height:500px;
background:radial-gradient(circle,#8b5cf633,transparent 70%);
pointer-events:none;
}

.page::after{
content:'';
position:fixed;
bottom:-200px;
right:-200px;
width:500px;
height:500px;
background:radial-gradient(circle,#06b6d433,transparent 70%);
pointer-events:none;
}

.container{
max-width:650px;
margin:auto;
}

/* top bar */

.topbar{
display:flex;
align-items:center;
gap:14px;
margin-bottom:30px;
}

.back{
width:42px;
height:42px;
display:flex;
align-items:center;
justify-content:center;
border-radius:12px;
background:rgba(255,255,255,0.05);
border:1px solid rgba(255,255,255,0.08);
text-decoration:none;
color:white;
font-size:18px;
transition:.3s;
}

.back:hover{
border-color:#8b5cf6;
transform:translateY(-2px);
box-shadow:0 8px 18px rgba(139,92,246,.3);
}

.title h1{
font-size:22px;
font-weight:700;
}

.title p{
font-size:13px;
color:#94a3b8;
margin-top:2px;
}

/* search */

.searchBox{
position:relative;
margin-bottom:26px;
}

.searchIcon{
position:absolute;
left:14px;
top:50%;
transform:translateY(-50%);
color:#94a3b8;
}

.search{
width:100%;
padding:13px 16px 13px 40px;
border-radius:14px;
border:1px solid rgba(255,255,255,0.08);
background:#12182b;
color:white;
outline:none;
transition:.25s;
}

.search:focus{
border-color:#8b5cf6;
box-shadow:0 0 0 3px rgba(139,92,246,.15);
}

/* label */

.label{
font-size:11px;
letter-spacing:.12em;
text-transform:uppercase;
color:#94a3b8;
margin-bottom:12px;
}

/* subjects */

.list{
display:flex;
flex-direction:column;
gap:12px;
}

.card{
display:flex;
align-items:center;
gap:16px;
padding:16px;
border-radius:16px;
background:rgba(255,255,255,0.04);
border:1px solid rgba(255,255,255,0.08);
text-decoration:none;
color:white;
transition:.3s;
position:relative;
overflow:hidden;
}

.card:hover{
border-color:#8b5cf6;
transform:translateY(-3px);
box-shadow:0 14px 30px rgba(139,92,246,.25);
}

.card::after{
content:'→';
position:absolute;
right:16px;
color:#94a3b8;
transition:.25s;
}

.card:hover::after{
right:12px;
color:#c4b5fd;
}

.icon{
width:46px;
height:46px;
display:flex;
align-items:center;
justify-content:center;
background:rgba(139,92,246,.15);
border-radius:12px;
font-size:22px;
}

.name{
font-size:15px;
font-weight:700;
}

.hint{
font-size:12px;
color:#94a3b8;
margin-top:2px;
}

/* skeleton */

.skeleton{
height:72px;
border-radius:16px;
background:linear-gradient(90deg,#12182b 25%,#1e293b 50%,#12182b 75%);
background-size:200% 100%;
animation:shimmer 1.4s infinite;
}

@keyframes shimmer{
0%{background-position:200% 0}
100%{background-position:-200% 0}
}

/* empty */

.empty{
text-align:center;
margin-top:50px;
color:#94a3b8;
}

.emptyIcon{
font-size:36px;
margin-bottom:10px;
}

      `}</style>

      <div className="container">

        <div className="topbar">
          <Link to="/" className="back">⬅</Link>

          <div className="title">
            <h1>Subjects</h1>
            <p>
              {loading
                ? "Loading..."
                : `${subjects.length} subject${subjects.length !== 1 ? "s" : ""} available`}
            </p>
          </div>
        </div>

        <div className="searchBox">
          <span className="searchIcon">🔍</span>

          <input
            className="search"
            placeholder="Search subjects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="label">Available Subjects</div>

        <div className="list">

          {loading &&
            Array(4)
              .fill(0)
              .map((_, i) => <div key={i} className="skeleton" />)}

          {!loading &&
            filtered.map(sub => (
              <Link key={sub.id} to={`/papers/${sub.id}`} className="card">
                <div className="icon">{getIcon(sub.name)}</div>

                <div>
                  <div className="name">{sub.name}</div>
                  <div className="hint">View question papers</div>
                </div>
              </Link>
            ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="empty">
            <div className="emptyIcon">🔍</div>
            <p>No subjects match "{search}"</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default Subjects;