"use strict";

/** Routes to find roles that users are qualified for. */

const express = require("express");
const db = require("../db");
const { ensureLoggedIn } = require("../middleware/auth");
const { UnauthorizedError } = require("../expressError");
const QualifiedScheduledRole = require("../models/qualifiedScheduledRole");

const router = express.Router();

/** Find roles on the calendar that a specific user is qualified to do.
 *  Admins can look up anyone; everyone else can only look up themselves. */

router.get("/:uId", ensureLoggedIn, async (req, res, next) => {
  try {
    const me = res.locals.user;
    if (!me.isAdmin) {
      const r = await db.query(`SELECT u_id FROM users WHERE username = $1`, [
        me.username,
      ]);
      if (!r.rows[0] || String(r.rows[0].u_id) !== String(req.params.uId)) {
        throw new UnauthorizedError("You can only request your own information");
      }
    }
    const results = await QualifiedScheduledRole.getAllQualifiedScheduledRoles(
      req.params
    );
    return res.status(200).json(results);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
