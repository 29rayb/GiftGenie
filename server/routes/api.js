'use strict';

var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var ensureAuthenticated = require('../config/authenticate');

var User = require('../models/user-model');
var Item = require('../models/item-model');


// ensureAuthenticated is repetitive / unnecessary because you already
// defined it in the app.js with the following line
// app.use('/api', authMiddleware, require('./routes/api'));

router.get('/me', ensureAuthenticated, function(req, res) {
  console.log(req.user, "**GET REQUEST in API.JS!!**");
  User.findById(req.user, function(err, user) {
    res.send(user);
  })
});

router.post('/me', ensureAuthenticated, function(req, res) {
  console.log(req.user, "**<-- (MongoID) POST REQUEST in API.JS!!**");
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }

    Item.submit(req.body, function(err, savedItem) {
      console.log(req.body, "This is the full req.body");
      console.log('This is a saved item', savedItem);
      res.status(err ? 400 : 200).send(err || savedItem);
    });
 
    // user.displayName = req.body.displayName || user.displayName;
    // console.log(req.body.displayName);
    //
    // items.link = req.body.item || user.displayName;
    // console.log(items.link, "HERE 1");
    //
    // items.name = req.body.name || user.displayName;
    // console.log(items.name, "HERE 2");

    // user.save(function(err) {
    //   res.status(200).end();
    // });
  });
});

module.exports = router
