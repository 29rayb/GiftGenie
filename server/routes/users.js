'use strict';

const express = require('express');
const User = require('../models/user-model');

let router = express.Router();
var checkAuthentication = require('../config/auth');

router.use(checkAuthentication);

var users = ['what the fuck'];

router.get('/', function (req, res) {
  console.log(req.user);
  res.send(users)
  // console.log("IN USERS.JS ROUTE");
  // User.find({}, (err, users) => {
  //   if (err) return res.status(400).send(err);
  //   users.forEach(user => {
  //     user.password = null;
  //     return user;
  //   });
  //   res.send(users);
  // })
});

// router.get('/', checkAuthentication, function (req, res){
//   console.log("Inside users route");
//   User.findById({})
//   .exec(function (err, users){
//     console.log("hey");
//     users = users.map(user => {
//       user = user.toObject();
//       delete user.password;
//       console.log('Get to / in users route');
//       // res.send({ user: users });
//     });
//     res.status(err ? 400 : 200).send(err || users);
//   });
// });

router.get('/me', function(req, res){
  console.log('req.user:', "get to /me in users route");
  User.findById(req.userId)
  .exec(function(err, user){
    console.log("AHHHHHHHHHHH", req.params, "this is it in GET ROUTE");
    user = user.toObject();
    delete user.password;
    res.status(err ? 400 : 200).send(err || user);
  });
});

// router.get('/me', checkAuthentication, function(req, res) {
//   User.findById(req.user, function(err, user){
//     console.log("users route");
//     res.send({
//       displayName: user.displayName,
//       picture: user.picture
//     });
//   })
// });

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
