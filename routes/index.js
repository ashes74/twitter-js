var express = require('express');
var router = express.Router();
// could use one line instead: var router = require('express').Router();
// var tweetBank = require('../tweetBank');

module.exports = function(io, client){

  router.get('/', function (req, res) {
    client.query('SELECT * FROM Tweets INNER JOIN Users ON Users.id = Tweets.userID', function (err, result) {
        var tweets = result.rows;
        // console.log(tweets);
    res.render('index', { title: 'Twitter.js', tweets: tweets, showForm:true });
    });
    // var tweets = tweetBank.list();
    // res.render( 'index', { title: 'Twitter.js', tweets: tweets , showForm: true} );
  });

  router.get('/users/:name', function(req, res) {
    var nameSelected = req.params.name;
    client.query('SELECT * FROM Tweets INNER JOIN Users ON Users.id = Tweets.userID WHERE name = $1', [nameSelected], function (err, result) {
        var tweets = result.rows;
    res.render('index', { title: 'Twitter.js', tweets: tweets, showForm:true });
    });
    // var name = req.params.name;
    // var list = tweetBank.find( {name: name} );
    // console.log(list);
    // res.render( 'index', { title: 'Twitter.js - Posts by '+name, name:name, tweets: list, showForm: true} );
  });

  router.get('/tweets/:id', function (req, res) {
    var idSelected = Number(req.params.id);
    client.query('SELECT * FROM Tweets INNER JOIN Users ON Users.id = Tweets.userID WHERE Tweets.id = $1', [idSelected], function (err, result) {
        var tweets = result.rows;
    res.render('index', { title: 'Twitter.js', tweets: tweets, showForm:true });
    });
    // var listTweetsById = tweetBank.find({id:id});
    // res.render('index', {title: 'Twitter-js : Post', tweets: listTweetsById});

  });

  router.post('/tweets', function(req, res){

    var text = req.body.text;
    var nameSelected = req.body.name;
    var img = "http://i.imgur.com/CTil4ns.jpg";
    
    var addPerson = function(callback){
      client.query('INSERT INTO Users (name, pictureUrl) VALUES ($1, $2)', [nameSelected, img], function (err, result) {
          if (err) console.log("Err2", err);
            var results = result.rows;
            console.log("add", result);

          client.query('SELECT * FROM Users WHERE name=$1', [nameSelected], function (err, result) {
             if (err) console.log("err3", err);
              var personId = result.rows[0].id;
              console.log("person", personId);
              userIdAdded = personId;
              callback(userIdAdded);
          });
      });

    };

    var findUserId = function (callback){
    client.query('SELECT Users.id FROM Users INNER JOIN Tweets ON Users.id = Tweets.userId WHERE Users.name = $1', [nameSelected], function (err, result) {
      if (err) console.log("err1", err);
        console.log("firstquery", result);
        var userIdAdded;
        if(result.rowCount === 0){
            addPerson(callback);
        } else {
          userIdAdded = result.rows[0].id;
          callback(userIdAdded);
        }

        
    });
    };
   
    var addTweet = function (userIdAdded){
      client.query('INSERT INTO Tweets (userId, content) VALUES ($1, $2)', [userIdAdded, text], function (err, result) {
        console.log(userIdAdded);
        if (err) console.log("err3", err);
          var result = result.rows;
          console.log("Results", result);
           io.sockets.emit('new_tweet', {name:nameSelected, text:text, id:userIdAdded });
          res.redirect('/' );
        });
    };

    findUserId(addTweet);
  });



  return router;
};
