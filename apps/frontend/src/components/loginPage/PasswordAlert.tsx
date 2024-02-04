import React from "react";
import Alert from "react-bootstrap/Alert";

function PasswordAlert() {
  return (
    <Alert variant={"warning"} dismissible>
      <Alert.Heading>Password Field Required</Alert.Heading>;
      <p>Enter valid Username to continue</p>;
    </Alert>
  );
}

export default PasswordAlert;
