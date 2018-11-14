var SOME_STRING = "LOREM_IPSUM";

var someNumber = 8080;

var someFunction = function(number) {
  if (typeof number !== "number") {
    throw new Error("You should pass a number next time...");
  } else {
    console.log("Yayy! " + number + " + " + 3 + " = " + number + 3);
  }
};

var someArray = ["someString", 12, someFunction];

var someObject = {
  name: "Lojzo",
  surname: "Cistic"
};

module.exports = {
  SOME_STRING,
  someNumber,
  someFunction,
  someArray,
  someObject
};
