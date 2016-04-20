'use strict';

let express = require('express');
let router = express.Router();
// let path = require('path');

router.get('/', function(req, res){
  console.log("INDEX ROUTE");
  res.render('index');
});

module.exports = router
