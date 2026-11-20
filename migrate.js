"use strict";

/** Runs database migrations against the same DB the app uses (config.js).
 *
 *   npm run migrate          apply all pending migrations
 *   npm run migrate:down     roll back the most recent migration
 *   node migrate.js reset    roll back everything, then re-apply (dev only)
 *
 * New migration:  npm run migrate:create -- add-some-column
 */
const path = require("path");
const { runner } = require("node-pg-migrate");
const { getDatabaseUri } = require("./config");

const connectionString = getDatabaseUri();
const needsSsl =
  process.env.NODE_ENV === "production" || /sslmode=require/.test(connectionString);

const base = {
  databaseUrl: {
    connectionString: connectionString.includes("://")
      ? connectionString
      : `postgresql:///${connectionString}`,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  },
  dir: path.join(__dirname, "migrations"),
  migrationsTable: "pgmigrations",
  log: (msg) => console.log(msg),
};

async function main(cmd = "up") {
  if (cmd === "reset") {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Refusing to reset a production database.");
    }
    await runner({ ...base, direction: "down", count: Infinity });
    await runner({ ...base, direction: "up" });
  } else if (cmd === "baseline") {
    // One-time, for databases created before migrations existed: record the
    // baseline as applied without running it (the tables are already there).
    await runner({ ...base, direction: "up", count: 1, fake: true });
  } else if (cmd === "down") {
    await runner({ ...base, direction: "down", count: 1 });
  } else {
    await runner({ ...base, direction: "up" });
  }
}

main(process.argv[2]).catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
