const db = require("../db");
const bcrypt = require("bcrypt");
const { BadRequestError, UnauthorizedError } = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config");

class User {
  /** authenticate user with username, password.
   *
   * Returns:
   * { username, first, last, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate({ username, password }) {
    // try to find the user first
    const result = await db.query(
      `SELECT username,
              password,
              first,
              last,
              is_admin AS "isAdmin"
       FROM users
       WHERE username = $1`,
      [username]
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

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns:
   * { username, first, lastName, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({ username, password, first, last }) {
    const duplicateCheck = await db.query(
      `SELECT username
               FROM users
               WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
               (username,
                password,
                first,
                last)
               VALUES ($1, $2, $3, $4)
               RETURNING username, first, last, is_admin AS "isAdmin"`,
      [username, hashedPassword, first, last]
    );

    const user = result.rows[0];

    return user;
  }
}

module.exports = User;
