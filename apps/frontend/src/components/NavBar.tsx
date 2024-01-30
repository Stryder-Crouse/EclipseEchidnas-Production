import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/NavBar.css";

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <div className="navbar-container">
      <div className="dropdown">
        <button onClick={() => navigate("/LoginPage")} className="dropbtn">
          Staff Login
        </button>
      </div>
      <div className="dropdown">
        <button className="dropbtn">Service Request</button>
        <div className="dropdown-content">
          <a href="#" onClick={() => navigate("/LoginPage")}>
            Medicine
          </a>
        </div>
      </div>
      <div className="dropdown">
        <button className="dropbtn">CSV</button>
        <div className="dropdown-content">
          <a href="#" onClick={() => navigate("/ImportNodeFile")}>
            Nodes
          </a>
          <a href="#" onClick={() => navigate("/ImportEdgeFile")}>
            Edges
          </a>
        </div>
      </div>
    </div>
  );
}
