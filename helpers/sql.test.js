/** Test the sqlForPartialUpdate function found in sql.js */

const { sqlForPartialUpdate } = require("../helpers/sql");
const { BadRequestError } = require("../expressError");

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
