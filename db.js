"use strict";
/** Database setup for serve.
 *
 * Uses a Pool (not a single Client) so dropped connections — common on
 * hosted Postgres like Neon/Render/Supabase — are replaced automatically.
 * Pool has the same .query() API, so models don't change.
 */
const { Pool } = require("pg");
const { getDatabaseUri } = require("./config");

const connectionString = getDatabaseUri();
const needsSsl =
  process.env.NODE_ENV === "production" || /sslmode=require/.test(connectionString);

const db = new Pool({
  connectionString,
  ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
});

module.exports = db;
