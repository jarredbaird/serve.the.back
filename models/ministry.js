const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../expressError");

class Ministry {
  static async getAll() {
    const results = await db.query(`SELECT m_id, m_name FROM ministries`);
    return results.rows;
  }
}

module.exports = Ministry;
