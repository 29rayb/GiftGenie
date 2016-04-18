'use strict';

const mongoose = require('mongoose'),
      jwt      = require('jwt-simple'),
      bcrypt   = require('bcryptjs'),
      moment   = require('moment'),
      CONFIG   = require('../config/auth');

let User, Schema = mongoose.Schema;

let userSchema = Schema({
  displayName: String,
  picture: String,
  facebook: String,
  wished: [{ type: Schema.Types.ObjectId }]
});

userSchema.methods.createJWT = function() {
  var payload = {
    sub: this._id,
    iat: moment().unix(),
    exp: moment().add(1, 'days').unix()
  };
  return jwt.encode(payload, process.env.JWT_SECRET);
};

// userSchema.methods.toggleWished = function(togId, cb){
//   var foundWishedIndex = this.wished.indexOf(togId);
//   if (foundWishedIndex===-1) {
//     this.wished.push(togId)
//   } else {
//     this.wished.splice([foundWishedIndex],1);
//   }
//   this.save(cb)
// }

User = mongoose.model('User', userSchema);
module.exports = User;
