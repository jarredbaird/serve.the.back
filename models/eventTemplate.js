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

    for (let role of selectedRoles) {
      await db.query(
        `INSERT INTO event_template_required_roles (r_id, et_id) values ($1, $2)`,
        [role.rId, createEvent.rows[0].etId]
      );
    }

    return createEvent.rows[0];
  }
}

module.exports = EventTemplate;
