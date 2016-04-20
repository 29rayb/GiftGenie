'use strict';

const jwt    = require('jwt-simple'),
moment = require('moment'),
User   = require('../models/user-model');

module.exports = function(req, res, next) {
  console.log("authing route: ", req.url);

  if (!req.headers.authorization) {
    return res.status(401).send('authorization required 1');
  }

  let token = req.headers.authorization.replace('Bearer ', '');
  console.log(token, "***1**** TOKEN FROM AUTH MIDDLEWARE");

  try {
    var decoded = jwt.decode(token, process.env.JWT_SECRET);
    var mongoID  = decoded.sub;
    console.log(mongoID, "-----THIS IS THEM----MongoID");
    console.log(decoded, "****2****AUTH MIDDLEWARE - TOKEN HAS BEEN DECODED");
  } catch (e) {
    return res.status(401).send('authorization required 2');
  }

  if (decoded.exp < moment().unix()) {
    return res.status(401).send('authorization expired');
  } else {
    return decoded;
  }
};
