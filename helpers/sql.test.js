/** Testing the functions in sql.js */
process.env.NODE_ENV = "test"; 		//  create node test environment
const request = require("supertest");
const app = require("../app"); 

const { sqlForPartialUpdate, searchParams, jobSearch } = require("../helpers/sql");
const { BadRequestError } = require("../expressError");

/** Testing the sqlForPartialUpdate function */

describe("Test sqlForPartialUpdate", function(){
    test("Test JS name changes to SQL Table Name", function(){
        const testData = {firstName: 'Stephanie'};
        const result = sqlForPartialUpdate(testData, { firstName: 'first_name' });
        expect(result).toEqual({"setCols": "\"first_name\"=$1", "values": ["Stephanie"]});
    })
    test("Test that the output is correct", function(){
        const testData = {firstName: 'Aliya', age: 32};
        const result = sqlForPartialUpdate(testData, { firstName: 'first_name' });
        expect(result).toEqual({"setCols": "\"first_name\"=$1, \"age\"=$2", "values": ["Aliya", 32]});
    })
    test("Test No Data Supplied", function(){
        expect(() => sqlForPartialUpdate({}, {})).toThrow(BadRequestError);;
    })

})

/** Testing the companies searchParams function */

describe("Test searchParams function", function(){

    test("Test No Parameters Supplied status = 200", async function(){
        const result = searchParams();
        expect(result).toBe('No Paramaters Found');
    });

    test("Only name paramater passed in", async function(){
        const result = searchParams('Net', undefined, undefined);
        expect(result).toBe("WHERE name ILIKE '%net%'");
    });
    
    test("Test minEployees > maxEmployees to throw error", function(){
        expect(() => searchParams("net",200,100)).toThrow(BadRequestError);
    });

    test("Only minEmployees paramater passed in", async function(){
        const result = searchParams(undefined, 800, undefined);
        expect(result).toBe("WHERE num_employees >= 800");
    });

    test("name & maxEmployees paramaters passed in", async function(){
        const result = await searchParams(undefined, undefined, 200);
        expect(result).toBe("WHERE num_employees <= 200");
    });

    // test("maxEmployees out of range paramaters passed in", async function(){
    //     const result = searchParams(undefined, undefined, -200);
    //     expect(result).toBe("WHERE num_employees <= 200");
    // });
});  // END describe

describe("Test searchParams function", function(){
    test("Gets a list of all companies", async function() { 
        const results = await request(app).get(`/companies/`); 
        expect(results.statusCode).toBe(200); 
        expect(results.body).not.toBeNull();
        // expect(results.body).toBeInstanceOf(Array);
        // expect(results.companies.length).toBeGreaterThan(0);
        expect(results.body.companies[0]).toEqual({"description": "Desc1", "handle": "c1", "logoUrl": "http://c1.img", "name": "C1", "numEmployees": 1});
    }); 

    test("Test nameLike filter; Gets c1 company", async function() { 
        const results = await request(app).get(`/companies/?nameLike=c1`); 
        expect(results.statusCode).toBe(200); 
        expect(results.body.companies).toEqual([{"description": "Desc1", "handle": "c1", "logoUrl": "http://c1.img", "name": "C1", "numEmployees": 1}]);
    }); 

    test("Test minEmployees filter; Gets c3 company", async function() { 
        const results = await request(app).get(`/companies/?minEmployees=3`); 
        expect(results.statusCode).toBe(200); 
        expect(results.body.companies).toBeInstanceOf(Array);
        expect(results.body.companies).toEqual([{"description": "Desc3", "handle": "c3", "logoUrl": "http://c3.img", "name": "C3", "numEmployees": 3}]);
    }); 

    test("Test minEmployees < maxEmployees filter; Gets c3 company", async function() { 
        const results = await request(app).get(`/companies/?minEmployees=3&maxEmployees=2`); 
        expect(results.status).toBe(400);
        expect(results.body.error).toEqual({"message": "MinEmployees must be less than maxEmployees", "status": 400});
    }); 
    
});  // END describe


/** Testing the jobs jobSearch function */

describe("Test jobSearch function", function(){

    test("Test No Parameters Supplied status = 200", async function(){
        const result = jobSearch();
        expect(result).toBe("");
    });

    test("Only title paramater passed in", async function(){
        const result = jobSearch('vert', undefined, undefined);
        expect(result).toBe("WHERE title ILIKE '%vert%'");
    });
    
});
