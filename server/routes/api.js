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
  console.log(clicked, "req.body");
  var clickedItemId = req.body._id;
  console.log(clickedItemId, 'clicked item id');
  var clickedItemName = req.body.name;
  console.log(clickedItemName, 'clicked item name');

  var mongoose = require('mongoose');
  var objectId = mongoose.Types.ObjectId(clickedItemId);
  console.log(objectId, 'item object!');

  User.findByIdAndUpdate(req.user, {$pull : { "items" : objectId }}, function(err, user) {
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
  // console.log(req.user, "<-- (MongoID) EDIT REQUEST in API.JS!!**");

  var editItem = req.body;
  console.log(editItem, "Editted item to save.");
  var editItemId = editItem.id;
  console.log(editItemId, "id of editted item.");

  var editItemName = editItem.name;
  var editItemLink = editItem.link;
  console.log(editItemName, "name of editted item.");

  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    console.log(user, 'user');
    console.log(user.items, "user items");
    // var new = user.items.ObjectId.str;
    // console.log(user.items.ObjectId.);


    // cannot read property 'str' of undefined error needs to be fixed;
    User.update( {"items" : { $elemMatch: { "_id": editItemId.str }}},
    { "name": editItemName, "link": editItemLink },
    function(err, user) {
      console.log('well were here');
      if(err){
        res.status(400).send(err);
      }
      Item.update( {"_id": editItemId},
      { "name": editItemName,
      "link": editItemLink },
      function(err, item) {
        console.log("YAY");
        res.send(user);
      });
    });
  });
});

// Favorite User's Wishlist
router.put('/me/star', function(req, res){
  console.log('favorites array to update', req.body.favorites)
  console.log('@@@@@@req.user', req.user)
  User.findById(req.user, function(err, user){
    if (!user){
      return res.status(400).send({messages: 'User Not Found'})
    }
    User.update({"favorites": {$push: {req}} })
    console.log('!!!!!!!!!user in the robomongo', user)
  })
})


router.post('/friend', function(req, res){
  // console.log('FRIEND FACEBOOK ID', req.body.params)
  var friendId = req.body.params.fid;
  User.findOne({'facebook': friendId}, function(err, user){
    // console.log('friend', user)
    if (err) console.error(err)
    res.send(user)
  })
})


// List of all followers


module.exports = router;
