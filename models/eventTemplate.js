const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../expressError");

class EventTemplate {
  static async create({ etName, etDescr, selectedRoles }) {
    const duplicateCheck = await db.query(
      `SELECT et_name 
          FROM event_templates 
          WHERE lower(et_name) = $1`,
      [etName.toLowerCase()]
    );
    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate event template: ${etName}`);
    }

    const createEvent = await db.query(
      `INSERT INTO event_templates (et_name, et_descr)
        VALUES ($1, $2)
        RETURNING et_id as "etId", et_name as etName, et_descr as etDescr`,
      [etName, etDescr]
    );

    const eventTemplateToReturn = { ...createEvent.rows[0], requiredRoles: [] };

    for (let role of selectedRoles) {
      await db.query(
        `INSERT INTO event_template_required_roles (r_id, et_id) 
          values ($1, $2)`,
        [role.rId, createEvent.rows[0].etId]
      );
      eventTemplateToReturn.requiredRoles.push({
        rId: role.rId,
        rTitle: role.rTitle,
        mId: role.mId,
      });
    }

    return eventTemplateToReturn;
  }
  static async getAll() {
    const results = await db.query(
      `select 
        et.et_id as "etId", 
        et.et_name as "etName", 
        et.et_descr as "etDescr", 
        json_agg(
          json_build_object(
            'rId', r.r_id, 
            'rTitle', r.r_title, 
            'mId', r.m_id)) as "requiredRoles" 
       from 
        event_templates et 
       left join event_template_required_roles etrr
        on et.et_id = etrr.et_id 
      left join roles r 
        on etrr.r_id = r.r_id 
      group by et.et_id, et.et_name, et.et_descr
      order by et.et_name`
    );
    return results.rows;
  }
}

module.exports = EventTemplate;
