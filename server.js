//== Modules ==//
var express = require('express');
var app = express();
const bodyParser = require('body-parser');
var methodOverride = require('method-override');
var WorkoutModel = require('./app/models/work-log');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/work-log');

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
//app.use(bodyParser.json({type: 'application/vnd.api+json'}));

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// override with x-http-method-override header in request. simulate delete/put
app.use(methodOverride('X_HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

//== Routes ==//
require('./app/routes')(app); //configure our routes

var router = express.Router();
router.use(function(req,res,next) {
  console.log('Something is happening');
  next();
});

router.get('/', function(req,res) {
  res.json({message: 'API working!'});
});

router.get('/workouts', function(req,res) {
  WorkoutModel.find(function(err, workouts) {
    if(err)
    res.send(err);
    res.json(workouts);
    //res.send('Workouts would be here');
  });
});

router.post('/workouts', function(req,res) {
  var workout = new WorkoutModel();
  workout.movement = req.body.movement;
  workout.weight = req.body.weight;
  workout.reps = req.body.reps;
  workout.sets = req.body.sets;
  workout.notes = req.body.notes;
  workout.date = req.body.date;

  workout.save(function(err) {
    if(err)
    res.send(err);
    res.json({message: 'Workout Created!'});
  });
});


//== Register our Routes ==//
// all routes will be prefixed with /api
app.use('/api', router);

//== Start App ==//
app.listen(port);

console.log('Serving from: ' + port);

// expose app
exports = module.exports = app;
