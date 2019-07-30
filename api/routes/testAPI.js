var express = require("express");
var router = express.Router();
const personality = require('watson-personality')
let hold = [];
personality('@realDonaldTrump')
    .then(function(personalityProfile) {
        hold.push(personalityProfile.traits);
        hold.push(personalityProfile.needs);
    })
    .catch(function(error) {
        console.log(error)
    })


router.get("/", function(req, res, next) {
    res.send(hold);
});

module.exports = router;
