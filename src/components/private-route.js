import React from "react";
import { Route } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Loading } from "./index";

// const PrivateRoute = ({ component, ...args }) => (
function PrivateRoute({component, ...args}){
    return(
        <Route
            component={withAuthenticationRequired(component, {
                onRedirecting: ()=> <Loading/>
            })}
            {...args}
        />
    );
};

export default PrivateRoute