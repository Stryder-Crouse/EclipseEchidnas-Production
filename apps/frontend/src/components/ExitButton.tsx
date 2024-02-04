import React from "react";
import "../components/component-css/exit-button.css";
import { useAuth0 } from "@auth0/auth0-react";

/**
 * Button Component
 * Leads to ""
 */
function ExitButton() {
  const { logout } = useAuth0();

  return (
    <div className="xout">
      <div className="xout-container">
        {/* Hover effect applied to the ExitButton */}
        <a href={"/"}>
          <button
            className={"xout"}
            onClick={() =>
              logout({ logoutParams: { returnTo: "http://localhost:3000" } })
            }
          >
            X
          </button>
        </a>
        <div className="hover-content">End Session</div>
      </div>
    </div>
  );
}

export default ExitButton;
