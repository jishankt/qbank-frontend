import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

function Papers() {

const { subjectId } = useParams()

const [papers,setPapers] = useState([])
const [loading,setLoading] = useState(true)
const [search,setSearch] = useState("")
const [viewYear,setViewYear] = useState("All")
const [downloading,setDownloading] = useState(null)

useEffect(()=>{

setLoading(true)

API.get(`papers/${subjectId}/`)
.then(res=>setPapers(res.data))
.catch(err=>console.log(err))
.finally(()=>setLoading(false))

},[subjectId])

const years = ["All",...new Set(papers.map(p=>p.year).sort((a,b)=>b-a))]

const filtered = papers.filter(p=>{

const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
const matchYear = viewYear==="All" || p.year===viewYear

return matchSearch && matchYear

})

const handleDownload = async(paper)=>{

if(!paper.pdf) return

setDownloading(paper.id)

try{

const response = await fetch(paper.pdf)
const blob = await response.blob()

const url = window.URL.createObjectURL(blob)

const link = document.createElement("a")

link.href = url
link.download = `${paper.title}_${paper.year}.pdf`

document.body.appendChild(link)

link.click()

link.remove()

setTimeout(()=>URL.revokeObjectURL(url),5000)

}
catch(err){

alert("Download failed")

}

finally{

setDownloading(null)

}

}

return(

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

}

/* container */

.container{
max-width:650px;
margin:auto;
}

/* topbar */

.topbar{

display:flex;
align-items:center;
gap:14px;
margin-bottom:26px;

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

.searchBox{

position:relative;
margin-bottom:16px;

}

.searchBox input{

width:100%;
padding:13px 16px;
border-radius:14px;
border:1px solid rgba(255,255,255,.08);
background:#12182b;
color:white;
outline:none;

}

.searchBox input:focus{

border-color:#8b5cf6;
box-shadow:0 0 0 3px rgba(139,92,246,.15);

}

/* filters */

.filters{

display:flex;
gap:8px;
overflow:auto;
margin-bottom:22px;

}

.pill{

padding:6px 14px;
border-radius:100px;
border:1px solid rgba(255,255,255,.08);
background:#12182b;
color:#94a3b8;
cursor:pointer;

}

.pill.active{

background:#8b5cf6;
color:white;
border:none;

}

/* paper card */

.card{

background:#12182b;
border:1px solid rgba(255,255,255,.08);
border-radius:16px;
padding:18px;
margin-bottom:12px;
transition:.3s;

}

.card:hover{

border-color:#8b5cf6;
transform:translateY(-2px);
box-shadow:0 10px 25px rgba(139,92,246,.25);

}

.paperTitle{

font-weight:700;
margin-bottom:6px;

}

.meta{

display:flex;
gap:8px;
margin-bottom:12px;

}

.year{

background:#8b5cf622;
padding:3px 8px;
border-radius:6px;
font-size:12px;

}

.badge{

font-size:11px;
background:#ffffff10;
padding:3px 8px;
border-radius:6px;

}

/* buttons */

.actions{

display:flex;
gap:8px;

}

.btn{

flex:1;
padding:10px;
border-radius:10px;
font-size:13px;
cursor:pointer;
border:none;
text-decoration:none;
text-align:center;

}

.view{

background:#8b5cf622;
color:#a78bfa;

}

.download{

background:#10b98122;
color:#34d399;

}

.btn:hover{

transform:translateY(-1px);

}

/* empty */

.empty{

text-align:center;
margin-top:40px;
color:#94a3b8;

}

`}</style>


<div className="container">

<div className="topbar">

<Link to={-1} className="back">⬅</Link>

<div className="title">

<h1>Papers</h1>

<p>{loading ? "Loading..." : `${filtered.length} papers found`}</p>

</div>

</div>


<div className="searchBox">

<input
placeholder="Search papers..."
value={search}
onChange={e=>setSearch(e.target.value)}
/>

</div>


<div className="filters">

{years.map(y=>(

<button
key={y}
className={`pill ${viewYear===y ? "active" : ""}`}
onClick={()=>setViewYear(y)}
>

{y==="All" ? "All" : y}

</button>

))}

</div>


{loading ?

<p>Loading papers...</p>

:

filtered.map(paper=>(

<div key={paper.id} className="card">

<div className="paperTitle">

📄 {paper.title}

</div>

<div className="meta">

<span className="year">{paper.year}</span>

{paper.pdf && <span className="badge">PDF</span>}

</div>


{paper.pdf ?

<div className="actions">

<a
href={paper.pdf}
target="_blank"
rel="noopener noreferrer"
className="btn view"
>

👁 View

</a>


<button
onClick={()=>handleDownload(paper)}
disabled={downloading===paper.id}
className="btn download"
>

{downloading===paper.id ? "⏳ Downloading..." : "⬇ Download"}

</button>

</div>

:

<p>No PDF available</p>

}

</div>

))

}


{!loading && filtered.length===0 && (

<div className="empty">

<h3>No papers found</h3>

<p>Try another search</p>

</div>

)}

</div>

</div>

)

}

export default Papers