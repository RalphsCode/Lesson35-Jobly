const { searchParams } = require("../helpers/sql");

console.log("Capitalization: SmIth, 100, 500")
searchParams("SmIth", 100, 500);

console.log("No min: SmIth, undefined, 50")
searchParams("SmIth", undefined, 50);

console.log("No name: undefined, 100, 500")
searchParams(undefined, 100, 500);

console.log("No name, no max: 100")
searchParams(undefined, 20, undefined);