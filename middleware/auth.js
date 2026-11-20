"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError, ForbiddenError } = require("../expressError");

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it (signature + expiry), and, if valid,
 * store the payload { uId, username, isAdmin } on res.locals.user.
 *
 * It's not an error if no token was provided or if the token is invalid or
 * expired — the request just continues as signed out. Tokens issued before
 * uId was added are treated as signed out, so those users sign in again.
 *
 * Convention: 401 = not signed in (frontend signs the user out),
 *             403 = signed in but not allowed.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      const payload = jwt.verify(token, SECRET_KEY);
      if (payload.uId) res.locals.user = payload;
    }
    return next();
  } catch (err) {
    return next();
  }
}

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

function ensureIsAdmin(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    if (!res.locals.user.isAdmin)
      throw new ForbiddenError("User must have admin privileges");
    return next();
  } catch (err) {
    return next(err);
  }
}

function ensureIsUserOrAdmin(req, res, next) {
  try {
    const user = res.locals.user;
    if (!user) throw new UnauthorizedError();
    const { username, uId } = req.params;
    const isSelf =
      (username !== undefined && user.username === username) ||
      (uId !== undefined && String(user.uId) === String(uId));
    if (!(user.isAdmin || isSelf))
      throw new ForbiddenError("You can only request your own information");
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  authenticateJWT,
  ensureIsAdmin,
  ensureIsUserOrAdmin,
  ensureLoggedIn,
};
