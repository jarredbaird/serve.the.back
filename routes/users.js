"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.register(req.body);
    if (res.locals.user.isAdmin) {
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
