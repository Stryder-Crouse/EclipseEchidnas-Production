import React from "react";
import "../css/component-css/guest-button.css";

/**
 * Button Component on the Welcome Page
 * Connected to guest-button.css
 * Leads to /MapPage
 */
function GuestButton() {
  return (
    <a href={"/MapPage"} className={"linkstuff"}>
      <button className={"button guestButton"}>Guest</button>
    </a>
  );
}

export default GuestButton;
