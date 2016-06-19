'use strict';

var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');

var User = require('../models/user-model');
var Item = require('../models/item-model');

//#1: Finding a user (to display their profile info).
router.get('/me', function(req, res) {
  User.findById(req.user, function(err, user) {
    res.status(err ? 400 : 200).send(err || user)
  }).populate('items')
});

//#2: Adding a new item to the wishlist.
router.post('/me/items', function(req, res) {
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    Item.submit(req.body, function(err, savedItem) {
      user.items.push(savedItem);
      user.save(function(err, user) {
        res.send(user);
      })
    });
  });
});

//Route #3: Deleting an item from the wishlist (removes it from both Mongo models).
router.put('/me/items/delete', function(req, res) {
  // var clicked = req.body;
  var clickedItemId = req.body._id;
  // var clickedItemName = req.body.name;

  var mongoose = require('mongoose');
  var objectId = mongoose.Types.ObjectId(clickedItemId);

  User.findByIdAndUpdate(req.user, {$pull : { "items" : objectId }}, function(err, user) {
    if(err){
      res.status(400).send(err);
    }

    Item.findByIdAndRemove(clickedItemId, function(err, item){
      res.send(user);
    });
  })
});

//Route #4: Editting an item on a wishlist (updates both Mongo models).

router.put('/me/items/edit', function(req, res) {
  var editItem = req.body;
  var editItemId = editItem.id;

  var editItemName = editItem.name;
  var editItemLink = editItem.link;

  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    // var new = user.items.ObjectId.str;

    // cannot read property 'str' of undefined error needs to be fixed;
    User.update( {"items" : { $elemMatch: { "_id": editItemId.str }}},
    { "name": editItemName, "link": editItemLink },
    function(err, user) {
      if(err){
        res.status(400).send(err);
      }
      Item.update( {"_id": editItemId},
      { "name": editItemName,
      "link": editItemLink },
      function(err, item) {
        res.send(user);
      });
    });
  });
});

router.put('/me/items/order', function(req, res){
  var newUserItems = [];
  var newItemsOrder = req.body;
  var ourUser = req.user._id;

  for (var i = 0; i < newItemsOrder.length; i++){
    var mongoId = newItemsOrder[i]._id;
    newUserItems.push(mongoId);
  }

  User.findById(req.user, function(err, user){
    var userItems = user.items; 
    User.update({"_id": req.user}, {$set : {"items" : newUserItems}}, function(err, user){
      res.send(user)
    })
  })
})

// Favorite User's Wishlist
// router.put('/me/star', function(req, res){
//   console.log('favorites array to update', req.body.favorites)
//   console.log('@@@@@@req.user', req.user)
//   User.findById(req.user, function(err, user){
//     if (!user){
//       return res.status(400).send({messages: 'User Not Found'})
//     }
//     User.update({"favorites": {$push: {req}} })
//     console.log('!!!!!!!!!user in the robomongo', user)
//   })
// })


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
