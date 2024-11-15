const { BadRequestError } = require("../expressError");

/** This function is used to format passed in data to make a SQL statement. It can be used in either companies update or user update.
 * 
 * Pass in the updated data and optionally the db field name to update.
 * 
 * If no field name is passed in, it will use the name in the data string.
 *
 * It uses the keys (db column name) and values (updated data) in the passed in data to do updates.
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
}

module.exports = { sqlForPartialUpdate };
