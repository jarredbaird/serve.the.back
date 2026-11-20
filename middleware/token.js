"use strict";

const jsonschema = require("jsonschema");
const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const userSignInSchema = require("../schemas/userSignIn.json");
const { createToken } = require("../helpers/tokens");
const { BadRequestError } = require("../expressError");

router.post("/get-token", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userSignInSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.authenticate(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
