const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../expressError");
const camelCaseKeys = require("../helpers/camelCase");

class Role {
  static async getAll() {
    const results = await db.query(`SELECT r_id, r_title, m_id FROM roles`);
    const roles = results.rows.map((role) => {
      return camelCaseKeys(role);
    });
    return roles;
  }
}

module.exports = Role;
