var express = require('express');
var response = require('./response.json')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(response);
});

module.exports = router;
