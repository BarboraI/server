var path = require("path"); //import balíka pre prácu s cestami
var fs = require("fs"); //import balíka pre prácu so súborovým systémom
var mapnik = require("mapnik"); // zadefinovanie knižnice na vykresľovanie mapového obrázka

mapnik.register_default_fonts(); // registrácia  niektorých predvolených fontov do mapniku
mapnik.register_default_input_plugins(); // registrácia predvolených pliginov do mapniku

function generateImage(arg, sendFile){ //funcia na generovanie obrázku
var width = Number(arg.WIDTH); // definovanie šírky mapového okna 
var height = Number(arg.HEIGHT); //definovanie výšky mapového okna 
var bbox = arg.BBOX.split(',').map(function(elem){ //prechádzanie elementov v poli po predchádzajucom rozdelení podla čiarky a ich konvertovanie cez funkciu na číslo
    return Number(elem)}); // celé to  laicky znamená definovanie pravého horného a ľavého dolného rohu map.okna; prevedenie zo string-u na numerický tvar, čiže číslo
var layers=(arg.LAYERS).split(','); //rozdelenie popisu vrstiev čiarkou (napr. budovy, cesty,lavičky atď.)

var map = new mapnik.Map(width, height); // definovanie premennej, ktorá bude obsahovať nové objekty mapového obrazu s definovanou šírkou a výškou

var addBudovy=arg.LAYERS.includes('budovy'); //zadefinovanie premennej a k nej priradenie vrstvy
var addCesty=arg.LAYERS.includes('cesty'); //detto
var addLavicky=arg.LAYERS.includes('lavicky');//detto
var addPamiatky=arg.LAYERS.includes('pamiatky'); //detto
var addParkovisko=arg.LAYERS.includes('parkovisko'); //detto
var addCintorin=arg.LAYERS.includes('cintorin'); //detto

var proj = "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs"; //definovanie premennej, ktorá definuje súradnicový systém (projekciu)

var style_budovy='<Style name="style_budovy">' + //definovanie premennej, ktorá obsahuje parametre štýlovania a názov štýlu
'<Rule>' + //začiatok zapisovania parametrov štýlovania
    '<LineSymbolizer stroke="#c77207" stroke-width="2.3" />' + // nastavenie oranžovej farby pre líniu, ktorá ohraničuje tvar budov
    '<PolygonSymbolizer fill="#e7893a"  />' + // nastavenie oranžovej farby pre výplň budov 
'</Rule>' + //koniec zapisovania parametrov pre štýlovanie
'</Style>' //končí príkaz pre štýlovanie budov

var style_parkovisko='<Style name="style_parkovisko">' + // detto
'<Rule>' +
    '<LineSymbolizer stroke="black" stroke-width="2.5" />' + // nastavenie čiernej farby lemovania parkoviska, šírka línie 2.5
    '<PolygonSymbolizer fill="#cac8c7"   />' + // nastavenie farby výplne polygónov, ktoré znázorňujú parkoviská
'</Rule>' +
'<Rule>' +
    '<MaxScaleDenominator>3500</MaxScaleDenominator>' + // max. mierka, po ktorú sa vrstva poskovisko zobrazí
    '<MinScaleDenominator>100</MinScaleDenominator>'+ // definovanie  min.mierky, od ktorej sa vrstva zobrazí
    '<TextSymbolizer placement="dummy" face-name="DejaVu Sans Condensed Bold" size="12" fill="#4043e0" allow-overlap="false" clip="false"> "P" </TextSymbolizer>'+// vloženie textu ("P"), ktorý je zobrazený na polygóne s definovaným umiestnením, typom písma, veľkosťou, farbou,...
'</Rule>' +
'</Style>'//koniec štýlovania parkovísk

var style_cintorin='<Style name="style_cintorin">' + // zhodné s predchádzajúcimi
'<Rule>' +
    '<LineSymbolizer stroke="#257715" stroke-width="2.0" />' + // farba ohraničenia cintorínov(zelená) a hrúbka čiary 2
    '<PolygonSymbolizer fill="#58b146"  />' + // nastavenie farby parkovísk (zelená)
'</Rule>' +
'<Rule>'+
    '<MaxScaleDenominator>7000</MaxScaleDenominator>'+ // definovanie mierky, po ktorú sa vrstva poskovisko zobrazí
    '<MinScaleDenominator>2501</MinScaleDenominator>'+ // definovanie  min.mierky, od ktorej sa vrstva zobrazí
    '<PolygonPatternSymbolizer file="./icons/hrob.png"/>'+ // daný polygón znázorňujúci cintorín je vyplnený vzorom, ktorý pozostáva zo značiek tvaru kríža (značka je uložená v priečinku icons)
'</Rule>'+
'<Rule>'+
    '<MaxScaleDenominator>2500</MaxScaleDenominator>'+ // rovnako, len pri iných mierkach
    '<MinScaleDenominator>501</MinScaleDenominator>'+
    '<PolygonPatternSymbolizer file="./icons/hrob.png"/>'+ //písané vyššie
'</Rule>'+
'<Rule>'+
    '<MaxScaleDenominator>300</MaxScaleDenominator>'+ // rovnako, len pri iných mierkach
    '<MinScaleDenominator>1</MinScaleDenominator>'+
    '<PolygonPatternSymbolizer file="./icons/hrob.png"/>'+ //písané vyššie
'</Rule>'+
'</Style>'

var style_cesty='<Style name="style_cesty">' + // // zhodné s predchádzajúcimi vrstvami
'<Rule>' +
    '<MinScaleDenominator>7500</MinScaleDenominator>'+ //spomenuté vyššie
    '<LineSymbolizer stroke="#010600" stroke-width="1"/>' + // stýlovanie cesty pri danej mierke zobrazenia, čierna farba a hrúbka čiary 1
'</Rule>' +
'<Rule>' +
    '<MaxScaleDenominator>7000</MaxScaleDenominator>'+ //spomenuté
    '<MinScaleDenominator>90</MinScaleDenominator>'+ //detto
    '<LineSymbolizer stroke="#bcb4ae" stroke-width="3" stroke-linecap="round" />' + // nastavenie štýlu lńie pri daných mierka, konkrétne sivá farba s hrúbkou 3
'</Rule>' +
'<Rule>' +
    '<MaxScaleDenominator>8000</MaxScaleDenominator>'+
    '<MinScaleDenominator>90</MinScaleDenominator>'+
    '<LineSymbolizer stroke="#010600" stroke-width="2" stroke-dasharray="5 2" />' + // štýlovanie línie cesty, konkrétne tmavá až čierna farba, hrúbka 2 a je prerušovaná stroke-dasharray znamená, že je prerušovaná;5 je dĺžka a 2 medzera
'</Rule>' +
'</Style>' 

var style_lavicky='<Style name="style_lavicky">' + // detto
'<Rule>' +
    '<MaxScaleDenominator>2100</MaxScaleDenominator>' + //spomenuté
    '<MinScaleDenominator>400</MinScaleDenominator>'+ //spomenuté
    '<PointSymbolizer file= "./icons/lavicka1.png" transform="scale(0.015,0.015)" />'+ //na znázornenie lavičiek sme použili ikonu (lavicka.png) zo súboru "icons" a nastavili jej mierku zobrazenia
'</Rule>' +
'<Rule>' +
    '<MaxScaleDenominator>399</MaxScaleDenominator>' +
    '<MinScaleDenominator>1</MinScaleDenominator>'+
    '<PointSymbolizer file= "./icons/lavicka1.png" transform="scale(0.08,0.08)" />'+ //detto len iná mierka
'</Rule>' +
'</Style>' 

var style_pamiatky='<Style name="style_pamiatky">' +  // zhodné s predchádzajúcimi vrstvami
'<Rule>' +
    "<Filter>[TYP] = 'Hrobka'</Filter>"+ // filter slúži na vyselektovanie objektov z vrstvy podľa vybraného atribútu (TYP), potom pre dané objekty platia nasledovné parametre
    '<MaxScaleDenominator>6100</MaxScaleDenominator>' + //maximálna mierka, po ktorú sa zobrazí
    '<MinScaleDenominator>400</MinScaleDenominator>'+
    '<MarkersSymbolizer file= "./icons/hrobka.png" width="40" height="40" />'+ //definovanie veľkosti ikony, ktorú sme zvolili pre znázornenie pamiatok(konkrétne hrobiek)
'</Rule>' +
'<Rule>' +
    "<Filter>[TYP] = 'Socha'</Filter>"+ //vyselektovanie objektov z vrstvy podľa vybraného atribútu (TYP), potom pre dané objekty platia nasledovné parametre
    '<MaxScaleDenominator>6100</MaxScaleDenominator>' + //
    '<MinScaleDenominator>400</MinScaleDenominator>'+ //
    '<MarkersSymbolizer file= "./icons/socha.png" width="40" height="40" />'+ //pre označenie sôch na mape sme vybrali ikonu sochy zo súboru "icons" a zadefinovali šírku a výšku obrázka v pixeloch
'</Rule>' +
'</Style>'  

var layer_cesty = '<Layer name="cesty" srs="'+proj+'">' + //  vrstve s názvom "cesty" je definovaný súr.systém
'<StyleName>style_cesty</StyleName>' + // danej vrstve je daný štýl, ktorý bol definovaný v príkazoch vyššie
'<Datasource>' + // definovanie zdroja údajov
'<Parameter name="file">' + path.join( __dirname, 'data/cesty.shp' ) +'</Parameter>' + // cesta k danej vrstve (cesty)
'<Parameter name="type">shape</Parameter>' + // definovanie typu vrstvy
'</Datasource>' +
'</Layer>'

var layer_budovy = '<Layer name="budovy" srs="'+proj+'">' + // vrstve "budovy" je definovaný súr. systém
'<StyleName>style_budovy</StyleName>' +
'<Datasource>' +
'<Parameter name="file">' + path.join( __dirname, 'data/budovy.shp' ) +'</Parameter>' +
'<Parameter name="type">shape</Parameter>' +
'</Datasource>' +
'</Layer>'

var layer_parkovisko = '<Layer name="parkovisko" srs="'+proj+'">' + //detto, ale pre inú vrstvu
'<StyleName>style_parkovisko</StyleName>' +
'<Datasource>' +
'<Parameter name="file">' + path.join( __dirname, 'data/parkovisko.shp' ) +'</Parameter>' +
'<Parameter name="type">shape</Parameter>' +
'</Datasource>' +
'</Layer>' 

var layer_cintorin = '<Layer name="cintorin" srs="'+proj+'">' + //detto, ale pre inú vrstvu 
'<StyleName>style_cintorin</StyleName>' +
'<Datasource>' +
'<Parameter name="file">' + path.join( __dirname, 'data/cintorin.shp' ) +'</Parameter>' +
'<Parameter name="type">shape</Parameter>' +
'</Datasource>' +
'</Layer>' 


var layer_lavicky = '<Layer name="lavicky" srs="'+proj+'">' + //detto, ale pre inú vrstvu
'<StyleName>style_lavicky</StyleName>' +
'<Datasource>' +
'<Parameter name="file">' + path.join( __dirname, 'data/lavicky.shp' ) +'</Parameter>' +
'<Parameter name="type">shape</Parameter>' +
'</Datasource>' +
'</Layer>'

var layer_pamiatky = '<Layer name="pamiatky" srs="'+proj+'">' + //detto, ale pre inú vrstvu
'<StyleName>style_pamiatky</StyleName>' +
'<Datasource>' +
'<Parameter name="file">' + path.join( __dirname, 'data/pamiatky.shp' ) +'</Parameter>' +
'<Parameter name="type">shape</Parameter>' +
'</Datasource>' +
'</Layer>'

// Schema zobrazovanej mapy
var schema = '<Map background-color="#f9f7cb" srs="'+proj+'">' + // definovanie farby pozadia mapy (bledožltá) a jej priestorového referenčného systému pomocou kódu epsg 
        (addParkovisko ? style_parkovisko : '') + //hovorí o tom, že ak platí podmienka add(daná vrstva), ktorú sme na začiatku definovali, tak sa vykoná style(konkrétna vrstva)
        (addParkovisko ? layer_parkovisko : '') + // to isté
        (addCintorin ? style_cintorin : '') +
        (addCintorin ? layer_cintorin : '') +
        (addBudovy ? style_budovy : ' ') +
        (addBudovy ? layer_budovy : ' ') +
        (addCesty ? style_cesty : ' ') +
        (addCesty ? layer_cesty : ' ') +
        (addLavicky ? style_lavicky : ' ') +
        (addLavicky ? layer_lavicky : '') + 
        (addPamiatky ? style_pamiatky : '') +
        (addPamiatky ? layer_pamiatky : '') +  // to isté

    '</Map>'; // teraz máme definovaný mapnik XML v premennej, ktorá definuje vrstvy, dátové zdroje,  štýlovanie vrstiev

map.fromString(schema, function(err, map) { //funkciou načítame XML schému
  if (err) {
      console.log('Map Schema Error: ' + err.message) // ak sa vyskytne error pri spracovaní schémy, ukáže nám to
  }
  map.zoomToBox(bbox); //"zozoomovanie" mapy až k definovanému bbox

  var im = new mapnik.Image(width, height); // definovanie nového mapnik obrázka s rovnakou šírkou a výškou 

  map.render(im, function(err, im) { //vygenerovanie mapového obrázka z premennej "im"
      
    if (err) {
        console.log('Map redner Error: ' + err.message) // vypíše zdroj chyby v prípade, že nastala chyba
    }

    im.encode("png", function(err, buffer) { // definovanie formátu v ktorom bude mapa vytvorená
      if (err) { 
         console.log('Encode Error: ' + err.message) // ak nastne chyba, vypíše jej zdroj
      }

      fs.writeFile( // použijeme node file system package "fs" na zápis do súboru, prvým parametrom je cesta k nášmu súboru
        path.join(__dirname, "out/map.png"), // skombinuje adresár, v ktorom je  daný skript spustený s obrázkom mapy
        buffer, // vloží  buffer vytvorený metódou "im.encode" mapnika
        function(err) { //funkcia v prípade, keby nastala chyba
          if (err) { //v prípade nejakej chyby.. 
              console.log(' Fs Write Error: ' + err.message) // vypíše daný error (správu o chybe)
          }
          console.log('Image generated into: ' +  //prípad ked nenastala chyba, vypíše správu v uvodzovkách, že bol obrázok vygenerovaný
            path.join(__dirname, "out/map.png") //definujeme cestu k súboru, kam sa vyygenerovaný obraz mapy uloží vo formáte "png"
                                                // po správe "Image generated into....." je obraz uložený v priečinku out
            
          );
          sendFile(path.join(__dirname ,"out/map.png")); //cesta k vygenerovanému mapovému obrázku
        }
      );
    });
  });
})
};

module.exports = generateImage; //exportuje funkciu generateImage, aby sme ju vedeli ďalej importovať v ostatných súboroch