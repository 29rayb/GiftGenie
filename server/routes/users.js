'use strict';

const express = require('express');
const User = require('../models/user-model');

let router = express.Router();

router.get('/', function (req, res){
  User.find({})
  .exec(function (err, users){
    users = users.map(user => {
      user = user.toObject();
      delete user.password;
      return user;
    });
    res.status(err ? 400 : 200).send(err || users);
  });
});

router.get('/me', function(req, res){
  User.findById(req.userId)
  .exec(function(err, user){
    user = user.toObject();
    delete user.password;
    res.status(err ? 400 : 200).send(err || user);
  });
});

router.post('/wished', function (req, res){
  User.findById(req.userId)
  .exec(function (err, user){
    user.toggleWished(req.body.wishedId, function(err){
      user = user.toObject();
      delete user.password;
      res.status(err ? 400 : 200).send(err || user);
    });
  });
});

router.put('/', function (req, res){
  if (req.userId === req.body._id){
    User.findByIdAndUpdate(req.body._id, req.body)
    .exec(function (err, updatedUser){
      updatedUser = updatedUser.toObject();
      delete updatedUser.password;
      res.status(err ? 400 : 200).send(err || updatedUser);
    });
  } else {
    res.status(403).send('You are not authorized to do this action');
  }
});

router.delete('/', function (req, res){
  if (req.userId === req.body._id){
    User.findByIdAndRemove(req.body._id, function (err, removedUser){
      console.log(removedUser)
      res.status(err ? 400 : 200).send(err || 'removed');
    });
  }else{
    res.status(403).send('You are not authorized to do this action');
  }
});

module.exports = router;