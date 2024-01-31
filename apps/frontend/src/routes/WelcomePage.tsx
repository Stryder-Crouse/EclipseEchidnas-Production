/** importations **/
import React, { useEffect } from "react";
import "../components/welcomePage.css";
import Logo from "../components/massGeneralBrighamLogo.png";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  /** NAVIGATION **/
  const navigate = useNavigate();

  useEffect(() => {
    //set background to first floor on component load
    document.body.style.backgroundImage =
      "url(/src/components/backgroundHospitalImage.jpg)";
  }, []);

  return (
    <div className={"welcomeLogin"}>
      {/* Div Container for the Login surrounded by white space */}
      <h1 className={"welcomeTo"}>Welcome to</h1>
      <img src={Logo} alt="Logo" className={"mgbLogo"} />

      {/* Button Container */}
      <div className={"buttonsContainer"}>
        <button
          className={"button guestButton"}
          onClick={() => navigate("MapPage")}
        >
          Guest
        </button>
        <button
          className={"button staffLoginButton"}
          onClick={() => navigate("StaffLogin")}
        >
          Staff Login
        </button>
      </div>
    </div>
  );
}
