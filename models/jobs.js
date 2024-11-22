"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate, searchParams } = require("../helpers/sql");

/** Related functions for jobs. */

class Job {
  /** Create a job (from data), update db, return new job data.
   *
   * data should be { title, salary, equity, company_handle }
   *
   * Returns { title, salary, equity, company_handle }
   *
   * Throws BadRequestError if job already in database.
   * */

  static async create({ title, salary, equity, company_handle }) {
    const duplicateCheck = await db.query(
          `SELECT title
           FROM jobs
           WHERE title = $1`,
        [title]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate job listing: ${title}`);

    const result = await db.query(
          `INSERT INTO jobs
           (title, salary, equity, company_handle)
           VALUES ($1, $2, $3, $4)
           RETURNING title, salary, equity, company_handle`,
        [
            title, 
            salary, 
            equity, 
            company_handle
        ],
    );
    const job = result.rows[0];

    return job;
  }

  /** Find all jobs.
   *
   * Returns [{ title, salary, equity, company_handle }, ...]
   * */

  static async findAll() {
    const jobsRes = await db.query(
          `SELECT 
            title, 
            salary, 
            equity, 
            company_handle
           FROM jobs
           ORDER BY title`);
    return jobsRes.rows;
  }

  /** Given a job title, return data about that job.
   *
   * Returns { handle, name, description, numEmployees, logoUrl, jobs }
   *   where jobs is [{ id, title, salary, equity, companyHandle }, ...]
   *
   * Throws NotFoundError if not found.
   **/

//   static async get(handle) {
//     const companyRes = await db.query(
//           `SELECT handle,
//                   name,
//                   description,
//                   num_employees AS "numEmployees",
//                   logo_url AS "logoUrl"
//            FROM companies
//            WHERE handle = $1`,
//         [handle]);

//     const company = companyRes.rows[0];

//     if (!company) throw new NotFoundError(`No company: ${handle}`);

//     return company;
//   }

  /** Update company data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {name, description, numEmployees, logoUrl}
   *
   * Returns {handle, name, description, numEmployees, logoUrl}
   *
   * Throws NotFoundError if not found.
   */

//   static async update(handle, data) {
//     const { setCols, values } = sqlForPartialUpdate(
//         data,
//         {
//           numEmployees: "num_employees",
//           logoUrl: "logo_url",
//         });
//     const handleVarIdx = "$" + (values.length + 1);

//     const querySql = `UPDATE companies 
//                       SET ${setCols} 
//                       WHERE handle = ${handleVarIdx} 
//                       RETURNING handle, 
//                                 name, 
//                                 description, 
//                                 num_employees AS "numEmployees", 
//                                 logo_url AS "logoUrl"`;
//     const result = await db.query(querySql, [...values, handle]);
//     const company = result.rows[0];

//     if (!company) throw new NotFoundError(`No company: ${handle}`);

//     return company;
//   }

  /** Delete given company from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

//   static async remove(handle) {
//     const result = await db.query(
//           `DELETE
//            FROM companies
//            WHERE handle = $1
//            RETURNING handle`,
//         [handle]);
//     const company = result.rows[0];

//     if (!company) throw new NotFoundError(`No company: ${handle}`);
//   }

}

module.exports = Job;
