/** importations **/
import React from "react";
import "../components/welcomePage.css";
import Logo from "../components/massGeneralBrighamLogo.png";

export default function WelcomePage() {
  return (
    <body>
      <div className={"welcomeLogin"}>
        <h1 className={"welcomeTo"}>Welcome to</h1>
        <img src={Logo} alt="Logo" className={"mgbLogo"} />

        <div className={"buttonsContainer"}>
          <button className={"button guestButton"}>Guest</button>
          <button className={"button staffLoginButton"}>Staff Login</button>
        </div>
      </div>
    </body>
  );
}
