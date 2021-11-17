const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../expressError");
const camelCaseKeys = require("../helpers/camelCase");

class Ministry {
  static async getAll() {
    const results = await db.query(
      `SELECT m_id, m_name FROM ministries order by m_id`
    );
    const ministries = results.rows.map((ministry) => {
      return camelCaseKeys(ministry);
    });
    return ministries;
  }

  static async create({ mName }) {
    const results = await db.query(
      `
      INSERT INTO ministries (m_name) 
      VALUES ($1)
      RETURNING m_id AS "mId", m_name AS "mName"`,
      [mName]
    );
    return results.rows[0];
  }
}

module.exports = Ministry;
