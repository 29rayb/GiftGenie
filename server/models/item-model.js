'use strict';
var mongoose = require('mongoose');
var User = require('./user-model.js');
var Schema = mongoose.Schema;

var Item;

var itemSchema = Schema({
  link: String,
  name: String,
  // liked: {type: Schema.Types.ObjectId, ref: "User"},
  // likedByFriends: [{type: Schema.Types.ObjectId, ref: 'User'}],
  user: {type: Schema.Types.ObjectId, ref: "User"}
});

itemSchema.statics.submit = function(item, cb) {
  var link = item.link;
  var name = item.name;
  var userId = item.user;

  var User = mongoose.model('User');

  User.findOne({"_id" : userId}, function(err, user) {
    var addedItem = {
      link: link,
      name: name,
      user: userId
    };

    var newItem = new Item(addedItem);
    newItem.save(function(err, savedItem){
      cb(err, savedItem);
    });
  })
}

Item = mongoose.model('Item', itemSchema);

module.exports = Item;
