var express = require('express');
var morgan = require('morgan');
var app = express();
var swig = require('swig');
var routes = require('./routes');

app.use(morgan(':method :url :status'));
app.engine('html', swig.renderFile);
app.set('views',__dirname + '/views/' );
app.set('view engine', 'html');

//Remove lines when deploying
app.set('view cache', false);
swig.setDefaults({ cache: false });
app.use('/', routes);
app.use(express.static('public'));




app.listen(3000, function () {
  console.log('Twitter app listening on port 3000!');
});
