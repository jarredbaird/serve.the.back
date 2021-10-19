"use strict";

/** Routes for eventTemplates. */

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError, UnauthorizedError } = require("../expressError");
const Ministry = require("../models/ministry");

const router = express.Router();

/** Create a new event template */

router.get("/", async (req, res, next) => {
  try {
    const results = await Ministry.getAll();
    return res.status(201).json(results);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
