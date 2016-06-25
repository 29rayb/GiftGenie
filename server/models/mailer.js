'use strict';

var apiKey = process.env.MAILGUN_KEY;
var domain = process.env.MAILGUN_DOMAIN;
var mailgun = require('mailgun-js')({
  apiKey: apiKey,
  domain: domain
});

var mailer = require('../models/mailer');
var User = require('./user-model.js');

var sender = 'team@giftgenie.com';

var mailer = {
  sendWelcome: function(user, cb) {
    var data = {
      from: sender,
      to: user.email,
      subject: 'Welcome to GiftGenie!',
      text: 'Welcome to the GiftGenie.'
    };
    mailgun.messages().send(data, cb);
  }
}


module.exports = mailer;
