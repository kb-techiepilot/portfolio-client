import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { Button } from "react-bootstrap";

function LoginButton(props) {
    const { loginWithRedirect } = useAuth0();

    return (
        <Button
            onClick={ () => loginWithRedirect() }
            id="LoginBtn"
            variant="primary"
            className="btn-margin"
        >
        Log In
        </Button>
    );
};

export default LoginButton;
