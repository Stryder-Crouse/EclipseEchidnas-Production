import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Auth0Provider
        domain={"dev-hca27okc2srfyen8.us.auth0.com"}
        clientId={"BxAg6HyJiboJvAd47Mj40WepvybXVTpY"}
      authorizationParams={{
        redirect_uri: "https://ec2-3-92-51-142.compute-1.amazonaws.com/RegisterPage",
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
);
