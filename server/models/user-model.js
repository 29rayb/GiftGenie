'use strict';

const mongoose = require('mongoose'),
      jwt      = require('jwt-simple'),
      bcrypt   = require('bcryptjs'),
      moment   = require('moment'),
      CONFIG   = require('../config/auth');

let User, Schema = mongoose.Schema;

let userSchema = Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true}
  email: {type: String, default: ' '},
  wished: [{ type: Schema.Types.ObjectId, ref: 'User'}]
});

userSchema.methods.token = function(){
  let payload = {
    id: this._id,
    iat: moment().unix(),
    exp: moment().add(CONFIG.expTime.num, CONFIG.expTime.unit).unix();
  };
  return jwt.encode(payload, process.env.JWT_SECRET);
};

userSchema.statics.login = function(userinfo, cb){
  User.findOne({username: userinfo.username})
  .exec((err, foundUser) => {
    if (err) return cb('server error');
    if (!foundUser) return cb('incorrect username or password');
    bcrypt.compare(userInfo.password, foundUser.password, (err, isGood) => {
      if (err) console.log("bcrypt error");
      if (err) return cb('server err');
      if (isGood) {
        return cb(null, foundUser);
      } else {
        return cb('incorrect username or password');
      }
    });
  });
}

userSchema.statics.register = function(userinfo, cb) {
  let username  = userinfo.username
    , password  = userinfo.password
    , password2 = userinfo.password2;

  if (password !== password2) {
    return cb("passwords don't match");
  }

  if (!CONFIG.validatePassword(password)) {
    return cb('invalid password');
  }

  if (!CONFIG.validateUsername(username)) {
    return cb('invalid username');
  }

  User.findOne({username: username}, (err, user) => {
    if (err) return cb('error registering username');
    if (user) return cb('username taken');
    bcrypt.genSalt(CONFIG.saltRounds, (err, salt) => {
      if (err) return cb(err);
      bcrypt.hash(password, salt, (err, hashedPassword) => {
        if (err) return cb(err);
        let newUser = new User({
          username: username,
          password: hashedPassword
        });
        console.log("saving admin user", newUser);
        newUser.save((err, savedUser) => {
          return cb(err, savedUser);
        })
      });
    });
  }).populate('avatar');
};

userSchema.methods.toggleWished = function(togId, cb){
  var foundWishedIndex = this.wished.indexOf(togId);
  if (foundWishedIndex===-1) {
    this.wished.push(togId)
  } else {
    this.wished.splice([foundWishedIndex],1);
  }
  this.save(cb)
}

User = mongoose.model('User', userSchema);
module.exports = User;
