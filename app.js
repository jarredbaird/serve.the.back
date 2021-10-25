"use strict";

/** Express app for Serve. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./middleware/token");
const userRoutes = require("./routes/users");
const eventTemplateRoutes = require("./routes/eventTemplates");
const ministryRoutes = require("./routes/ministries");
const roleRoutes = require("./routes/roles");
const scheduledEventRoutes = require("./routes/scheduledEvents");

const morgan = require("morgan");

const app = express();

app.get("/", async function (req, res, next) {
  console.log("root route is working");
  return res.status(201).json({ name: "jarred" });
});
// yes

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/event-templates", eventTemplateRoutes);
app.use("/ministries", ministryRoutes);
app.use("/roles", roleRoutes);
app.use("/scheduled-events", scheduledEventRoutes);

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
