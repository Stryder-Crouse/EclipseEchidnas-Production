import React from "react";

import "../components/component-css/exit-button.css";

/**
 * Button Component
 * Leads to ""
 */
function ExitButton() {
  return (
    <div className="xout">
      <div className="xout-container">
        {/* Hover effect applied to the ExitButton */}
        <a href={"/"}>
          <button className={"xout"}>X</button>
        </a>
        <div className="hover-content">End Session</div>
      </div>
    </div>
  );
}

export default ExitButton;
