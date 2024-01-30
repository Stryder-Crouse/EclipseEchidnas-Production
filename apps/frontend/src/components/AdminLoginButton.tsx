import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/component-css/admin-login-button.css";

/**
 * Button Component on the Welcome Page
 * Connected to admin-login-button.css
 * Leads to /StaffLogin
 */
function AdminLoginButton() {
  const navigate = useNavigate();
  return (
    <button
      className={"button adminLoginButton"}
      onClick={() => navigate("/StaffLogin")}
    >
      Staff Login
    </button>
  );
}

export default AdminLoginButton;
