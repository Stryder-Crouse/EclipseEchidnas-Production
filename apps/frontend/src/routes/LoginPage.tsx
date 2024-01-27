/** importations **/
import React, { useEffect } from "react";
import { useState } from "react";
import "../css/LoginPage.css";
import Logo from "../images/massGeneralBrighamLogo.png";
import { useNavigate } from "react-router-dom";
import Avatar from "../images/avatarIcon.png";

export default function WelcomePage() {
  //Create username and password variables to store inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
                type="text"
                id="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                //label="Password"
              />

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
