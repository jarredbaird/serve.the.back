"use strict";

/** Express app for Serve. */

const express = require("express");
const cors = require("cors");

const db = require("./db");
const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./middleware/token");
const userRoutes = require("./routes/users");
const eventTemplateRoutes = require("./routes/eventTemplates");
const ministryRoutes = require("./routes/ministries");
const roleRoutes = require("./routes/roles");
const scheduledEventRoutes = require("./routes/scheduledEvents");
const scheduledUserRoutes = require("./routes/scheduledUsers");
const qualifiedScheduledRolesRoutes = require("./routes/qualifiedScheduledRoles");

const morgan = require("morgan");

const app = express();

// In production, only accept browser requests from the deployed frontend.
app.use(cors(process.env.CORS_ORIGIN ? { origin: process.env.CORS_ORIGIN.split(",") } : {}));
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.get("/health", async function (req, res, next) {
  try {
    await db.query("SELECT 1");
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/event-templates", eventTemplateRoutes);
app.use("/ministries", ministryRoutes);
app.use("/roles", roleRoutes);
app.use("/scheduled-events", scheduledEventRoutes);
app.use("/scheduled-users", scheduledUserRoutes);
app.use("/schedule-user", qualifiedScheduledRolesRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
