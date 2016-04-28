var express = require('express');
var morgan = require('morgan');
var app = express();
var swig = require('swig');
var routes = require('./routes');
var bodyParser = require('body-parser');
var socketio = require('socket.io');


app.use(morgan(':method :url :status'));
app.engine('html', swig.renderFile);
app.set('views',__dirname + '/views/' );
app.set('view engine', 'html');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//Remove lines when deploying
app.set('view cache', false);
swig.setDefaults({ cache: false });
//
var server = app.listen(3000, function(){
  console.log("I is running on 3000");
});
var io = socketio.listen(server);
// console.log(io);

app.use('/', routes(io));
app.use(express.static('public'));
//
//
// app.listen(3000, function () {
//   console.log('Twitter app listening on port 3000!');
// });
