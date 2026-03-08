import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

function Papers() {

const { subjectId } = useParams()

const [papers,setPapers] = useState([])
const [loading,setLoading] = useState(true)
const [search,setSearch] = useState("")
const [sort,setSort] = useState("year")
const [viewYear,setViewYear] = useState("All")
const [favorites,setFavorites] = useState([])
const [preview,setPreview] = useState(null)

useEffect(()=>{

setLoading(true)

API.get(`papers/${subjectId}/`)
.then(res=>setPapers(res.data))
.catch(err=>console.log(err))
.finally(()=>setLoading(false))

},[subjectId])


const years=["All",...new Set(papers.map(p=>p.year).sort((a,b)=>b-a))]


let filtered = papers.filter(p=>{

const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
const matchYear = viewYear==="All" || p.year===viewYear

return matchSearch && matchYear

})


if(sort==="year"){
filtered = filtered.sort((a,b)=>b.year-a.year)
}

if(sort==="title"){
filtered = filtered.sort((a,b)=>a.title.localeCompare(b.title))
}


function toggleFavorite(id){

if(favorites.includes(id)){

setFavorites(favorites.filter(f=>f!==id))

}else{

setFavorites([...favorites,id])

}

}


return(

<div className="page">

<style>{`

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');

*{margin:0;padding:0;box-sizing:border-box}

.page{

min-height:100vh;
background:linear-gradient(180deg,#06090f,#0f172a);
font-family:'Inter',sans-serif;
color:white;
padding:20px;

}

.container{

max-width:720px;
margin:auto;

}

/* header */

.header{

display:flex;
align-items:center;
gap:14px;
margin-bottom:25px;

}

.back{

width:42px;
height:42px;
display:flex;
align-items:center;
justify-content:center;
border-radius:12px;
background:#111827;
border:1px solid rgba(255,255,255,.08);
text-decoration:none;
color:white;

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

margin-bottom:16px;

}

.search input{

width:100%;
padding:13px;
border-radius:14px;
border:1px solid rgba(255,255,255,.08);
background:#111827;
color:white;
outline:none;

}

/* filters */

.controls{

display:flex;
gap:8px;
margin-bottom:20px;
flex-wrap:wrap;

}

.pill{

padding:6px 12px;
border-radius:100px;
border:1px solid rgba(255,255,255,.08);
background:#111827;
color:#94a3b8;
cursor:pointer;

}

.pill.active{

background:#8b5cf6;
color:white;
border:none;

}

/* card */

.card{

background:#111827;
border:1px solid rgba(255,255,255,.08);
border-radius:16px;
padding:16px;
margin-bottom:12px;
transition:.3s;
position:relative;

}

.card:hover{

border-color:#8b5cf6;
transform:translateY(-2px);
box-shadow:0 12px 28px rgba(139,92,246,.25);

}

.paperTitle{

font-weight:700;
margin-bottom:6px;

}

.meta{

display:flex;
gap:8px;
margin-bottom:10px;

}

.year{

background:#8b5cf622;
padding:3px 8px;
border-radius:6px;
font-size:12px;

}

/* buttons */

.actions{

display:flex;
gap:8px;

}

.btn{

flex:1;
padding:9px;
border-radius:10px;
border:none;
cursor:pointer;
font-size:13px;

}

.view{

background:#8b5cf622;
color:#c4b5fd;

}

.download{

background:#10b98122;
color:#34d399;

}

/* favorite */

.favorite{

position:absolute;
top:14px;
right:14px;
cursor:pointer;
font-size:18px;

}

/* preview modal */

.modal{

position:fixed;
inset:0;
background:rgba(0,0,0,.7);
display:flex;
align-items:center;
justify-content:center;
z-index:100;

}

.modalBox{

width:90%;
height:90%;
background:#000;
border-radius:10px;
overflow:hidden;

}

.modal iframe{

width:100%;
height:100%;
border:none;

}

.close{

position:absolute;
top:20px;
right:30px;
font-size:28px;
cursor:pointer;

}

`}</style>


<div className="container">

<div className="header">

<Link to={-1} className="back">⬅</Link>

<div className="title">

<h1>Question Papers</h1>

<p>{filtered.length} papers available</p>

</div>

</div>


<div className="search">

<input
placeholder="Search papers..."
value={search}
onChange={e=>setSearch(e.target.value)}
/>

</div>


<div className="controls">

<select value={sort} onChange={e=>setSort(e.target.value)} className="pill">

<option value="year">Sort by Year</option>
<option value="title">Sort by Title</option>

</select>

{years.map(y=>(

<button
key={y}
className={`pill ${viewYear===y ? "active":""}`}
onClick={()=>setViewYear(y)}
>

{y==="All" ? "All Years" : y}

</button>

))}

</div>


{loading ? <p>Loading...</p> :

filtered.map(paper=>(

<div key={paper.id} className="card">

<div
className="favorite"
onClick={()=>toggleFavorite(paper.id)}
>

{favorites.includes(paper.id) ? "⭐" : "☆"}

</div>

<div className="paperTitle">

📄 {paper.title}

</div>

<div className="meta">

<span className="year">{paper.year}</span>

</div>


<div className="actions">

<button
className="btn view"
onClick={()=>setPreview(paper.pdf)}
>

👁 Preview

</button>


<a
href={paper.pdf}
download
className="btn download"
>

⬇ Download

</a>

</div>

</div>

))

}


{preview && (

<div className="modal">

<div className="close" onClick={()=>setPreview(null)}>✖</div>

<div className="modalBox">

<iframe src={preview}></iframe>

</div>

</div>

)}

</div>

</div>

)

}

export default Papers