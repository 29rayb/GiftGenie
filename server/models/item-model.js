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
  var User = mongoose.model('User');

    var addedItem = {
      link: item.link,
      name: item.name,
    };

    var newItem = new Item(addedItem);
    console.log(newItem, 'NEW ITEM');

    newItem.save(function(err, savedItem){
      console.log('New item.');
      cb(err, savedItem);
      User.findByIdAndUpdate(user._id, { $push: { item : addedItem }}, function(err, user) {
        console.log(addedItem, "THE ITEM AHHAHAUHHUA");
        if(err){
          res.status(400).send(err);
        }
      });
    });
}

Item = mongoose.model('Item', itemSchema);

module.exports = Item;
