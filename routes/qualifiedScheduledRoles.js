"use strict";

/** Routes to find roles that users are qualified for. */

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError, UnauthorizedError } = require("../expressError");
const QualifiedScheduledRole = require("../models/qualifiedScheduledRole");

const router = express.Router();

/** Find roles on the calendar that a specific user is qualified to do*/

router.get("/:uId", async (req, res, next) => {
  try {
    const results = await QualifiedScheduledRole.getAllQualifiedScheduledRoles(
      req.params
    );
    return res.status(200).json(results);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
