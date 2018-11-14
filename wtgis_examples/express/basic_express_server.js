var express = require("express");
var path = require("path");
// Importing packages from node_modules directory that have to be installed.
// require(path_to_package/npm_package_name)
// express - package for creating http server
// path - package for work with paths (relative, absolute)

var server = new express();
// create new instance of express in server variable
var PORT = 3030;
// define PORT variable

server.get('/', function (request, response) {
    var pathToHtml = path.join(__dirname, 'example.html')
    response.sendFile(pathToHtml)
})
// define function that will be called when get request on url http://host:port/ is made
// pathToHtml - call path's join method to combine global variable __dirname with relative path to html file
// __dirname stores global path to directory in which you call the script
// response.sendFile - send file as response for HTTP get request response.sendFile(path_to_file)

server.get('/hi-server', function (request, response){
    response.send('Hi there!')
})

// response.send(String) sends string as a response to request

server.listen(PORT, function() {
  console.log("Server listening on port " + PORT + "!");
});

// server.listen(port_number, callback) - start server with callback function that is called on start
