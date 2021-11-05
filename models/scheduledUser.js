const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../expressError");

class ScheduledUser {
  static async create({ seId, etrrId, uId }) {
    const createdScheduledUser = await db.query(
      `insert into scheduled_users (se_id, etrr_id, u_id) 
       select 
         se.se_id, 
         etrr.etrr_id, 
         uqr.u_id 
       from 
         event_template_required_roles etrr 
       left join scheduled_events se 
       on se.et_id = etrr.et_id 
       left join user_qualified_roles uqr 
       on uqr.r_id = etrr.r_id 
       where 1=1
         and se.se_id = $1 
         and etrr.etrr_id = $2 
         and uqr.u_id = $3
       RETURNING su_id as "suId", se_id as "seId", etrr_id as "etrrId", u_id as "uId"`,
      [seId, etrrId, uId]
    );

    return createdScheduledUser.rows[0];
  }
  static async getAll() {
    const results = await db.query(
      `select 
        su.su_id as "suId",
        su.se_id as "seId",
        su.etrr_id as "etrrId",
        su.u_id as "uId",
        se.start_time as "startTime",
        se.end_time as "endTime",
        et.et_name as "etName",
        r.r_title as "rTitle",
        u.first || ' ' || u.last as "uName",
        u.username
       from 
        scheduled_users su
       left join scheduled_events se
       on su.se_id = se.se_id
       left join event_template_required_roles etrr
       on etrr.etrr_id = su.etrr_id
       left join event_templates et
       on etrr.et_id = et.et_id
       left join roles r
       on r.r_id = etrr.r_id
       left join users u
       on u.u_id = su.u_id
       `
    );
    return results.rows;
  }
}

module.exports = ScheduledUser;
