const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../expressError");

class ScheduledEvent {
  static async create({ etId, location, startTime, endTime }) {
    const createdScheduledEvent = await db.query(
      `INSERT INTO scheduled_events (et_id, location, start_time, end_time)
        VALUES ($1, $2, $3, $4)
        RETURNING se_id as "seId", et_id as "etId", start_time as "startTime", end_time as "endTime"`,
      [etId, location, startTime, endTime]
    );

    return createdScheduledEvent.rows[0];
  }
  static async getAll() {
    const results = await db.query(
      `select 
        se.se_id as "seId",
        se.location,
        se.start_time as "startTime",
        se.end_time as "endTime"
       from 
        scheduled_events se 
       left join event_templates et
       on et.et_id = se.et_id
       `
    );
    return results.rows;
  }

  static async getAllRequiredRoles() {
    const results = await db.query(
      `select 
      se.se_id as "seId",
      se.location,
      se.start_time as "startTime",
      se.end_time as "endTime",
      et.et_id as "etId",
      et.et_name as "etName",
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'rId', r.r_id,
          'mId', r.m_id,
          'uId', su.u_id,
          'mName', m.m_name,
          'rTitle', r.r_title,
          'uName', u.first || ' ' || u.last,
          'username', u.username
        )
        order by m.m_name
      ) AS "requiredRoles"
     from 
      scheduled_events se 
     left join event_templates et
     on et.et_id = se.et_id
     left join event_template_required_roles etrr
     on se.et_id = etrr.et_id
     left join roles r
     on etrr.r_id = r.r_id
     left join ministries m
     on r.m_id = m.m_id
     left join scheduled_users su
     on su.etrr_id = etrr.etrr_id
     and su.se_id = se.se_id
     left join users u
     on u.u_id = su.u_id
     
     group by 
       se.se_id, 
       se.location, 
       se.start_time, 
       se.end_time, 
       et.et_id, 
       et.et_name

     order by se.start_time
       `
    );
    return results.rows;
  }
}

module.exports = ScheduledEvent;
