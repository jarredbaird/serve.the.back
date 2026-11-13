"use strict";

/** Seed the database with realistic church-volunteer data.
 *
 *   npm run db:reset   → recreate tables from serve.db.sql, then run this
 *   npm run seed       → just run this (wipes existing rows first)
 *
 * Every seeded user's password is "password" (or $SEED_PASSWORD if set).
 * Admin login: admin@serve.test / password
 */

const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const db = require("./db");

// Override for a public deployment:  SEED_PASSWORD=something-long npm run db:reset
const PASSWORD = process.env.SEED_PASSWORD || "password";

const ministries = {
  Worship: ["Vocals", "Acoustic Guitar", "Electric Guitar", "Bass", "Drums", "Keys"],
  Production: ["Sound", "Lyrics/Slides", "Lighting", "Livestream Camera"],
  Kids: ["Nursery Lead", "Nursery Helper", "Elementary Teacher", "Check-in"],
  "Guest Services": ["Greeter", "Usher", "Parking", "Coffee Bar"],
  Students: ["Small Group Leader", "Event Setup"],
};

const people = [
  // [first, last, isAdmin, roles they're qualified for]
  ["Admin", "User", true, ["Sound", "Greeter"]],
  ["Sarah", "Mitchell", false, ["Vocals", "Keys"]],
  ["David", "Okafor", false, ["Drums", "Sound"]],
  ["Emily", "Chen", false, ["Vocals", "Acoustic Guitar"]],
  ["Marcus", "Reed", false, ["Bass", "Electric Guitar"]],
  ["Grace", "Alvarez", false, ["Nursery Lead", "Check-in"]],
  ["Hannah", "Brooks", false, ["Nursery Helper", "Elementary Teacher"]],
  ["Josh", "Patel", false, ["Lyrics/Slides", "Livestream Camera"]],
  ["Rachel", "Kim", false, ["Lighting", "Lyrics/Slides"]],
  ["Tom", "Wallace", false, ["Usher", "Parking"]],
  ["Linda", "Foster", false, ["Greeter", "Coffee Bar"]],
  ["Chris", "Nguyen", false, ["Small Group Leader", "Event Setup"]],
  ["Megan", "Scott", false, ["Elementary Teacher", "Small Group Leader"]],
  ["Ben", "Harris", false, ["Parking", "Event Setup", "Usher"]],
  ["Olivia", "Grant", false, ["Vocals", "Coffee Bar"]],
  ["Nate", "Dubois", false, ["Electric Guitar", "Acoustic Guitar", "Sound"]],
];

const templates = [
  {
    name: "Sunday Morning Service",
    descr: "Main 10:30am worship gathering.",
    ministry: "Worship",
    roles: [
      "Vocals", "Acoustic Guitar", "Bass", "Drums", "Keys",
      "Sound", "Lyrics/Slides", "Livestream Camera",
      "Greeter", "Usher", "Parking", "Coffee Bar",
      "Nursery Lead", "Nursery Helper", "Elementary Teacher", "Check-in",
    ],
  },
  {
    name: "Wednesday Night Students",
    descr: "Midweek youth gathering, 6:30–8pm.",
    ministry: "Students",
    roles: ["Small Group Leader", "Event Setup", "Sound", "Vocals"],
  },
  {
    name: "Worship Night",
    descr: "Monthly evening of extended worship.",
    ministry: "Worship",
    roles: ["Vocals", "Electric Guitar", "Bass", "Drums", "Keys", "Sound", "Lighting", "Lyrics/Slides"],
  },
];

/** Returns a Date `weeksFromNow` weeks out on the given weekday at hh:mm local. */
function nextDate(weekday, hh, mm, weeksFromNow) {
  const d = new Date();
  d.setHours(hh, mm, 0, 0);
  d.setDate(d.getDate() + ((weekday - d.getDay() + 7) % 7) + 7 * weeksFromNow);
  return d;
}
const plusMinutes = (d, m) => new Date(d.getTime() + m * 60000);

async function seed() {
  const schema = fs.readFileSync(path.join(__dirname, "serve.db.sql"), "utf8");
  if (process.argv.includes("--reset")) await db.query(schema);
  await db.query(
    `TRUNCATE scheduled_users, scheduled_events, event_template_required_roles,
              event_templates, user_qualified_roles, roles, users, ministries
     RESTART IDENTITY CASCADE`
  );

  const ministryIds = {};
  const roleIds = {};
  for (const [mName, roles] of Object.entries(ministries)) {
    const m = await db.query(`INSERT INTO ministries (m_name) VALUES ($1) RETURNING m_id`, [mName]);
    ministryIds[mName] = m.rows[0].m_id;
    for (const title of roles) {
      const r = await db.query(
        `INSERT INTO roles (r_title, m_id) VALUES ($1, $2) RETURNING r_id`,
        [title, m.rows[0].m_id]
      );
      roleIds[title] = r.rows[0].r_id;
    }
  }

  const hash = await bcrypt.hash(PASSWORD, 10);
  const userIds = {};
  for (const [first, last, isAdmin, quals] of people) {
    const username = isAdmin ? "admin@serve.test" : `${first}.${last}@serve.test`.toLowerCase();
    const u = await db.query(
      `INSERT INTO users (username, password, first, last, is_admin)
       VALUES ($1, $2, $3, $4, $5) RETURNING u_id`,
      [username, hash, first, last, isAdmin]
    );
    userIds[username] = u.rows[0].u_id;
    for (const role of quals) {
      await db.query(`INSERT INTO user_qualified_roles (u_id, r_id) VALUES ($1, $2)`, [
        u.rows[0].u_id,
        roleIds[role],
      ]);
    }
  }

  const templateIds = {};
  for (const t of templates) {
    const et = await db.query(
      `INSERT INTO event_templates (et_name, et_descr, m_id) VALUES ($1, $2, $3) RETURNING et_id`,
      [t.name, t.descr, ministryIds[t.ministry]]
    );
    templateIds[t.name] = et.rows[0].et_id;
    for (const role of t.roles) {
      await db.query(`INSERT INTO event_template_required_roles (r_id, et_id) VALUES ($1, $2)`, [
        roleIds[role],
        et.rows[0].et_id,
      ]);
    }
  }

  // Schedule: last week + next 5 weeks of Sundays and Wednesdays, plus a worship night.
  const events = [];
  for (let w = -1; w <= 5; w++) {
    const sun = nextDate(0, 10, 30, w);
    events.push(["Sunday Morning Service", "Main Auditorium", sun, plusMinutes(sun, 90)]);
    const wed = nextDate(3, 18, 30, w);
    events.push(["Wednesday Night Students", "Student Center", wed, plusMinutes(wed, 90)]);
  }
  const wn = nextDate(5, 19, 0, 2);
  events.push(["Worship Night", "Main Auditorium", wn, plusMinutes(wn, 120)]);

  // Fill roughly half of the slots with qualified volunteers so there's
  // a mix of filled and open positions to look at.
  let filled = 0;
  for (const [tName, location, start, end] of events) {
    const se = await db.query(
      `INSERT INTO scheduled_events (et_id, location, start_time, end_time)
       VALUES ($1, $2, $3, $4) RETURNING se_id`,
      [templateIds[tName], location, start, end]
    );
    const seId = se.rows[0].se_id;
    const slots = await db.query(
      `SELECT etrr_id, r_id FROM event_template_required_roles WHERE et_id = $1 ORDER BY etrr_id`,
      [templateIds[tName]]
    );
    const used = new Set();
    slots.rows.forEach((slot, i) => {
      slot.skip = (i + seId) % 2 === 0;
    });
    for (const slot of slots.rows) {
      if (slot.skip) continue;
      const q = await db.query(
        `SELECT u_id FROM user_qualified_roles WHERE r_id = $1 ORDER BY random()`,
        [slot.r_id]
      );
      const pick = q.rows.find((r) => !used.has(r.u_id));
      if (!pick) continue;
      used.add(pick.u_id);
      await db.query(
        `INSERT INTO scheduled_users (se_id, u_id, etrr_id) VALUES ($1, $2, $3)`,
        [seId, pick.u_id, slot.etrr_id]
      );
      filled++;
    }
  }

  console.log(
    `Seeded ${Object.keys(ministryIds).length} ministries, ${Object.keys(roleIds).length} roles, ` +
      `${people.length} users, ${templates.length} templates, ${events.length} events, ${filled} filled slots.`
  );
  console.log(`Log in as admin@serve.test / ${PASSWORD} (or any <first>.<last>@serve.test).`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.end());
