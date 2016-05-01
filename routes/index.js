var express = require('express');
var router = express.Router();
// could use one line instead: var router = require('express').Router();
var tweetBank = require('../tweetBank');

module.exports = function(io){

  router.get('/', function (req, res) {
    var tweets = tweetBank.list();
    res.render( 'index', { title: 'Twitter.js', tweets: tweets , showForm: true} );
  });

  router.get('/users/:name', function(req, res) {
    var name = req.params.name;
    var list = tweetBank.find( {name: name} );
    // console.log(list);
    res.render( 'index', { title: 'Twitter.js - Posts by '+name, name:name, tweets: list, showForm: true} );
  });

  router.get('/tweets/:id', function (req, res) {

    var id = Number(req.params.id);
    var listTweetsById = tweetBank.find({id:id});
    res.render('index', {title: 'Twitter-js : Post', tweets: listTweetsById});

  })

  router.post('/tweets', function(req, res) {
    var name = req.body.name;
    var text = req.body.text;
    // console.log(name);
    var id= tweetBank.add(name, text);
    // console.log(io);
    io.sockets.emit('new_tweet', {name:name, text:text, id:id });
    res.redirect('/' );
  });



  return router;
};
