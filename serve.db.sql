CREATE TABLE "users" (
  "u_id" int PRIMARY KEY NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "first" text,
  "last" text,
  "active" bool NOT NULL,
  "privilege" text
);

CREATE TABLE "user_roles" (
  "ur_id" int PRIMARY KEY NOT NULL,
  "user_id" int,
  "role_id" int
);

CREATE TABLE "roles" (
  "r_id" int PRIMARY KEY NOT NULL,
  "title" text NOT NULL
);

CREATE TABLE "event_roles" (
  "er_id" int PRIMARY KEY NOT NULL,
  "role_id" int,
  "event_id" int
);

CREATE TABLE "events" (
  "e_id" int PRIMARY KEY NOT NULL,
  "e_name" text NOT NULL,
  "r_id" int[],
  "e_descr" text
);

CREATE TABLE "scheduled_events" (
  "se_id" int PRIMARY KEY NOT NULL,
  "e_id" int,
  "location" text NOT NULL,
  "start_date" date NOT NULL,
  "start_time" timestamp,
  "end_date" date NOT NULL,
  "end_time" timestamp
);

CREATE TABLE "privileges" (
  "name" text PRIMARY KEY NOT NULL
);

ALTER TABLE "users" ADD FOREIGN KEY ("privilege") REFERENCES "privileges" ("name");

ALTER TABLE "user_roles" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("u_id");

ALTER TABLE "user_roles" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("r_id");

ALTER TABLE "event_roles" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("r_id");

ALTER TABLE "event_roles" ADD FOREIGN KEY ("event_id") REFERENCES "events" ("e_id");

ALTER TABLE "events" ADD FOREIGN KEY ("r_id") REFERENCES "roles" ("r_id");

ALTER TABLE "scheduled_events" ADD FOREIGN KEY ("e_id") REFERENCES "events" ("e_id");
