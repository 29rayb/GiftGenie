'use strict';

const mongoose = require('mongoose'),
      jwt      = require('jwt-simple'),
      moment   = require('moment');

let User, Schema = mongoose.Schema;

var Item = require('./item-model.js');


let userSchema = Schema({
  displayName: String,
  picture: String,
  facebook: String,
  email: String,
  birthday: String,
  favorites: [{type: Schema.Types.ObjectId, ref: "User"}],
  favoritedBy: [{type: Schema.Types.ObjectId, ref: "User"}],
  following: [{type: Schema.Types.ObjectId, ref: "User"}],
  followers: [{type: Schema.Types.ObjectId, ref: "User"}],
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  friends: Array,
  liked: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  // notifications: [{type: Schema.Types.ObjectId, ref: "User"}],
  private: {type: Boolean, default: false }
});

//This generates the JSON web token.
userSchema.methods.createJWT = function() {
  var payload = {
    sub: this._id,  //We're expected to be passing a Mongo UserId here!
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix()
  };
  return jwt.encode(payload, process.env.JWT_SECRET); //A token (string) is returned.
};

User = mongoose.model('User', userSchema);
module.exports = User;
