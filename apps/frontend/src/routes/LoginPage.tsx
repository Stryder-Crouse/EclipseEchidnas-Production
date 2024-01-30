/** importations **/
import React, { useEffect } from "react";
import "../components/loginPage/LoginPage.css";
import Logo from "../images/massGeneralBrighamLogo.png";
import Avatar from "../images/avatarIcon.png";
import ExitButton from "../components/ExitButton.tsx";
import LoginForm from "../components/loginPage/LoginForm.tsx";

/**
 * Create login page for staff/admin
 */
export default function WelcomePage() {
  useEffect(() => {
    //set background to hospital on component load
    document.body.style.backgroundImage =
      "url(/src/images/backgroundHospitalImage.jpg)";
  }, []);

  return (
    <div className={"loginBackground"}>
      {/* Button to reset and go back go welcomePage */}
      <ExitButton />

      <div className={"welcomeLogin"}>
        {" "}
        {/*CSS for Overall Page*/}
        <div className={"contentContainers"}>
          {/* Hospital Logo */}
          <img src={Logo} alt="Logo" className={"hospLogo"} />
          <br />

          {/* Profile Logo */}
          <img src={Avatar} alt="AvatarPic" className={"avatarPic"} />

          <div className={"inputBox"}>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
