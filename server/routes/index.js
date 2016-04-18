'use strict';

let express = require('express');
let router = express.Router();
let path = require('path');

router.get('/', function(req, res){
  res.render('index');
});

module.exports = router
