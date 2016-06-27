'use strict';

var apiKey = process.env.MAILGUN_KEY;
var domain = process.env.MAILGUN_DOMAIN;
var mailgun = require('mailgun-js')({
  apiKey: apiKey,
  domain: domain
});

var mailer = require('../models/mailer');
var User = require('./user-model.js');

var sender = 'support@giftgenie.com';

var mailer = {
  sendWelcome: function(user, cb) {
    var data = {
      from: sender,
      to: user.email,
      subject: 'Welcome to GiftGenie!',
      html: "<body><style>body {background-color: #554B4B; text-align:center; border: 5px solid black; font-family:Futura;} h1 {color:white;} h3 {color: #29DCDE} p {color: #29DCDE} h5 {color: lightblue}</style><img src='http://i.imgur.com/vyieP85.png'><h1>Welcome from the Gift Genie team!</h1> <br> <h3>Create your gift wishlist & view your Facebook friends wishlists.</h3> <br> <h1> No more unwanted gifts.</h1> <br> <p>If you have feedback on new features we should add to the app, or comments on it's design & performance, we'd love to hear from you.</p><h5>team@giftgenie.com</h5></body>"
    };
    mailgun.messages().send(data, cb);
  }
}


module.exports = mailer;
