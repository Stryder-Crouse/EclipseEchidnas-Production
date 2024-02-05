import React from "react";
import "../../css/component-css/buttons/admin-login-button.css";
import { useAuth0 } from "@auth0/auth0-react";

/**
 * Button Component on the Welcome Page
 * Connected to admin-login-button.css
 * Leads to /StaffLogin
 */
function AdminLoginButton() {
  const { loginWithRedirect } = useAuth0();

  return (
    <button className={"adminLoginButton"} onClick={() => loginWithRedirect()}>
      Staff Log In
    </button>
  );
}

export default AdminLoginButton;
