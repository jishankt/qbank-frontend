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
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favSubjects")) || []
  );

  useEffect(() => {

    setLoading(true);

    API.get(`subjects/${classId}/`)
      .then(res => setSubjects(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));

  }, [classId]);


  useEffect(() => {
    localStorage.setItem("favSubjects", JSON.stringify(favorites));
  }, [favorites]);


  const filtered = subjects.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );


  function toggleFavorite(id) {

    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }

  }


  return (

    <div className="page">

<style>{`

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');

*{margin:0;padding:0;box-sizing:border-box;}

.page{
min-height:100vh;
background:linear-gradient(180deg,#070a13,#0f172a);
font-family:'Inter',sans-serif;
color:white;
padding:20px;
}

.container{
max-width:650px;
margin:auto;
}

/* header */

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
background:#12182b;
border:1px solid rgba(255,255,255,.08);
text-decoration:none;
color:white;
transition:.3s;
}

.back:hover{
border-color:#8b5cf6;
transform:translateY(-2px);
}

.title h1{
font-size:22px;
font-weight:700;
}

.title p{
font-size:13px;
color:#94a3b8;
}

/* search */

.search{
width:100%;
padding:13px;
border-radius:14px;
border:1px solid rgba(255,255,255,.08);
background:#12182b;
color:white;
outline:none;
margin-bottom:20px;
}

/* subject cards */

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
background:rgba(255,255,255,.04);
border:1px solid rgba(255,255,255,.08);
text-decoration:none;
color:white;
transition:.3s;
position:relative;
}

.card:hover{
border-color:#8b5cf6;
transform:translateY(-3px);
box-shadow:0 12px 28px rgba(139,92,246,.25);
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
}

/* favorite */

.favorite{
position:absolute;
right:16px;
top:18px;
font-size:18px;
cursor:pointer;
}

/* badge */

.badge{
font-size:10px;
background:#8b5cf6;
padding:2px 6px;
border-radius:6px;
margin-left:8px;
}

/* empty */

.empty{
text-align:center;
margin-top:50px;
color:#94a3b8;
}

`}</style>


<div className="container">

<div className="topbar">

<Link to="/" className="back">⬅</Link>

<div className="title">
<h1>Subjects</h1>
<p>{loading ? "Loading..." : `${subjects.length} subjects available`}</p>
</div>

</div>


<input
className="search"
placeholder="Search subjects..."
value={search}
onChange={e => setSearch(e.target.value)}
/>


<div className="list">

{loading && <p>Loading subjects...</p>}

{!loading && filtered.map(sub => (

<div key={sub.id} className="card">

<Link
to={`/papers/${sub.id}`}
style={{display:"flex",gap:"16px",flex:1,textDecoration:"none",color:"white"}}
>

<div className="icon">{getIcon(sub.name)}</div>

<div>
<div className="name">
{sub.name}

{sub.id <= 3 && <span className="badge">Popular</span>}

</div>

<div className="hint">View question papers</div>
</div>

</Link>

<div
className="favorite"
onClick={() => toggleFavorite(sub.id)}
>

{favorites.includes(sub.id) ? "⭐" : "☆"}

</div>

</div>

))}

</div>


{!loading && filtered.length === 0 && (
<div className="empty">
<p>No subjects match "{search}"</p>
</div>
)}

</div>

</div>

  );

}

export default Subjects;