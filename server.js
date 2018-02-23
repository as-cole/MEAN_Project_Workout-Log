//== Modules ==//
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

//== Config ==//

var db = require('./config/db');
var port = process.env.PORT || 8080;

// Connect MongoDB database
// uncomment after entering credentials in config/db.js
// mongoose.connect(db.url);

// get all data of the body (POST) parameter
//parse application/json
app.use(bodyParser.json());

// parse app/vnd.api+json as json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// override with x-http-method-overrie header in request. simulate delete/put
app.use(methodOverride('X_HTTP-Method-Overrie'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

//== Routes ==//
require('./app/routes')(app); //configure our routes

//== Start App ==//
app.listen(port);

console.log('Serving from: ' + port);

// expose app
exports = module.exports = app;
