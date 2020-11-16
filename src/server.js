const express = require('express');
const app = express();

const path = require('path');
const mongoose = require('mongoose');
var dbMongo = require('./config/db');
const MongoClient = require('mongodb').MongoClient;
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require ('morgan');
const cookieParser = require('cookie-parser');
const bodyparser = require ('body-parser');
const session = require('express-session');




app.use(bodyparser.json());
dbMongo();
//const {url} = require('./config/database');
//const { engine } = require('../app');


/*onst client = new MongoClient(url, { useNewUrlParser: true });
client.connect(err => {
const collection = client.db("test").collection("devices");
// perform actions on the collection object
client.close();
});*/




//const uri = "mongodb+srv://test:test@cluster0.wdylp.mongodb.net/AWOS?retryWrites=true&w=majority";
/*const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});*/

require('./config/passport')(passport);

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyparser.urlencoded({extended: false}));
app.use(session({
    secret: '13051986',
    resave:false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes')(app, passport);


app.listen(app.get('port'),()=>{
    console.log('server on port', app.get('port'));
});

app.use(express.static(path.join(__dirname,'public')));

google.maps.event.addDomListener(window, "load", function(){
  const ubicacion = new Localizacion(()=>{
    const myLatLng = {lat: ubicacion.latitude,lng: ubicacion.longitude};
     const options = {
       center: myLatLng,
       zoom: 14
     }
     var map = document.getElementById('map');
     const mapa = new google.maps.Map(map, options);
     const marcador = new google.maps.Marker({
       position: myLatLng,
       map: mapa
     });

     var informacion = new google.maps.InfoWindow();

     marcador.addListener('click',function(){
       informacion.open(mapa, marcador);
     });

     var autocomplete = document.getElementById('autocomplete');

     const search = new google.maps.places.autocomplete(autocomplete);
     search.bindTo("bounds",mapa);

     search.addListener('place_changed', function(){
       informacion.close();
       marcador.setVisible(false);

       var place = search.getPlace();

       if (!place.geometry.viewport){
         window.alert("Error al mostrar el lugar");
         return;
       }
       if(place.geometry.viewport){
        mapa.fitBounds(place.geometry.viewport);
       }else{
         mapa.setCenter(place.geometry.location);
         mapa.setZoom(18);
       }

       marcador.setPosition(place.geometry.location);
       marcador.setVisible(true);

       var address = "";
       if (place.address_components){
         address = [
          (place.address_components[0] &&  place.address_components[0].short_name || ''), 
          (place.address_components[1] &&  place.address_components[1].short_name || ''),
          (place.address_components[2] &&  place.address_components[2].short_name || '')
         ];
       }

       informacion.setContent('<div><strong>'+ place.name+'</strong><br>'+ address);
       informacion.open(map,marcador);
     });

  });
})