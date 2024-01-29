/** importations **/
import React, { useEffect } from "react";
import { useState } from "react";
import "../css/LoginPage.css";
import Logo from "../images/massGeneralBrighamLogo.png";
import { useNavigate } from "react-router-dom";
import Avatar from "../images/avatarIcon.png";
//import EyeOpen from "../images/UnobscuredPassword.png";
//import EyeClosed from "../images/ObscuredPassword.png";

/**
 * Create login page for staff/admin
 */
export default function WelcomePage() {
  //Create username and password variables to store inputs
  const [username, setUsername] = useState(""); //Variable for Username
  const [password, setPassword] = useState(""); //Variable for Password
  const [showPassword, setShowPassword] = useState(false); //Boolean for if password is shown or not
  const navigate = useNavigate();

  /**
   * Toggle to show or hide password with button push
   * Currently not in use, difficulty implementing but hope to use in future
   */
  /*
  function passToggle() {
      if(showPassword) { //If password is set to show when button pushed
          setShowPassword(false); //hide password
          return(
              <img src={EyeClosed} alt={"HidePass"}/> //Change image shown to the closed eye
          );
      } else { //if password is set to hide when button pushed
          setShowPassword(true); //show password
          return(
              <img src={EyeOpen} alt={"ShowPass"}/> //Change image shown to the open eye
          );
      }
  }*/

  useEffect(() => {
    //set background to hospital on component load
    document.body.style.backgroundImage =
      "url(/src/images/backgroundHospitalImage.jpg)";
  }, []);

  return (
    <div className={"loginBackground"}>
      {/* Button to reset and go back go welcomePage */}

      <button className={"xout"} onClick={() => navigate("/")}>
        X
      </button>

      <div className={"welcomeLogin"}>
        <div className={"contentContainers"}>
          {/* Hospital Logo */}
          <img src={Logo} alt="Logo" className={"hospLogo"} />
          <br />
          {/* Profile Logo */}
          {/* Profile Logo */}
          <img src={Avatar} alt="AvatarPic" className={"avatarPic"} />
          <div className={"inputBox"}>
            <form
              onSubmit={() => {
                //make sure locations can be loaded again once we comeback

                navigate("/MapPage");
              }}
            >
              <input
                className={"usernameButton"}
                type="text"
                id="username"
                value={username}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <br />
              <input
                className={"passwordButton"}
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className={"showPassButton"}>
                <input
                  id={"showPass"}
                  type={"checkbox"}
                  onChange={() => setShowPassword((prev) => !prev)}
                />
                <label htmlFor={"showPass"}>Show Password</label>
              </div>
              <br />
              <button type="submit" className={"loginButton"}>
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
