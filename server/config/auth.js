'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');


/*
|-----------------------------------------------
| Login Required Middleware:                   |
|-----------------------------------------------
*/

//This is what allows us to have 'protected routes' - i.e. All the '/user' routes, coz we have our Middleware in here.
function ensureAuthenticated(req, res, next) {
  //Checking for authorisation header - coz Satellizer will intercept all outgoing requests & append JSON Web Token to headers.
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }

  var token = req.headers.authorization.split(' ')[1];
  console.log("********** THIS IS THE TOKEN ******", token);
  var payload = null;
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET);
  }
  catch (err) {
    return res.status(401).send({ message: err.message });
  }
  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  req.user = payload.sub; //MONGO ID.
  console.log("THIS IS THE MONGO ID:", req.user);
  next();
}

module.exports = ensureAuthenticated;
