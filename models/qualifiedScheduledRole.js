const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../expressError");

class QualifiedScheduledRole {
  static async getAllQualifiedScheduledRoles({ uId }) {
    const results = await db.query(
      `select 
      et.et_name as "etName",
      se.se_id as "seId",
      se.start_time as "startTime",
      se.end_time "endTime",
      se.location,
      JSON_AGG(
        JSON_BUILD_OBJECT(
        'uIdScheduled', su.u_id,
        'uNameScheduled', su_info.first || ' ' || su_info.last,
        'rTitle', r.r_title,
        'etrrId', etrr.etrr_id
        )
      ) as "requiredRoles"
     from scheduled_events se
     left join event_template_required_roles etrr
     on se.et_id = etrr.et_id
     left join roles r
     on r.r_id = etrr.r_id
     left join event_templates et
     on se.et_id = et.et_id
     left join user_qualified_roles uqr
     on uqr.r_id = etrr.r_id
     left join users u
     on uqr.u_id = u.u_id
     left join scheduled_users su
     on se.se_id = su.se_id
     and su.etrr_id = etrr.etrr_id
     left join users su_info
     on su_info.u_id = su.u_id
     where 1=1
       and u.u_id = $1
       and se.end_time > NOW()
       
    group by
      et.et_name,
      se.se_id,
      se.start_time,
      se.end_time,
      se.location
     
     order by se.start_time`,
      [uId]
    );
    return results.rows;
  }
}

module.exports = QualifiedScheduledRole;
