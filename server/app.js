'use strict';

var PORT = process.env.PORT || 3000;

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var authMiddleware = require('./util/auth-middleware');

var app = express();
app.set('view engine', 'jade');
app.set('views', "client");

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://127.0.0.1/public-wishlist-app');

// GENERAL MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.urlencoded( {extended: true} ));
app.use(express.static('client'));

// ROUTES
app.use('*', require('./routes/index'))

app.listen(PORT, function(){
  console.log('Listening on port ', PORT);
});