import React from "react";
import { useState } from "react";

//Component for the Staff Login Screen

export function LoginComponent(): JSX.Element {
  //Create username and password variables to store inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //Actual contents of the page, on submit button push assigns input to variables

  return (
    <div>
      <form>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          //label="Username"
        />
        <br />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          //label="Password"
        />
        <br />
        <button type="submit"> Login </button>
      </form>
    </div>
  );
}
