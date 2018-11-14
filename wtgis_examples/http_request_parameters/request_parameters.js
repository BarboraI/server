var express = require("express");
var path = require("path");
var server = new express();
var PORT = 3030;

server.get("/some/path", function(request, response) {
  console.log(request.query);
  response.send(request.query);
});

// query parameters are paresed into object request.query
// try accesing http://localhost:3030/some/path?service=wms&version=1.3.0

server.listen(PORT, function() {
  console.log("Server listening on port " + PORT + "!");
});
