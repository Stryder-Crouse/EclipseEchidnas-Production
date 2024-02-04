import React from "react";
import Alert from "react-bootstrap/Alert";

function UsernameAlert() {
  return (
    <Alert variant={"warning"} dismissible>
      <Alert.Heading>Username Field Required</Alert.Heading>;
      <p>Enter valid Username to continue</p>;
    </Alert>
  );
}

export default UsernameAlert;
