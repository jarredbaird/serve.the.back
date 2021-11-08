"use strict";

/** Routes for scheduledUsers. */

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError, UnauthorizedError } = require("../expressError");
const ScheduledUser = require("../models/scheduledUser");
const createScheduledUserSchema = require("../schemas/createScheduledUser.json");

const router = express.Router();

/** Create a new event template */

router.post("/", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, createScheduledUserSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const createdScheduledUser = await ScheduledUser.create(req.body);
    return res.status(201).json(createdScheduledUser);
  } catch (err) {
    return next(err);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, createScheduledUserSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const deletedScheduledUser = await ScheduledUser.delete(req.body);
    return res.status(202).json(deletedScheduledUser);
  } catch (err) {
    return next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const results = await ScheduledUser.getAll();
    return res.status(200).json(results);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
