/** importations **/
import React from "react";
import "../components/LoginPage.css";
import Logo from "../components/massGeneralBrighamLogo.png";

export default function WelcomePage() {
  return (
    <body className={"loginBackground"}>
      <div className={"welcomeLogin"}>
        <img src={Logo} alt="Logo" className={"hospLogo"} />
      </div>
    </body>
  );
}
