/*jshint node: true */
'use strict';

let PORT = process.env.PORT || 3000;
let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let mongoose = require('mongoose');
let authMiddleware = require('./config/authenticate');
let dotenv = require('dotenv').config({silent: true});
let cors = require('cors')
let app = express();
app.set('view engine', 'jade');
app.set('views', 'client');
app.use(cors());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/public-wishlist-app', function(err) {
  if (err) { console.log('Error connecting to Mongodb:', err); }
  console.log('Connected to MongoDB:');
});

// GENERAL MIDDLEWARE.
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('client'));

// ROUTES.
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/api', authMiddleware, require('./routes/api'));

app.listen(PORT, function() {
  console.log('Listening on port ', PORT);
});
