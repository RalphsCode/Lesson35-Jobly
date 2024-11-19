/** Testing the functions in sql.js */

const { sqlForPartialUpdate, searchParams } = require("../helpers/sql");
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

/** Testing the searchParams function */

/** Test:
 * range params
 * min < max
 * capitalization
 * different argument combinations
 * no arguments
 */

describe("Test searchParams function", function(){
    // test("Test minEployees > maxEmployees", function(){
    //     const testData = {minEmployees: 250};
    //     const result = searchParams(testData, { firstName: 'first_name' });
    //     expect(result).toEqual({"setCols": "\"first_name\"=$1", "values": ["Stephanie"]});
    // })
    // test("Test that the output is correct", function(){
    //     const testData = {firstName: 'Aliya', age: 32};
    //     const result = sqlForPartialUpdate(testData, { firstName: 'first_name' });
    //     expect(result).toEqual({"setCols": "\"first_name\"=$1, \"age\"=$2", "values": ["Aliya", 32]});
    // })
    test("Test No Data Supplied", function(){
        expect(() => searchParams("net",200,100)).toThrow(BadRequestError);;
    })

})
