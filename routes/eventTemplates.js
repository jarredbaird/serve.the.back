"use strict";

/** Routes for eventTemplates. */

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError, UnauthorizedError } = require("../expressError");
const EventTemplate = require("../models/eventTemplate");
const createEventTemplateSchema = require("../schemas/createEventTemplate.json");

const router = express.Router();

/** Create a new event template */

router.post("/", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, createEventTemplateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const createdEventTemplate = await EventTemplate.create(req.body);
    return res.status(201).json(createdEventTemplate);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
