"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
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
    debugger;
    const user = await User.register(req.body);
    console.log("hello");
    if (res.locals && res.locals.user) {
      return res.status(201).json({ user });
    }
    const token = jwt.sign(
      { username: user.email, isAdmin: user.isAdmin },
      SECRET_KEY
    );
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
