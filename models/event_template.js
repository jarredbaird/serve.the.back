const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../expressError");

class EventTemplate {
  static async createEventTemplate({ etName, etDescr, mId }) {
    const duplicateCheck = await db.query(
      `SELECT et_name 
          FROM event_templates 
          WHERE lower(et_id) = $1`,
      [etName.toLowerCase()]
    );
    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate event template: ${etName}`);
    }

    const insertAttempt = await db.query(
      `INSERT INTO event_templates (et_name, et_descr, m_id)
        VALUES ($1, $2, $3)
        RETURNING et_id, et_name, et_descr, m_id`,
      [etName, etDescr, mId]
    );

    return insertAttempt.rows[0];
  }
}

export default EventTemplate;
