import React, { useState } from "react";
import { Button, ButtonGroup, Container } from "react-bootstrap";
import { Highlight, Loading } from "../components";
import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react";

export const ExternalApi = () => {
  const [message, setMessage] = useState("");

  const { getAccessTokenSilently } = useAuth0();

  // const callAPI = async() => {
  //   try {
  //     const response = await fetch(`http://localhost:7001/api/public-message`);
  //     const responseData = await response.json();
  //     setMessage(responseData);
  //   } catch(error) {
  //     setMessage("Error");
  //   }
  // };

  // const callSecureApi = async() => {
  //   try {
  //     const token = await getAccessTokenSilently();

  //     const response = await fetch(
  //       `http://localhost:7001/api/private-message`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     const responseData = await response.json();

  //     setMessage(responseData);
  //   } catch(error) {
  //     setMessage(error.message);
  //   }
  // };

  const getWishlist = async() => {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(
        `https://kb-shares.azurewebsites.net/api/v1/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = await response.json();

      setMessage(responseData);
    } catch(error) {
      setMessage(error.message);
    }
  };

  const getHoldings = async() => {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(
        `https://kb-shares.azurewebsites.net/api/v1/holdings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = await response.json();

      setMessage(responseData);
    } catch(error) {
      setMessage(error.message);
    }
  };

  return (
    <Container className="mb-5">
      <h1>External API</h1>
      <p>
        You use will use a button to call an external API using an access token,
        and the API will validate it using the API's audience value.{" "}
        <strong>This route should be private</strong>.
      </p>
      <ButtonGroup>
        <Button onClick={getWishlist} color="primary" className="mt-5">
          Get Wishlist
        </Button>
        <Button onClick={getHoldings} color="primary" className="mt-5">
          Get Holdings
        </Button>
      </ButtonGroup>

      {message && (
        <div className="mt-5">
          <h6 className="muted">Result</h6>
          <Highlight> {JSON.stringify(message, null, 2)}
          </Highlight>
        </div>
      )}
    </Container>
  );
};

export default withAuthenticationRequired (ExternalApi, {
  onRedirecting: ()=> <Loading/>
});
