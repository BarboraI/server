var polievka = 5
var leco = 6
var sum = polievka + leco
console.log (sum  + "Vsetko je ok");

var express = require("express");
var path = require("path");
var server = express();
var PORT = 3000


server.get('/getCapabilities', function (request, response) {
   response.sendFile(path.join(__dirname + "/getCappabilitiesDocuments.xml"))

})

server.get ("/Ahoj/neviem", function (request, response) {
    console.log(request.query.stvrtok);
  response.send(request.query);
});


server.get("/some/path", function(request, response) {
    console.log(request.query.stvrtok);
    response.send(request.query);
  });


server.listen(PORT, function() {
    console.log("Server listening on port " + PORT + "!");
  });
