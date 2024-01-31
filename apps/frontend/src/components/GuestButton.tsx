import React from "react";
import "../components/component-css/guest-button.css";

/**
 * Button Component on the Welcome Page
 * Connected to guest-button.css
 * Leads to /AdminMapPage
 */
function GuestButton() {
  return (
      <a href={"/GuestMap"} className={"linkstuff"}>
          <button className={"button guestButton"}>Guest</button>
          <div className="tooltip">You are a looser</div>
      </a>
  );
}

export default GuestButton;
