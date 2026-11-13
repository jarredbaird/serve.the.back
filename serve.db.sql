-- Schema for serve. — matches the column names used in models/*.js
-- Rebuilt from the last known-good pg_dump (git commit 911642d^:seed.sql).
-- Run with:  npm run db:reset   (this DROPS and recreates all tables, then seeds)

DROP TABLE IF EXISTS scheduled_users CASCADE;
DROP TABLE IF EXISTS scheduled_events CASCADE;
DROP TABLE IF EXISTS event_template_required_roles CASCADE;
DROP TABLE IF EXISTS event_templates CASCADE;
DROP TABLE IF EXISTS user_qualified_roles CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS ministries CASCADE;

CREATE TABLE ministries (
  m_id   SERIAL PRIMARY KEY,
  m_name TEXT NOT NULL
);

CREATE TABLE users (
  u_id     SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first    TEXT,
  last     TEXT,
  active   BOOLEAN NOT NULL DEFAULT true,
  is_admin BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE roles (
  r_id    SERIAL PRIMARY KEY,
  r_title TEXT NOT NULL,
  m_id    INTEGER REFERENCES ministries (m_id)
);

CREATE TABLE user_qualified_roles (
  uqr_id SERIAL PRIMARY KEY,
  u_id   INTEGER REFERENCES users (u_id) ON DELETE CASCADE,
  r_id   INTEGER REFERENCES roles (r_id) ON DELETE CASCADE,
  UNIQUE (r_id, u_id)
);

CREATE TABLE event_templates (
  et_id    SERIAL PRIMARY KEY,
  et_name  TEXT NOT NULL,
  et_descr TEXT,
  m_id     INTEGER REFERENCES ministries (m_id)
);

CREATE TABLE event_template_required_roles (
  etrr_id SERIAL PRIMARY KEY,
  r_id    INTEGER REFERENCES roles (r_id) ON UPDATE CASCADE ON DELETE CASCADE,
  et_id   INTEGER REFERENCES event_templates (et_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE scheduled_events (
  se_id      SERIAL PRIMARY KEY,
  et_id      INTEGER REFERENCES event_templates (et_id) ON DELETE CASCADE,
  location   TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time   TIMESTAMPTZ NOT NULL
);

CREATE TABLE scheduled_users (
  su_id   SERIAL PRIMARY KEY,
  se_id   INTEGER REFERENCES scheduled_events (se_id) ON DELETE CASCADE,
  u_id    INTEGER REFERENCES users (u_id) ON DELETE CASCADE,
  etrr_id INTEGER REFERENCES event_template_required_roles (etrr_id) ON DELETE CASCADE,
  UNIQUE (etrr_id, se_id),  -- one person per role slot
  UNIQUE (se_id, u_id)      -- one role per person per event
);
