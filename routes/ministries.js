"use strict";

/** Routes for ministries. */

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureIsAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Ministry = require("../models/ministry");
const createMinistrySchema = require("../schemas/createMinistry.json");

const router = express.Router();

/** get allll ministries */

router.get("/", ensureIsAdmin, async (req, res, next) => {
  try {
    const results = await Ministry.getAll();
    return res.status(201).json(results);
  } catch (err) {
    return next(err);
  }
});

/* Create a new ministry */
router.post("/", ensureIsAdmin, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, createMinistrySchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const results = await Ministry.create(req.body);
    return res.status(201).json(results);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
