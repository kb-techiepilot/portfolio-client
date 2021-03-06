const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const { resolve } = require("path");

require("dotenv").config({
  path: resolve(process.cwd(), "src", "server", ".env"),
});

const app = express();

const port = "7001";
const appOrigin = "https://compassionate-mclean-2e87bb.netlify.app";
const audience = "https://techiepilot.in";
const issuer = "https://dev-604foaig.us.auth0.com/";

if (!issuer || !audience) {
  throw new Error("Please make sure that .env is in place and populated");
}

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: appOrigin }));

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${issuer}.well-known/jwks.json`,
  }),

  audience: audience,
  issuer: issuer,
  algorithms: ["RS256"],
});

app.get("/api/public-message", (req, res) => {
  res.send({
    msg: "The API doesn't require an access token to share this message.",
  });
});

app.get("/api/private-message", checkJwt, (req, res) => {
  res.send({
    msg: "The API successfully validated your access token.",
  });
});

app.listen(port, () => console.log(`API Server listening on port ${port}`));
