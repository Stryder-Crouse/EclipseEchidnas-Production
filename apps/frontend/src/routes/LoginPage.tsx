/** importations **/
import React from "react";
import { useState } from "react";
import "../components/LoginPage.css";
import Logo from "../components/massGeneralBrighamLogo.png";
//import {LoginComponent} from "../components/LoginComponent.tsx";

export default function WelcomePage() {
  //Create username and password variables to store inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <body className={"loginBackground"}>
      <div className={"welcomeLogin"}>
        <button className={"resetButton"}>X</button>
        <br />
        <img src={Logo} alt="Logo" className={"hospLogo"} /> <br />
        <img
          src="https://s3-alpha-sig.figma.com/img/d672/f1c8/ecba11116e2f0580ae6ae0c35e111c13?Expires=1707091200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=bzJp1u-N7r4qnxv4qkKvRRf0knZajqpRApR8poD-XHJWFHpTJ~J4uAmdq7xPl3d-WBBaLjW3MVwsJI59DY4JK9ClJiBWnioPG~3QsnDde8xU5r123bcZWVtTf7RzFB3tzeGb1-zpzr9anSwu3B92887XF8QHtSo8f0W8VyPVxWaWnlSJcqAm93aRIvzZBjH~3B0YX8Y9ETuDHhotio6f1xVGyAGKYw5JYEH6lXqXcn1sB~TY5txNkDky4rahH7Ca7~y9ACFAtnh5HtgmlqZhKYbrb97HBpSauu-zEQkuFb9KGibSp4XWJxA1DD9KIKsrO9DBj8ATw4O6hSwCw5ORmQ__"
          alt="AvatarPic"
          className={"avatarPic"}
        />
        <form>
          <div className={"inputBox"}>
            <input
              type="text"
              id="username"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <input
              type="text"
              id="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              //label="Password"
            />
          </div>
          <br />
          <button type="submit"> Login</button>
        </form>
      </div>
    </body>
  );
}
