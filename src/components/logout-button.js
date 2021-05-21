import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";

function LoginButton(props) {
    const { logout } = useAuth0();

    return (
        <Button
            onClick={ () => logout() }
            id="LogoutBtn"
            variant="danger"
            className="btn-margin"
        >
        Log Out
        </Button>
    );
};

export default LoginButton;
