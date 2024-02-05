import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Auth0Provider
      domain={"dev-x2g17lz7rky0u6uf.us.auth0.com"}
      clientId={"Wsc7NDq3owlTPYoflb84XG1UOUfx9WW0"}
      authorizationParams={{
        redirect_uri: "http://localhost:3000/AdminMapPage",
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
);
