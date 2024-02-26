import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Auth0Provider
      domain={"dev-w3apfgzf8dmf8bgm.us.auth0.com"}
      clientId={"ijVRkL9jibDQXvn1qCQ2YFLvVHCG2MYu"}
      authorizationParams={{
        redirect_uri: "http://localhost:3000/RegisterPage",
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
);
