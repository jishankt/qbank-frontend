import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

const classIcons = ["🎯","🔬","📐","🌍","🎨","📜","💡","🧬","🏛️","⚗️","🎭","🌿"];

function Classes() {

  const [classes,setClasses] = useState([])
  const [search,setSearch] = useState("")
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    API.get("classes/")
      .then(res => setClasses(res.data))
      .catch(err => console.log(err))
      .finally(()=> setLoading(false))
  },[])

  const filtered = classes.filter(cls =>
    cls.name.toLowerCase().includes(search.toLowerCase())
  )

  return (

<div className="page">

<style>{`

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');

*{margin:0;padding:0;box-sizing:border-box}

.page{
min-height:100vh;
background:linear-gradient(180deg,#070a13,#0e1424);
font-family:'Inter',sans-serif;
color:white;
padding:40px 20px;
}

/* HEADER */

.header{
text-align:center;
margin-bottom:40px;
}

.header h1{
font-size:48px;
font-weight:800;
background:linear-gradient(90deg,#8b5cf6,#06b6d4);
-webkit-background-clip:text;
-webkit-text-fill-color:transparent;
}

.header p{
color:#94a3b8;
margin-top:6px;
}

/* SEARCH */

.searchBox{
max-width:420px;
margin:auto;
margin-bottom:30px;
position:relative;
}

.searchBox input{
width:100%;
padding:14px 18px;
border-radius:14px;
border:1px solid rgba(255,255,255,0.08);
background:#12182b;
color:white;
outline:none;
font-size:15px;
transition:0.3s;
}

.searchBox input:focus{
border-color:#8b5cf6;
box-shadow:0 0 0 3px rgba(139,92,246,0.15);
}

/* GRID */

.grid{
max-width:900px;
margin:auto;
display:grid;
grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
gap:18px;
}

/* CARD */

.card{

background:rgba(255,255,255,0.04);
border:1px solid rgba(255,255,255,0.08);
backdrop-filter:blur(10px);
border-radius:18px;
padding:28px 16px;
text-align:center;
text-decoration:none;
color:white;
transition:0.35s;
position:relative;
overflow:hidden;
}

.card:hover{

transform:translateY(-6px);
border-color:#8b5cf6;
box-shadow:0 20px 40px rgba(124,58,237,0.25);
}

/* glow effect */

.card::before{

content:'';
position:absolute;
top:-50%;
left:-50%;
width:200%;
height:200%;
background:radial-gradient(circle,#8b5cf633,transparent 60%);
opacity:0;
transition:0.5s;
}

.card:hover::before{
opacity:1;
}

/* icon */

.icon{

font-size:32px;
margin-bottom:10px;
}

/* label */

.label{

font-weight:700;
font-size:16px;
margin-bottom:4px;
}

.sub{

font-size:12px;
color:#94a3b8;
}

/* loading */

.loading{
text-align:center;
color:#94a3b8;
margin-top:50px;
}

/* empty */

.empty{
text-align:center;
margin-top:60px;
color:#94a3b8;
}

`}</style>


<div className="header">

<h1>Question Bank</h1>
<p>Select your class to explore papers</p>

</div>


<div className="searchBox">

<input
placeholder="Search class..."
value={search}
onChange={e=>setSearch(e.target.value)}
/>

</div>


{loading ?

<div className="loading">Loading classes...</div>

:

<div className="grid">

{filtered.map((cls,i)=> (

<Link
key={cls.id}
to={`/subjects/${cls.id}`}
className="card"
>

<div className="icon">
{classIcons[i % classIcons.length]}
</div>

<div className="label">
Class {cls.name}
</div>

<div className="sub">
View subjects →
</div>

</Link>

))}

</div>
}


{!loading && filtered.length === 0 && (

<div className="empty">

<h3>No classes found</h3>
<p>Try another search</p>

</div>

)}

</div>

  )
}

export default Classes