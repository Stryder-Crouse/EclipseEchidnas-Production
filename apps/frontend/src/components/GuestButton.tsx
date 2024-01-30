import React from "react";
import { useNavigate } from "react-router-dom";

function GuestButton() {
  const navigate = useNavigate();
  return (
    <button
      className={"button guestButton"}
      onClick={() => navigate("/MapPage")}
    >
      Guest
    </button>
  );
}

export default GuestButton;
