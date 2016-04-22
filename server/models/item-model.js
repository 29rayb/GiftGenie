'use strict';

var mongoose = require('mongoose');
var User = require('./user-model.js');
var Schema = mongoose.Schema;

var Item;

var itemSchema = Schema({
  link: String,
  name: String,
  user: {type: Schema.Types.ObjectId, ref: "User"}
});

itemSchema.statics.submit = function(item, cb) {
  var link = item.link;
  var name = item.name;

  console.log("___#2___We're grabbing the item values. (Item Model method!)");

  var addedItem = {
    link: link,
    name: name
  };

  var newItem = new Item(addedItem);
  console.log('___#3___This is the new item! (Item model method.)', newItem);

  newItem.save(function(err, savedItem){
    console.log('___#4___Saving new item to Item collection in Mongo.', savedItem);
    cb(err, savedItem);
  });
}

Item = mongoose.model('Item', itemSchema);

module.exports = Item;
