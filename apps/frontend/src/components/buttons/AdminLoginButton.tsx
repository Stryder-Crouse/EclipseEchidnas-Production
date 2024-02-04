import React from "react";
import "../../css/component-css/buttons/admin-login-button.css";

/**
 * Button Component on the Welcome Page
 * Connected to admin-login-button.css
 * Leads to /StaffLogin
 */
function AdminLoginButton() {
  return (
    <a href={"/LoginPage"} className={"linkStuff"}>
      <button className={"button adminLoginButton"}>Admin Login</button>
    </a>
  );
}

export default AdminLoginButton;
