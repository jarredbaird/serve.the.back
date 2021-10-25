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
       `
    );
    return results.rows;
  }
}

module.exports = ScheduledEvent;
