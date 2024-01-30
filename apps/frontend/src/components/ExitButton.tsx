import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/component-css/exit-button.css";

/**
 * Button Component
 * Leads to ""
 */
function ExitButton() {
  const navigate = useNavigate();
  return (
    <button className={"xout"} onClick={() => navigate("/")}>
      X
    </button>
  );
}

export default ExitButton;
