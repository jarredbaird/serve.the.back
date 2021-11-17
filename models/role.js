const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../expressError");
const camelCaseKeys = require("../helpers/camelCase");

class Role {
  static async getAll() {
    const results = await db.query(`
    SELECT 
      r.r_id, 
      r.r_title, 
      r.m_id, 
      m.m_name 
      FROM 
        roles r
      LEFT JOIN ministries m
      on m.m_id = r.m_id
      ORDER BY m.m_id`);
    const roles = results.rows.map((role) => {
      return camelCaseKeys(role);
    });
    return roles;
  }

  static async create({ rId, mId }) {
    //// left off HERE
    return { rId, mId };
  }
}

module.exports = Role;
