/** importations **/
import React from "react";
import "../components/welcomePage.css";
import Logo from "../components/massGeneralBrighamLogo.png";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  /** NAVIGATION **/
  const navigate = useNavigate();
  return (
    <body className={"welcome"}>
      <div className={"welcomeLogin"}>
        <h1 className={"welcomeTo"}>Welcome to</h1>
        <img src={Logo} alt="Logo" className={"mgbLogo"} />

        <div className={"buttonsContainer"}>
          <button
            className={"button guestButton"}
            onClick={() => navigate("/MapPage")}
          >
            Guest
          </button>
          <button
            className={"button staffLoginButton"}
            onClick={() => navigate("/StaffLogin")}
          >
            Staff Login
          </button>
        </div>
      </div>
    </body>
  );
}
