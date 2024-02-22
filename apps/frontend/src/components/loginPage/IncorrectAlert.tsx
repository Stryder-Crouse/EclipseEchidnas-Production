import React from "react";
import Alert from "react-bootstrap/Alert";

function IncorrectAlert() {
    return (
        <Alert variant={"warning"} dismissible>
            <Alert.Heading>Incorrect Username or Password</Alert.Heading>;
        </Alert>
    );
}

export default IncorrectAlert;
