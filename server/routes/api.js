'use strict';

var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');

var User = require('../models/user-model');
var Item = require('../models/item-model');

router.get('/me', function(req, res) {
  // console.log(req.user, "**GET REQUEST in API.JS!!**");
  User.findById(req.user, function(err, user) {
    res.send(user);
  })
});

router.post('/me/items', function(req, res) {
  console.log(req.user, "___#1___**<-- (MongoID) POST REQUEST in API.JS!!**");
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }

    Item.submit(req.body, function(err, savedItem) {
      console.log("___#5___The full req.body we get back. (Back inside api.js route.)", req.body);
      console.log(savedItem, "what is the saved item???");
      // var item = req.body;
      // console.log('___#6___Here is the item (api.js).', item);
      user.items.push(savedItem);
      console.log("___#7___New item has been pushed into User document in Mongo.");
      user.save(function(err, user) {
        res.send(user);
      })
    });
  });
});

// router.delete('/me/items', function(req, res) {
//   console.log(req.user, "___#1___**<-- (MongoID) DELETE REQUEST in API.JS!!**");
//   User.findById(req.user, function(err, user) {
//     if (!user) {
//       return res.status(400).send({ message: 'User not found' });
//     }
//
//     Item.submit(req.body, function(err, savedItem) {
//       console.log("___#5___The full req.body we get back. (Back inside api.js route.)", req.body);
//       var item = req.body;
//       console.log('___#6___Here is the item (api.js).', item);
//       user.items.push(item);
//       console.log("___#7___New item has been pushed into User document in Mongo.");
//       user.save(function(err, user) {
//         res.send(user);
//       })
//     });
//   });
// });

module.exports = router
