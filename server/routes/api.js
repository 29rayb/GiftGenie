'use strict';

var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var ensureAuthenticated = require('../config/authenticate');

var User = require('../models/user-model');

router.get('/me', ensureAuthenticated, function(req, res) {
  console.log(req.user, "NEW GET REQUEST!!!!!!*****");
  User.findById(req.user, function(err, user) {
    res.send(user);
  })
});

module.exports = router
