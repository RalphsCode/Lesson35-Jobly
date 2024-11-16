const { BadRequestError } = require("../expressError");

function searchParams(name, minEmployees, maxEmployees){
    let { strName, strEmployees } = "";
    // If name is in the paramaters
    if (name !== undefined){
        strName = `name LIKE %${name.toLowerCase()}%`;}

    // If there is minEmployees, but NOT maxEmployees
    if (minEmployees !== undefined && maxEmployees === undefined){
        strEmployees = `numEmployees > ${minEmployees}`;}

    // If there is min and maxEmployees
    else if (minEmployees !== undefined && maxEmployees !== undefined){
        if (minEmployees > maxEmployees){
            // respond with a 400 error with an appropriate message
            throw new BadRequestError("MinEmployees must be less than maxEmployees", 400);
        }  // END if...
        strEmployees = `numEmployees BETWEEN ${minEmployees} AND ${maxEmployees}`
    }  // END else if...

    // If there is a maxEmployees, but NOT a min
    else if (maxEmployees !== undefined && minEmployees === undefined){
        strEmployees = `numEmployees < ${maxEmployees}`;
    }  // END else if...

    // Build the WHERE statement string

        // if there is a name argument
        if (strName !== undefined) {
            // if there is a max or minEmployees
            if (strEmployees !== undefined) {
                returnStr = `WHERE ${strName} AND ${strEmployees}`;
            }
            // if there is no min nor maxEmployees paramater
            else {
            returnStr = `WHERE ${strName}`;
            } }
        
        else if (strEmployees !== undefined) {
            returnStr = `WHERE ${strEmployees}`;
        } else {
            returnStr = "No Paramaters Found";
        }

    console.log(
        `
        returnStr: ${returnStr}
        `
    )
}  // END searchParams

module.exports = { searchParams };