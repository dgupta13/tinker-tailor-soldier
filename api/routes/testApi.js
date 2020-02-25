var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
    res.send("Api is working properly");
});

module.exports = router;