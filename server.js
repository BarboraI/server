

var express = require("express"); // vyžaduje import balíka 
var server = express(); // vytvorí sa nová inštancia expresu v premennej
var path = require("path"); //import balíka pre prácu s cestami (absolútnymi alebo relatívnymi)
var fs = require("fs"); //import balíka pre prácu so súborovym systémom
var mapnik = require("mapnik"); // zadefinovanie knižnice na vykresľovanie mapového obrázka
var generateImage = require ('./generate_img.js'); //import funkcie generateImage zo suboru generate_img.js

console.log(generateImage); // vypísanie funkcie generateImage
var PORT = 3002; //definovanie hodnoty portu, na ktorom bude server "počúvať"

server.use(express.static('icons')); //zobrazovanie statických súborov (v našom prípade obrázkov zo súboru "icons")

server.get('/wms', function (request, response) {
    var params = request.query; //pridelenie dopytovacích žiadostí do premennej params
    console.log(params); //vypíše premennú "params"

    if(params.SERVICE === 'WMS' && params.REQUEST === 'GetCapabilities') { //podmienka, ak budeme v dopyte pozadovat SERVICE=WMS a REQUEST=GetCapabilities
      response.sendFile(path.join(__dirname, 'nase_vrstvy.xml')) //odoslanie súboru v danej ceste (path)
    } else if (params.SERVICE === 'WMS' && params.REQUEST === 'GetMap') { //podmienka, ak budeme v dopyte pozadovat SERVICE=WMS a REQUEST=GetMap
      generateImage(params, response.sendFile.bind(response)) //vygenerovanie mapového obrázka
    } else { 
      response.send ('nepodporovana metoda') //vypíše "nepodporovaná metóda" v prípade, že nebola splnená ani jedna z predchadzájúcich podmienok
    }
})

server.listen(PORT,function(){ //definovanie správy, ktorá sa vypíše, ak všetko funguje
    console.log("Server listening on port " + PORT + " !"); //ak sa správne spustí server, vypíše sa správa "Server listening on port"s číslom portu (3002)
});
