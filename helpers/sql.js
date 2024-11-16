const { BadRequestError } = require("../expressError");

/** Format passed in data to make a SQL statement. 
 * It can be used in either companies update or user update.
 * 
 * Pass in the updated data and optionally the db specific field name to update.
 * 
 * If no field name is passed in, it will use the name in the data string.
 *
 * It uses the keys (db column name) and values (updated data) in the passed in data, to do updates.
 * 
 * Returns an object containing:
 * (1) setCols (a str of the columns and a $ reference)
 * (2) values (array of data in same order as the columns)
 */ 

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}  // END sqlForPartialUpdate


/** Create a WHERE clause for filters used in the get companies route.
 * Filters can include: 
 * (1) Company name - partial search ok.
 * (2) minEmployees - Companies with a passed in minimum number of employees
 * (3) maxEmployees - Companies with a passed in maximum number of employees
 */
function searchParams(name, minEmployees, maxEmployees){
  let { strName, strEmployees } = "";
  // If name is in the paramaters
  if (name !== undefined){
      strName = `name LIKE '%${name.toLowerCase()}%'`;}

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
  return returnStr;
}  // END searchParams

module.exports = { sqlForPartialUpdate, searchParams };
