import React from "react";
import Alert from "react-bootstrap/Alert";

function EmailAlert() {
  return (
    <Alert variant={"warning"} dismissible>
      <Alert.Heading>Email Field Required</Alert.Heading>;
      <p>Enter valid Email to continue</p>;
    </Alert>
  );
}

export default EmailAlert;
