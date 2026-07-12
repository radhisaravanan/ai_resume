import { Link } from "react-router-dom";

import {

FaHome,

FaUser,

FaRobot,

FaHistory,

FaChartBar,

FaCog,

FaSignOutAlt

} from "react-icons/fa";

function Sidebar(){

return(

<div className="sidebar">

<h2>

AI Interview

</h2>

<Link to="/dashboard">

<FaHome/>

Dashboard

</Link>

<Link to="/profile">

<FaUser/>

Profile

</Link>

<Link to="/setup">

<FaRobot/>

Interview

</Link>

<Link to="/history">

<FaHistory/>

History

</Link>

<Link to="/report">

<FaChartBar/>

Report

</Link>

<Link to="/settings">

<FaCog/>

Settings

</Link>

<Link to="/">

<FaSignOutAlt/>

Logout

</Link>

</div>

);

}

export default Sidebar;