const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../expressError");

class ScheduledUser {
  static async create({ seId, etrrId, uId }) {
    const createdScheduledUser = await db.query(
      `INSERT INTO scheduled_users (se_id, etrr_id, u_id)
        VALUES ($1, $2, $3)
        RETURNING su_id as "suId", etrr_id as "etrrId", u_id as "uId"`,
      [seId, etrrId, uId]
    );

    return createdScheduledUser.rows[0];
  }
  static async getAll() {
    const results = await db.query(
      `select 
        su.su_id as "suId",
        su.se_id as "seId",
        su.etrr_id as "etrrId,
        su.u_id as "uId"
       from 
        scheduled_users su
       `
    );
    return results.rows;
  }
}

module.exports = ScheduledUser;
