/** importations **/
import React, { useEffect } from "react";
import { useState } from "react";
import "../css/LoginPage.css";
import Logo from "../images/massGeneralBrighamLogo.png";
import { useNavigate } from "react-router-dom";
import Avatar from "../images/avatarIcon.png";
import ExitButton from "../components/ExitButton.tsx";
import Alert from "react-bootstrap/Alert";

/**
 * Create login page for staff/admin
 */
export default function WelcomePage() {
  //Create username and password variables to store inputs
  const [username, setUsername] = useState(""); //Variable for Username
  const [password, setPassword] = useState(""); //Variable for Password
  const [showPassword, setShowPassword] = useState(false); //Boolean for if password is shown or not
  const [incorrectError, setIncorrectError] = useState(false);
  const navigate = useNavigate();

  /**
   * Assigns input to the username variable, and if empty displays alert (alert currently not working, alternative implemented but hope to use in future)
   * @param username Value entered into the username textbox
   */
  function handleUsername(username: string) {
    setUsername(username);
    if (username === "") {
      return (
        <Alert variant={"warning"} dismissible>
          <Alert.Heading>Username Field Required</Alert.Heading>;
          <p>Enter valid Username to continue</p>;
        </Alert>
      );
    }
  }

  /**
   * Assigns input to the password variable, and if empty displays alert (alert currently not working, alternative implemented but hope to use in future)
   * @param password Value entered into the password textbox
   */
  function handlePassword(password: string) {
    setPassword(password);
    if (password === "") {
      return (
        <Alert variant={"warning"} dismissible>
          <Alert.Heading>Password Field Required</Alert.Heading>;
          <p>Enter valid Username to continue</p>;
        </Alert>
      );
    }
  }

  /**
   * When submit button pushed, determines if values entered are valid login credentials
   * If so, navigates to the map page
   * If not, returns with telling the error message to show
   */
  function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    if (username === "admin" && password === "admin") navigate("/MapPage");
    else if (username != "" && password != "") {
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
