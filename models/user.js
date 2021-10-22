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

  static async getUserInfo({ username }) {
    const result = await db.query(
      `SELECT username, first, last, is_admin FROM users WHERE username = $1;`,
      [username]
    );
    return result.rows[0];
  }
  static async getAll() {
    const result = await db.query(
      `SELECT 
        u.username,
        u.first, 
        u.last, 
        u.is_admin,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'uId', u.u_id,
            'rId', r.r_id,
            'rTitle', r.r_title
          )
        ) as "qualifiedRoles"
      FROM 
        users u
      LEFT JOIN user_qualified_roles uqr
      ON uqr.u_id = u.u_id
      LEFT JOIN roles r
      ON r.r_id = uqr.r_id
      GROUP BY u.username, u.first, u.last, u.is_admin
      ORDER BY u.username`
    );
    return result.rows;
  }
}

module.exports = User;
