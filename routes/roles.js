"use strict";

/** Routes for roles. */

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError, UnauthorizedError } = require("../expressError");
const Role = require("../models/role");

const router = express.Router();

/** Create a new event template */

router.get("/", async (req, res, next) => {
  try {
    const results = await Role.getAll();
    return res.status(200).json(results);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
