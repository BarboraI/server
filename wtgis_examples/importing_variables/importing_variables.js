var path = require("path");
var myVariables = require(path.join(__dirname, "/variables.js"));
// now we have access to stuff exported from variables.js
console.log(myVariables);
myVariables.someFunction(3)
