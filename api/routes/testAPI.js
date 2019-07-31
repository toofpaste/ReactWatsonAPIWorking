var express = require("express");
var router = express.Router();
const personality = require('watson-personality')
let hold = [];
// personality('@realDonaldTrump')
//     .then(function(personalityProfile) {
//         hold.push(personalityProfile.traits);
//         hold.push(personalityProfile.needs);
//     })
//     .catch(function(error) {
//         console.log(error)
//     })


router.get("/", function(req, res, next) {
    if(req.query.name){
        personality(req.query.name)
            .then(function(personalityProfile) {
                hold.push(personalityProfile.traits);
                hold.push(personalityProfile.needs);
                res.send(personalityProfile);
            })
            .catch(function(error) {
                console.log(error)
            })

    }

});

module.exports = router;


// "personality","percentile":0.8985182042077362
// "personality","percentile":0.8985182042077362
// :"Emotionality","category":"personality","percentile":0.05946920158092983
// "Emotionality","category":"personality","percentile":0.05946920158092983

