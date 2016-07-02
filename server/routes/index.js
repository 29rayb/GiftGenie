'use strict';

let express = require('express');
let router = express.Router();

router.get('/', function(req, res){
  console.log("Hitting Index Route.");
  res.render('index');
});

module.exports = router
