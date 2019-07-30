module.exports = personality
const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');


function personality(username) {
    return new Promise(function(resolve, reject) {
        var Twit = require('twit')
        var watson = require('watson-developer-cloud')

        require('dotenv').config()

        var T = new Twit({
            consumer_key: process.env.CONSUMER_KEY,
            consumer_secret: process.env.CONSUMER_SECRET,
            access_token: process.env.ACCESS_TOKEN_KEY,
            access_token_secret: process.env.ACCESS_TOKEN_SECRET,
            timeout_ms: 60*1000
        })

        var personality_insights = new PersonalityInsightsV3({
            // If unspecified here, the PERSONALITY_INSIGHTS_USERNAME and
            // PERSONALITY_INSIGHTS_PASSWORD env properties will be checked
            // After that, the SDK will fall back to the bluemix-provided
            // VCAP_SERVICES environment property
            // username: '<username>',
            // password: '<password>',
            version: '2017-10-13',
        });
        ;    console.log(personality_insights);

        var tpath = getUserHandle(username).tpath
        var options = getUserHandle(username).options

        T.get(tpath, options, function(error, data) {
            if (error) return reject(error)
            var tweets = []
            for (var i = 0; i < data.length; i++) {
                tweets.push(data[i].text);
            }


            var textToAnalyze = tweets.join(' ');
            personality_insights.profile({
                    text: textToAnalyze },
                function (err, response) {
                    if (error) return reject(error)
                    else
                        var personalityProfile = {
                            traits: response.personality,
                            needs: response.needs
                        }
                    resolve (personalityProfile)
                })
        })
    })
}

///////////
function getUserHandle(query) {
    var options = {
        screen_name: query,
        count: 200,
        include_rts: false
    }
    var tpath = 'statuses/user_timeline'

    return {
        options: options,
        tpath: tpath
    }
}
