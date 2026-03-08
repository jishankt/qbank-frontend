import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

const classIcons = ["🎯","🔬","📐","🌍","🎨","📜","💡","🧬","🏛️","⚗️","🎭","🌿"];

function Classes() {

const [classes,setClasses] = useState([])
const [search,setSearch] = useState("")
const [loading,setLoading] = useState(true)
const [favorites,setFavorites] = useState(
JSON.parse(localStorage.getItem("favClasses")) || []
)

useEffect(()=>{

API.get("classes/")
.then(res => setClasses(res.data))
.catch(err => console.log(err))
.finally(()=> setLoading(false))

},[])

useEffect(()=>{

localStorage.setItem("favClasses",JSON.stringify(favorites))

},[favorites])


function toggleFavorite(id){

if(favorites.includes(id)){

setFavorites(favorites.filter(f=>f!==id))

}else{

setFavorites([...favorites,id])

}

}


const filtered = classes.filter(cls =>
cls.name.toLowerCase().includes(search.toLowerCase())
)

return(

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

/* header */

.header{
text-align:center;
margin-bottom:40px;
}

.header h1{
font-size:46px;
font-weight:800;
background:linear-gradient(90deg,#8b5cf6,#06b6d4);
-webkit-background-clip:text;
-webkit-text-fill-color:transparent;
}

.header p{
color:#94a3b8;
margin-top:6px;
}

/* counter */

.counter{
margin-top:8px;
font-size:13px;
color:#64748b;
}

/* search */

.searchBox{
max-width:420px;
margin:auto;
margin-bottom:30px;
}

.searchBox input{
width:100%;
padding:14px 18px;
border-radius:14px;
border:1px solid rgba(255,255,255,.08);
background:#12182b;
color:white;
outline:none;
}

/* grid */

.grid{
max-width:900px;
margin:auto;
display:grid;
grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
gap:18px;
}

/* card */

.card{
background:rgba(255,255,255,.04);
border:1px solid rgba(255,255,255,.08);
border-radius:18px;
padding:26px 16px;
text-align:center;
text-decoration:none;
color:white;
transition:.35s;
position:relative;
}

.card:hover{
transform:translateY(-6px);
border-color:#8b5cf6;
box-shadow:0 20px 40px rgba(124,58,237,.25);
}

/* favorite */

.favorite{
position:absolute;
top:10px;
right:12px;
cursor:pointer;
font-size:18px;
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

/* skeleton */

.skeleton{
height:120px;
border-radius:18px;
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
margin-top:60px;
color:#94a3b8;
}

`}</style>


<div className="header">

<h1>Question Bank</h1>
<p>Select your class to explore papers</p>

<div className="counter">
{loading ? "Loading..." : `${classes.length} classes available`}
</div>

</div>


<div className="searchBox">

<input
placeholder="Search class..."
value={search}
onChange={e=>setSearch(e.target.value)}
/>

</div>


{loading ?

<div className="grid">

{Array(6).fill(0).map((_,i)=>(
<div key={i} className="skeleton"></div>
))}

</div>

:

<div className="grid">

{filtered.map((cls,i)=>(

<div key={cls.id} className="card">

<div
className="favorite"
onClick={()=>toggleFavorite(cls.id)}
>

{favorites.includes(cls.id) ? "⭐" : "☆"}

</div>

<Link
to={`/subjects/${cls.id}`}
style={{textDecoration:"none",color:"white"}}
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

</div>

))}

</div>
}


{!loading && filtered.length===0 && (

<div className="empty">

<h3>No classes found</h3>
<p>Try another search</p>

</div>

)}

</div>

)

}

export default Classes