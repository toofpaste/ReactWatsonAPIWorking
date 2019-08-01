

<h1 align="center" style="border-bottom: none;">🚀 IBM Watson Personality Insights Board Game AI</h1>
<p align="center">
  <a href="https://travis-ci.org/toofpaste/CapStonePlan.svg?branch=master">
    <img alt="Travis" src="https://travis-ci.org/toofpaste/CapStonePlan.svg?branch=master">
  </a>
</p>
</p>
The IBM Watson [Personality Insights][service_url] service uses linguistic analysis to extract cognitive and social characteristics from input text such as email, text messages, tweets, forum posts, and more. By deriving cognitive and social preferences, the service helps users to understand, connect to, and communicate with other people on a more personalized level. In this application this information is going to be used against you in a board game.


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
![alt text](https://i.imgur.com/9EKpWJT.png)

## User Interface
![alt text](https://i.imgur.com/zLkqouJ.png)
## Available Scripts

In the project directory, you will be able to run(CURRENTLY NOT RUNNING):

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.


## Directory structure (if using express)

```none
.
├── app.js                       // express entry point
├── config                       //(maybe) express configuration
│   ├── error-handler.js
│   ├── express.js
│   ├── i18n.js
│   ├── passport.js
│   └── security.js
├── helpers                      //(api) utility modules
│   ├── personality-insights.js
│   └── twitter-helper.js
├── manifest.yml
├── package.json
├── src
│   ├── css
│   ├── data                     // sample text and tweets
│   ├── fonts
│   ├── images
│   ├── YourPersonalityAI
│   ├── OtherPersonalityAI
│   └── gameboard
├── router.js                   //(maybe) express routes
├── server.js                   //(maybe) application entry point
├── test
└── views                       // ejs views
```

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

## Open Source @ IBM

Find more open source projects on the
[IBM Github Page](http://ibm.github.io/).

[service_url]: https://www.ibm.com/watson/services/personality-insights/
[create_twitter_app]: https://apps.twitter.com/app/new
