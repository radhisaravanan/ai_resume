import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import InterviewSetup from "./pages/InterviewSetup";
import Permission from "./pages/Permission";
import InterviewRoom from "./pages/InterviewRoom";
import Report from "./pages/Report";


function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* Existing Pages */}

        <Route 
          path="/" 
          element={<Home />} 
        />


        <Route 
          path="/login" 
          element={<Login />} 
        />


        <Route 
          path="/register" 
          element={<Register />} 
        />


        <Route 
          path="/dashboard" 
          element={<Dashboard />} 
        />



        {/* Interview Flow */}

        <Route
          path="/resume"
          element={<ResumeAnalyzer />}
        />


        <Route
          path="/setup"
          element={<InterviewSetup />}
        />


        <Route
          path="/permission"
          element={<Permission />}
        />


        <Route
          path="/interview"
          element={<InterviewRoom />}
        />


        <Route
          path="/report"
          element={<Report />}
        />
<Route 
 path="/resume" 
 element={<ResumeAnalyzer />} 
/>


<Route 
 path="/interview" 
 element={<InterviewRoom />} 
/>

      </Routes>


    </BrowserRouter>

  );

}


export default App;