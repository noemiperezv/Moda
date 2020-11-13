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
