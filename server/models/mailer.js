'use strict';

var mailer = require('../models/mailer');
var User = require('./user-model.js');

var apiKey = process.env.MAILGUN_KEY;
var domain = process.env.MAILGUN_DOMAIN;

var mailgun = require('mailgun-js')({
  apiKey: apiKey,
  domain: domain
});

var sender = 'team@giftgenie.com';

var mailer = {
  sendWelcome: function(user, cb) {
    var data = {
      from: sender,
      to: user.email,
      subject: 'Welcome to GiftGenie!',
      html: "<body><style>img {width: 60%; height:60%;}</style><img src='http://i.imgur.com/hoFCY3Y.png'></body>"
    };
    mailgun.messages().send(data, cb);
  }
}

module.exports = mailer;
