'use strict';

var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');

var User = require('../models/user-model');
var Item = require('../models/item-model');

//#1: Finding a user (to display their profile info).
router.get('/me', function(req, res) {
  console.log(req.user, "**GET REQUEST in API.JS!!**");
  User.findById(req.user, function(err, user) {
    res.status(err ? 400 : 200).send(err || user)
  }).populate('items')
});

//#2: Adding a new item to the wishlist.
router.post('/me/items', function(req, res) {
  console.log(req.user, "___#1___(MongoID) POST REQUEST in API.JS!!**");
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    Item.submit(req.body, function(err, savedItem) {
      console.log('___#6___Here is the item (api.js)', savedItem);
      user.items.push(savedItem);
      console.log("___#7___New item has been pushed into User document in Mongo.");
      user.save(function(err, user) {
        res.send(user);
      })
    });
  });
});

//Route #3: Deleting an item from the wishlist (removes it from both Mongo models).
router.put('/me/items/delete', function(req, res) {
  console.log(req.user, "<-- (MongoID) DELETE REQUEST in API.JS!!**");

  var clicked = req.body;
  var clickedItemId = req.body._id;
  var clickedItemName = req.body.name;
  User.findByIdAndUpdate(req.user, {$pull : { "items" : clickedItemId }}, function(err, user) {
    if(err){
      res.status(400).send(err);
    }
    Item.findByIdAndRemove(clickedItemId, function(err, item){
      console.log("**Item deleted from both models.");
      res.send(user);
    });
  })
});

//Route #4: Editting an item on a wishlist (updates both Mongo models).
router.put('/me/items/edit', function(req, res) {
  console.log(req.user, "<-- (MongoID) EDIT REQUEST in API.JS!!**");

  var editItem = req.body;
  var editItemId = editItem.id;
  var editItemName = editItem.name;
  var editItemLink = editItem.link;

  Item.findByIdAndUpdate(editItemId, { "name": editItemName,  "link": editItemLink }, function(err, item) {
    console.log("Item updated.");
    res.send(item);
  });
});

// Route #5: Get request to find Facebook friends.
router.get('/me/:id/friends', function(req, res) {
  console.log(req.user, "<--Facebook friends GET REQUEST.**");
  console.log(res, "<--Facebook friends.**");
  User.findById(req.user, function(err, user) {
    console.log('USER INSIDE GET REQUEST', user);
    res.status(err ? 400 : 200).send(err || user)
  });
})

module.exports = router;
