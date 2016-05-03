var express = require('express');
var morgan = require('morgan');
var app = express();
var swig = require('swig');
var routes = require('./routes');
var bodyParser = require('body-parser');
var socketio = require('socket.io');
var pg = require('pg');
var conString = 'postgres://localhost:5432/twitterdb';
var client = new pg.Client(conString);

app.use(morgan(':method :url :status'));
app.engine('html', swig.renderFile);
app.set('views',__dirname + '/views/' );
app.set('view engine', 'html');

// connect to postgres
client.connect();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); //for HTML form submits b/c HTML forms use URL-link encoding

//Remove lines when deploying
app.set('view cache', false);
swig.setDefaults({ cache: false });
//
var server = app.listen(3000, function(){
  console.log("I is running on 3000");
});
var io = socketio.listen(server);
// console.log(io);

app.use('/', routes(io, client));
app.use(express.static('public'));
//
//
// app.listen(3000, function () {
//   console.log('Twitter app listening on port 3000!');
// });
