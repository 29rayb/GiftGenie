'use strict';

var express = require('express');
var router = express.Router();

var qs = require('querystring');
var jwt = require('jwt-simple');
var request = require('request');

var User = require('../models/user-model');
var mailer = require('../models/mailer');

/*
|-----------------
| Facebook Auth:  |
|-----------------
*/

router.post('/facebook', function(req, res) {
  var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name', 'education', 'birthday', 'friends'];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: process.env.FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri
  };
  console.log('params', params)

  // STEP 1. Exchange authorization code for access token. (We are making a request to Facebook API using this code!)
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    var storedAccessToken = accessToken;
    if (response.statusCode !== 200) {
      return res.status(500).send({ message: accessToken.error.message });
    }

  // STEP 2. Retrieve profile information about the current user.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      console.log('THIS IS THE FACEBOOK PROFILE:', profile);

      if (response.statusCode !== 200) {
        return res.status(500).send({ message: profile.error.message });
      }

      if (req.headers.authorization) {
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          //Scenario a):
          if (existingUser) {
            return res.status(400).send({ message: 'There is already a Facebook account that belongs to you' });
          }

          //Scenario b):
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, process.env.JWT_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.facebook = profile.id;
            user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            user.displayName = user.displayName || profile.name;
            user.email = user.email || profile.email;
            user.birthday = user.birthday || profile.birthday;
            user.friends = user.friends.data || profile.friends.data;
            user.save(function() {
              var token = user.createJWT();
              res.send({ token: token, user:user });
            });
          });
        });
      } else {

        // STEP 3. Create a new user account OR Return an existing one.
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          // Scenario a):
          if (existingUser) {
            var token = existingUser.createJWT();
            return res.send({ token: token, user: user });
          }
          //Scenario b):
          var user = new User();
          user.facebook = profile.id;
          user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.displayName = profile.name;
          user.email = profile.email;
          user.birthday = profile.birthday;
          user.friends = profile.friends.data;
          user.save(function() {
            mailer.sendWelcome(user, function(err, body) {
              console.log('********Sending the mailgun email.', body);
            })
            var token = user.createJWT();
            res.send({ token: token });
          });
        });
      }
    });
  });
});


module.exports = router;
