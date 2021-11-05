"use strict";

/** Routes for eventTemplates. */

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError, UnauthorizedError } = require("../expressError");
const ScheduledEvent = require("../models/scheduledEvent");
const createScheduledEventSchema = require("../schemas/createScheduledEvent.json");

const router = express.Router();

/** Create a new scheduled event */

router.post("/", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, createScheduledEventSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const createdScheduledEvent = await ScheduledEvent.create(req.body);
    return res.status(201).json(createdScheduledEvent);
  } catch (err) {
    return next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const results = await ScheduledEvent.getAll();
    return res.status(200).json(results);
  } catch (err) {
    return next(err);
  }
});

router.get("/roles", async (req, res, next) => {
  try {
    const results = await ScheduledEvent.getAllRequiredRoles();
    return res.status(200).json(results);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
