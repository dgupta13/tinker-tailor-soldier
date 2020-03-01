var express = require("express");
var response = require("./response.json");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res) {
  res.send(response);
});

module.exports = router;
