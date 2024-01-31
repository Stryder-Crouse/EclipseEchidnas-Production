import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/component-css/exit-button.css";

/**
 * Button Component
 * Leads to ""
 */
function ExitButton() {
  const navigate = useNavigate();
  return (
    <div className="xout">
      <div className="xout-container">
        {/* Hover effect applied to the ExitButton */}
        <button className={"xout"} onClick={() => navigate("/")}>
          X
        </button>
        <div className="hover-content">End Session</div>
      </div>
    </div>
  );
}

export default ExitButton;
