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
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  friends: Array,
  liked: [{ type: Schema.Types.ObjectId, ref: "Item" }]
});

//This generates the JSON web token.
userSchema.methods.createJWT = function() {
  var payload = {
    sub: this._id,  //We're expected to be passing a Mongo UserId here!
    iat: moment().unix(), //Issued at - the time the token was generated.
    exp: moment().add(7, 'days').unix()  //Expiry at.
  };
  return jwt.encode(payload, process.env.JWT_SECRET);
  console.log(payload, "This is the MongoID from the payload - user model method.");
  //It returns a token string.
};

//The only time we'll be calling this 'create JWT' method is on the User object. (i.e. In auth.js route.)

User = mongoose.model('User', userSchema);
module.exports = User;
