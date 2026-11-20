# API permission matrix

Who may call each endpoint. This is the spec that the permission tasks implement and that the automated tests check.

**Access levels**

| Level | Meaning |
|---|---|
| Public | No token needed |
| Signed in | Any valid JWT (volunteer or admin) |
| Self or admin | A volunteer may act only on their **own** user (id taken from the JWT, never trusted from the request); admins may act on anyone |
| Admin | JWT with `isAdmin: true` |

Status: ✅ already enforced · ❌ **gap**, not enforced today (anyone, even signed out, can call it) · ⚠️ partially enforced

## Matrix

| Method | Path | Purpose | Required | Today | Fixed by |
|---|---|---|---|---|---|
| GET | `/health` | Uptime / DB check | Public | ✅ Public | (none) |
| POST | `/auth/get-token` | Sign in | Public | ✅ Public | (none) |
| POST | `/users` | Sign up (body `isAdmin: true` allowed only for admins) | Public | ✅ Public, admin flag checked | (none) |
| GET | `/users` | List every user with email and qualifications | Admin | ❌ Public | CU-86bd4ax13 |
| GET | `/users/:username` | One user's profile and qualifications | Self or admin | ❌ Public | CU-86bd4ax13 |
| POST | `/users/qualify/:uId` | Qualify a user for roles | Admin | ❌ Public | CU-86bd4ax13 |
| GET | `/ministries` | List ministries | Admin | ✅ Admin | (none) |
| POST | `/ministries` | Create a ministry | Admin | ✅ Admin | (none) |
| GET | `/roles` | List roles | Signed in | ❌ Public | CU-86bd4ax13 |
| GET | `/event-templates` | List templates and their required roles | Signed in | ✅ Signed in | (none) |
| POST | `/event-templates` | Create a template | Admin | ✅ Admin | (none) |
| GET | `/scheduled-events` | List scheduled events | Signed in | ❌ Public | CU-86bd4ax13 |
| GET | `/scheduled-events/roles` | Events with each role slot and who fills it | Signed in | ❌ Public | CU-86bd4ax13 |
| POST | `/scheduled-events` | Put an event on the calendar | Admin | ❌ Public | CU-86bd4ax13 |
| GET | `/scheduled-users` | Every assignment, all users | Admin | ❌ Public | CU-86bd4ax13 |
| GET | `/scheduled-users/:uId` | One user's assignments | Self or admin | ❌ Public | CU-86bd4ax19 |
| POST | `/scheduled-users` | Sign a user up for a slot | Self or admin | ❌ Public (any `uId` in the body) | CU-86bd4ax19 |
| DELETE | `/scheduled-users` | Remove a user from a slot | Self or admin | ❌ Public (any `uId` in the body) | CU-86bd4ax19 |
| GET | `/schedule-user/:uId` | Open slots a user is qualified for | Self or admin | ✅ Self or admin (looks up the id by username) | CU-86bd4ax1e (read `uId` from the token instead) |

**Summary:** 19 endpoints. 7 are correct today, 1 is correct but inefficient, and **11 are open to anyone**, including creating events and reading every user's email address.

## Other findings

- `routes/roles.js`, `routes/scheduledEvents.js`, `routes/scheduledUsers.js` and `routes/users.js` import `ensureCorrectUserOrAdmin` and `ensureAdmin`, which **don't exist** in `middleware/auth.js`. Using them would pass `undefined` to Express and crash at startup, so they were never applied. CU-86bd4ax13 replaces them with the real `ensureIsAdmin` / `ensureLoggedIn`.
- JWTs never expire and carry only `username` and `isAdmin`. CU-86bd4ax1e adds an expiry and `uId`.
- `POST /scheduled-users` checks that the user is *qualified* for the role (SQL join) but not that the caller *is* that user.

## Frontend impact

Once enforced, a volunteer's data load (`DataContext`) gets 401s for `/users` and `/ministries`. The frontend already treats those as empty lists, and volunteer pages don't use them. Admin pages are unaffected.
