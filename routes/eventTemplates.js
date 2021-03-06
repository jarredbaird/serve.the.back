"use strict";

/** Routes for eventTemplates. */

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureLoggedIn, ensureIsAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const EventTemplate = require("../models/eventTemplate");
const createEventTemplateSchema = require("../schemas/createEventTemplate.json");

const router = express.Router();

/** Create a new event template */

router.post("/", ensureIsAdmin, async (req, res, next) => {
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

router.get("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const results = await EventTemplate.getAll();
    return res.status(200).json(results);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
