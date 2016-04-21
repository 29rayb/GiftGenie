'use strict';

var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var ensureAuthenticated = require('../config/authenticate');

var User = require('../models/user-model');

router.get('/me', ensureAuthenticated, function(req, res) {
  console.log(req.user, "**GET REQUEST in API.JS!!**");
  User.findById(req.user, function(err, user) {
    res.send(user);
  })
});

router.put('/me', ensureAuthenticated, function(req, res) {
  console.log(req.user, "**PUT REQUEST in API.JS!!**");
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }

    user.displayName = req.body.displayName || user.displayName;
    console.log(req.body.displayName);

    user.save(function(err) {
      res.status(200).end();
    });
  });
});

module.exports = router
