DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_qualified_roles CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS event_template_required_roles CASCADE;
DROP TABLE IF EXISTS event_templates CASCADE;
DROP TABLE IF EXISTS scheduled_events CASCADE;
DROP TABLE IF EXISTS scheduled_users CASCADE;
DROP TABLE IF EXISTS privileges CASCADE;

CREATE TABLE "users" (
  "u_id" SERIAL PRIMARY KEY,
  "username" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "first" text,
  "last" text,
  "active" bool NOT NULL,
  "is_admin" bool NOT NULL
);

CREATE TABLE "user_qualified_roles" (
  "uqr_id" SERIAL PRIMARY KEY,
  "user_id" int,
  "role_id" int
);

CREATE TABLE "roles" (
  "r_id" SERIAL PRIMARY KEY,
  "title" text NOT NULL
);

CREATE TABLE "event_template_required_roles" (
  "etrr_id" SERIAL PRIMARY KEY,
  "role_id" int,
  "event_id" int
);

CREATE TABLE "event_templates" (
  "e_id" SERIAL PRIMARY KEY,
  "e_name" text NOT NULL,
  "e_descr" text
);

CREATE TABLE "scheduled_events" (
  "se_id" SERIAL PRIMARY KEY,
  "e_id" int,
  "location" text NOT NULL,
  "start_date" date NOT NULL,
  "start_time" timestamp,
  "end_date" date NOT NULL,
  "end_time" timestamp
);

CREATE TABLE "scheduled_users" (
  "su_id" SERIAL PRIMARY KEY,
  "scheduled_event" int,
  "u_id" int
);

ALTER TABLE "user_qualified_roles" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("u_id");

ALTER TABLE "user_qualified_roles" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("r_id");

ALTER TABLE "event_template_required_roles" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("r_id");

ALTER TABLE "event_template_required_roles" ADD FOREIGN KEY ("event_id") REFERENCES "event_templates" ("e_id");

ALTER TABLE "scheduled_events" ADD FOREIGN KEY ("e_id") REFERENCES "event_templates" ("e_id");

ALTER TABLE "scheduled_users" ADD FOREIGN KEY ("scheduled_event") REFERENCES "scheduled_events" ("se_id");

ALTER TABLE "scheduled_users" ADD FOREIGN KEY ("u_id") REFERENCES "users" ("u_id");
