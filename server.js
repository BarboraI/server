var polievka = 5
var leco = 6
var sum = polievka + leco
console.log (sum  + "Vsetko je ok");

var express = require("express");
var path = require("path");
var server = express();
var PORT = 3000


server.get('/wms', function (request, response) {
  var params = request.query;
  console.log(params)
 if(params.service=== 'wms' && params.request==='GetCapabilities'){
   response.sendFile(path.join(__dirname, 'nase_vrstvy.xml'))
  }
  else if(params.service=== 'wms' && params.request==='GetMap'){
    
  console.log('Idem robit map')
}
  else {
    response.send ('nepodporovana metoda')
  }

})

server.listen(PORT,function(){
 console.log("Server listening on port"+PORT+"!" );
});