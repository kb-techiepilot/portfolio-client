import React from 'react';
import { useHistory } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithHistory = ({ children }) => {
    const history = useHistory();

    // //dev
    const domain = "dev-604foaig.us.auth0.com";
    const clientId = "AsCWiw4HIadVWBYgf8uyFoleopawaGtF";

    // prod 
    // const domain = "dev-604foaig.us.auth0.com";
    // const clientId = "vInTF8GX7bFcbTdwEecK6I7JVMUsWLw2";

    const audience = "https://techiepilot.in";

    const onRedirectCallback = ( appState ) => {
        history.push(appState?.returnTo || window.location.pathname );
    };

    return(
        <Auth0Provider
            domain              = { domain }
            clientId            = { clientId }
            redirectUri         = { window.location.origin }
            onRedirectCallback  = { onRedirectCallback }
            audience            = { audience }
        >
            { children }
        </Auth0Provider>
    );
};

export default Auth0ProviderWithHistory;