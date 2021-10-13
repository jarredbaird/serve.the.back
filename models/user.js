const db = require("../db");
const bcrypt = require("bcrypt");
const { BadRequestError, UnauthorizedError } = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config");

class User {
  /** authenticate user with email, password.
   *
   * Returns { email, first_name, last_name, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(email, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT email AS "email",
              password AS "password",
              first_name AS "firstName",
              last_name AS "lastName",
              is_admin AS "isAdmin"
       FROM users
       WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid email/password");
  }

  /** Register user with data.
   *
   * Returns { email, firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({ email, password, firstName, lastName, email }) {
    const duplicateCheck = await db.query(
      `SELECT email
               FROM users
               WHERE email = $1`,
      [email]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate email: ${email}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
               (email,
                password,
                first_name,
                last_name)
               VALUES ($1, $2, $3, $4)
               RETURNING email, first_name AS "firstName", last_name AS "lastName"`,
      [email, hashedPassword, firstName, lastName]
    );

    const user = result.rows[0];

    return user;
  }
}

module.exports = User;
