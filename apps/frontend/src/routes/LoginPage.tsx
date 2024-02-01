/** importations **/
import React, { useState, useEffect } from "react";
import "../components/loginPage/LoginPage.css";
import Logo from "../images/massGeneralBrighamLogo.png";
import Avatar from "../images/avatarIcon.png";
//import EyeOpen from "../images/UnobscuredPassword.png";
//import EyeClosed from "../images/ObscuredPassword.png";
import ExitButton from "../components/ExitButton.tsx";
import { useNavigate } from "react-router-dom";
/**
 * Create login page for staff/admin
 */
export default function WelcomePage() {
  //Create username and password variables to store inputs
  const [username, setUsername] = useState(""); //Variable for Username
  const [password, setPassword] = useState(""); //Variable for Password
  const [showPassword, setShowPassword] = useState(false); //Boolean for if password is shown or not
  const [noUsername, setNoUsername] = useState(false);
  const [noPassword, setNoPassword] = useState(false);
  const [incorrectError, setIncorrectError] = useState(false);
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

  /**
   * Assigns input to the username variable, and if empty displays alert (alert currently not working, alternative implemented but hope to use in future)
   * @param username Value entered into the username textbox
   */
  function handleUsername(username: string) {
    setUsername(username);
  }

  /**
   * Assigns input to the password variable, and if empty displays alert (alert currently not working, alternative implemented but hope to use in future)
   * @param password Value entered into the password textbox
   */
  function handlePassword(username: string) {
    setPassword(username);
  }

  /**
   * When submit button pushed, determines if values entered are valid login credentials
   * If so, navigates to the map page
   * If not, returns with telling the error message to show
   */
  function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    if (username === "" && !noPassword) {
      setNoUsername(true);
    } else {
      setNoUsername(false);

      if (password === "" && !noUsername) {
        setNoPassword(true);
      } else setNoPassword(false);
    }

    if (username === "admin" && password === "admin") {
      navigate("/AdminMapPage");
    } else if (username != "" && password != "") {
      setIncorrectError(true);
    }
  }

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
            <form>
              {noUsername ? (
                <div className={"incorrect"}>Username Required</div>
              ) : null}

              {noPassword ? (
                <div className={"incorrect"}>Password Required</div>
              ) : null}

              {incorrectError ? ( //If the entered username or password are incorrect, shows error message
                <div className={"incorrect"}>
                  Incorrect Username or Password
                </div>
              ) : null}

              <input //Textbox to enter Username
                className={"usernameButton"}
                required
                type="text"
                id="username"
                value={username}
                placeholder={"*Username"}
                onChange={(e) => handleUsername(e.target.value)}
              />

              <br />

              <input //Textbox to enter Password
                className={"passwordButton"}
                required
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                placeholder={"*Password"}
                onChange={(e) => handlePassword(e.target.value)}
              />

              {/*Button to toggle visbility of password on/off (defaults to off)*/}
              <div className={"showPassButton"}>
                <input
                  id={"showPass"}
                  type={"checkbox"}
                  onChange={() => setShowPassword((prev) => !prev)}
                />
                <label htmlFor={"showPass"}>Show Password</label>
              </div>

              <br />

              <button
                className={"loginButton"}
                onClick={(e) => handleSubmit(e)}
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
