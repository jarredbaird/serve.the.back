"use strict";

const jwt = require("jsonwebtoken");
const { SECRET_KEY, JWT_EXPIRES_IN } = require("../config");

/** Sign a JWT for a user. Payload: { uId, username, isAdmin } plus iat/exp. */
function createToken(user) {
  return jwt.sign(
    { uId: user.uId, username: user.username, isAdmin: !!user.isAdmin },
    SECRET_KEY,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

module.exports = { createToken };
