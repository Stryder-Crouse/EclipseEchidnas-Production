/** importations **/
import React, { useEffect } from "react";
import "../css/route-css/welcomePage.css";
import Logo from "../images/massGeneralBrighamLogo.png";
import GuestButton from "../components/buttons/GuestButton.tsx";
import AdminLoginButton from "../components/buttons/AdminLoginButton.tsx";
import "../css/component-css/buttons/guest-button.css";

export default function WelcomePage() {
  //Setting backgroung Image
  useEffect(() => {
    //set background to first floor on component load
    document.body.style.backgroundImage =
      "url(/src/images/backgroundHospitalImage.jpg)";
  }, []);

  return (
    <div className={"welcomeLogin"}>
      {/* Div Container for the Login surrounded by white space */}
      <h1 className={"welcomeTo"}>Welcome to</h1>
      <img src={Logo} alt="Logo" className={"mgbLogo"} />

      {/* Button Container */}
      <div className={"buttonsContainer"}>
        <GuestButton />
        <AdminLoginButton />
      </div>
    </div>
  );
}
