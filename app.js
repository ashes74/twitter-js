var express = require('express');
var morgan = require('morgan');
var app = express();

app.use(morgan(':method :url :status'));

app.use(function (req, res, next) {
    // do your logging here
    // call `next`, or else your app will be a black hole — receiving requests but never properly responding
    console.log(req.method, req.url)
    next();
})
app.use("/special/", function (req, res, next){
    console.log("You reached the special area");
    next();
})

app.get('/', function (req, res) {
  res.send('Hello World!!!!!!!');
});

app.get('/news', function (req, res) {
  res.send('Hello World LORI ASHWOOD!!!!!!!');
});
app.listen(3000, function () {
  console.log('Twitter app listening on port 3000!');
});

console.log("hello");