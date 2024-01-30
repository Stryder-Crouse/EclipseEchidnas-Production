import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/component-css/admin-login-button.css";

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
