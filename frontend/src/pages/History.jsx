import { useState } from "react";
import { FaSearch, FaEye, FaTrash, FaChartLine } from "react-icons/fa";
import "../assets/css/history.css";

function History() {

    const [search, setSearch] = useState("");

    const interviews = [

        {
            id:1,
            date:"11-07-2026",
            company:"Google",
            role:"Frontend Developer",
            domain:"React",
            score:92,
            status:"Pass"
        },

        {
            id:2,
            date:"09-07-2026",
            company:"Amazon",
            role:"Java Developer",
            domain:"Java",
            score:81,
            status:"Pass"
        },

        {
            id:3,
            date:"05-07-2026",
            company:"Microsoft",
            role:"Python Developer",
            domain:"Python",
            score:68,
            status:"Fail"
        },

        {
            id:4,
            date:"01-07-2026",
            company:"Infosys",
            role:"Full Stack",
            domain:"MERN",
            score:89,
            status:"Pass"
        }

    ];

    const filtered = interviews.filter((item)=>

        item.company.toLowerCase().includes(search.toLowerCase()) ||

        item.role.toLowerCase().includes(search.toLowerCase()) ||

        item.domain.toLowerCase().includes(search.toLowerCase())

    );

    return(

<div className="history-page">

<h1>

Interview History

</h1>

<div className="search-box">

<FaSearch/>

<input

type="text"

placeholder="Search Company / Role"

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>

</div>

<table>

<thead>

<tr>

<th>Date</th>

<th>Company</th>

<th>Role</th>

<th>Domain</th>

<th>Score</th>

<th>Status</th>

<th>Actions</th>

</tr>

</thead>

<tbody>

{

filtered.map((item)=>(

<tr key={item.id}>

<td>{item.date}</td>

<td>{item.company}</td>

<td>{item.role}</td>

<td>{item.domain}</td>

<td>{item.score}%</td>

<td>

<span className={

item.status==="Pass"

?

"pass"

:

"fail"

}>

{item.status}

</span>

</td>

<td>

<button className="view">

<FaEye/>

</button>

<button className="delete">

<FaTrash/>

</button>

</td>

</tr>

))

}

</tbody>

</table>

<div className="summary">

<div className="summary-card">

<FaChartLine/>

<h2>4</h2>

<p>Total Interviews</p>

</div>

<div className="summary-card">

<h2>82%</h2>

<p>Average Score</p>

</div>

<div className="summary-card">

<h2>75%</h2>

<p>Success Rate</p>

</div>

</div>

</div>

);

}

export default History;