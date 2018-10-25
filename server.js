var express = require("express");
var path = require("path");
var server = express();
var PORT = 3000


server.get('/wms', function (request, response) {
  var params = request.query;
  console.log(params)
 if(params.SERVICE=== 'WMS' && params.REQUEST==='GetCapabilities'){
  console.log('idem robit get capa')
   response.sendFile(path.join(__dirname, 'nase_vrstvy.xml'))
}
  else {
    response.send ('nejdem robit get capa')
  }

})

server.listen(PORT,function(){
 console.log("Server listening on port"+PORT+"!" );
});