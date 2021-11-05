"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError, UnauthorizedError } = require("../expressError");
const User = require("../models/user");
const userNewSchema = require("../schemas/userSignUp.json");

const router = express.Router();

/** Create a new user */

router.post("/", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    let user;
    const adminRequest =
      res.locals && res.locals.user && res.locals.user.isAdmin;
    if (req.body.isAdmin) {
      if (adminRequest) {
        user = await User.register(req.body);
      } else {
        throw new UnauthorizedError("Unauthorized");
      }
    }

    user = await User.register(req.body);
    const token = jwt.sign(
      { username: user.username, isAdmin: user.isAdmin },
      SECRET_KEY
    );
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const results = await User.getAll();
    return res.status(200).json(results);
  } catch (err) {
    return next(err);
  }
});

router.get("/:username", async (req, res, next) => {
  try {
    const userInfo = await User.getUserInfo(req.params);
    return res.status(200).json(userInfo);
  } catch (e) {
    return next(e);
  }
});

router.post("/qualify/:uId", async (req, res, next) => {
  debugger;
  try {
    const results = await User.qualifyForRoles(req.params.uId, req.body);
    return res.status(201).json(results);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
