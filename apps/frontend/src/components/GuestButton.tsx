import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/component-css/guest-button.css";

/**
 * Button Component on the Welcome Page
 * Connected to guest-button.css
 * Leads to /MapPage
 */
function GuestButton() {
  const navigate = useNavigate();
  return (
    <button
      className={"button guestButton"}
      onClick={() => navigate("/MapPage")}
    >
      Guest
    </button>
  );
}

export default GuestButton;
