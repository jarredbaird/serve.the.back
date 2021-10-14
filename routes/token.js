"use strict";

const jsonschema = require("jsonschema");
const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const userSignInSchema = require("../schemas/userSignIn.json");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

router.post("/get-token", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userSignInSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.authenticate(req.body);
    const token = jwt.sign(
      { username: user.username, isAdmin: user.isAdmin },
      SECRET_KEY
    );
    return res.status(201).json({ user, token });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
