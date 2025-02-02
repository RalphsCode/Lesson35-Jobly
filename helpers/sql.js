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
function searchParams(searchName, minEmployees, maxEmployees){
  let { strName, strEmployees } = "";
  // If name is in the API body
  if (searchName !== undefined){
      strName = `name ILIKE '%${searchName.toLowerCase()}%'`;}

  // If there is minEmployees, but NOT maxEmployees
  if (minEmployees !== undefined && maxEmployees === undefined){
      strEmployees = `num_employees >= ${minEmployees}`;}

  // If there is min and maxEmployees
  else if (minEmployees !== undefined && maxEmployees !== undefined){
      if (minEmployees > maxEmployees){
          // respond with a 400 error with an appropriate message
          throw new BadRequestError("MinEmployees must be less than maxEmployees", 400);
      }  // END if...
      strEmployees = `num_employees BETWEEN ${minEmployees} AND ${maxEmployees}`
  }  // END else if...

  // If there is a maxEmployees, but NOT a min
  else if (maxEmployees !== undefined && minEmployees === undefined){
      strEmployees = `num_employees <= ${maxEmployees}`;
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
  return returnStr;
}  // END searchParams


/** Job Search paramaters to SQL WHERE string 
 * All 3 paramaters are optional
 * hasEquity to be passed in as true if its a required paramater
 * jest tests are in sql.test.js
 * 
 * returns a SQL WHERE clause to filter the db results
 * sample request: ?title=Air%20cabin&hasEquity=true
 * resulting output: 'WHERE title ILIKE '%Air cabin%' AND equity > 0'
*/
function jobSearch(title, minSalary, hasEquity){
   
    // Build the WHERE statement string
    const conditions = []; // holds the individual search paramaters

    if (title) {
      conditions.push(`title ILIKE '%${title.toLowerCase()}%'`);
    }
  
    if (minSalary) {
      conditions.push(`salary >= ${minSalary}`);
    }
  
    if (hasEquity) {
      conditions.push('equity > 0');
    }
  
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  
    console.log('whereClause:', whereClause);
    return whereClause;
  }  // END jobSearch

module.exports = { sqlForPartialUpdate, searchParams, jobSearch };
