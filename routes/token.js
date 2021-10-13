"use strict";

const jsonschema = require("jsonschema");
const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const userSignInSchema = require("../schemas/userSignIn.json");
const userSignUpSchema = require("../schemas/userSignUp.json");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

router.post("/get-token", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, User);
    return res.json("1");
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
