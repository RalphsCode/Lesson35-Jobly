"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./jobs.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "new",
    salary: 55000,
    equity: 0,
    company_handle: "c1",
  };

  test("works", async function () {
    let job = await Job.create(newJob);

    const result = await db.query(
          `SELECT title, salary, equity, company_handle
           FROM jobs
           WHERE title = 'new'`);

    expect(result.rows).toEqual([
      {
        title: "new",
        salary: 55000,
        equity: "0",
        company_handle: "c1",
      },
    ]);
  });

  test("bad request with dupe", async function () {
    try {
      await Job.create(newJob);
      await Job.create(newJob);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    const newJob = {
        title: "new",
        salary: 55000,
        equity: 0,
        company_handle: "c1",
      };
    let job = await Job.create(newJob);

    let jobs = await Job.findAll();
    expect(jobs).toEqual([
        {
            title: "new",
            salary: 55000,
            equity: "0",
            company_handle: "c1",
          },
    ]);
  });
});