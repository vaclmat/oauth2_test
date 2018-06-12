/*eslint-env node*/
//MARK: --------------- REQUIRED OBJECTS

/* Create the port that we’re connecting to */
const port = 8081;

/* Get a connection to the DB2 database */
//const myDB2Connection = require('./dbHelpers/myDB2Wrapper');

/* The bearerTokenDBHelper handles all of the database operations
relating to saving and retrieving oAuth2 bearer tokens */
const bearerTokensDBHelper =
                require('./dbHelpers/bearerTokensDBHelper');

/* The userDBHelper handles all of the database operations relating
to users such as registering and retrieving them */
const userDBHelper = require('./dbHelpers/userDBHelper');

/* We require the node-oauth2-server library */
const oAuth2Server = require('node-oauth2-server');

/* Here we instantiate the model we just made and inject the dbHelpers we use in it */
const oAuthModel = require('./authorisation/accessTokenModel')(userDBHelper, bearerTokensDBHelper);

/* This is a library used to help parse the body of the api requests. */
const bodyParser = require('body-parser');

//Require express
const express = require('/QOpenSys/QIBM/ProdData/OPS/Node6/bin/studentwa/node_modules/express');

//Initialise the express app
const expressApp = express();
expressApp.oauth = oAuth2Server({
    model: oAuthModel,
    grants: ['password'],
    debug: true
});


/* Here we require the authRoutesMethods object from the module
 that we just made */
const authRoutesMethods = require('./authorisation/authRoutesMethods')(userDBHelper);

/* Now we instantiate the authRouter module and inject all
of its dependencies. */
const authRouter = require('./authorisation/authRouter')(express.Router(), expressApp, authRoutesMethods);

/* require the functions that that will handle requests to 
the restrictedAreaRoutes */
const restrictedAreaRouterMethods = require('./restrictedArea/restrictedAreaRoutesMethods');

/* require the constructor for the restrictedAreaRouter.
The router will handle all requestts with a base url of: 'restrictedArea' */
const restrictedAreaRouterConstructor = require('./restrictedArea/restrictedAreaRoutes');

/* instantiate the restrictedAreaRouter using the restrictedAreaRouterConstructor */
const restrictedAreaRouter = restrictedAreaRouterConstructor(express.Router(), expressApp, restrictedAreaRouterMethods);


/* Here we asign the restrictedAreaRouter as middleware in the express app.
 By doing this all request sent to routes that start with /auth
 will be handled by this router*/
expressApp.use('/restrictedArea', restrictedAreaRouter);

 /* set the bodyParser to parse the urlencoded post data */
expressApp.use(bodyParser.urlencoded({ extended: true }));


/* Here we asign the authRouter as middleware in the express app.
 By doing this all request sent to routes that start with /auth
 will be handled by this router*/
expressApp.use('/auth', authRouter);

//set the oAuth errorHandler
expressApp.use(expressApp.oauth.errorHandler());


/* Now we instantiate the oAuth2Server and pass in an object which tells
the the password library that we're using the password  grant type and
give it the model we just required. */


//init the server
expressApp.listen(port, () => {

    console.log(`listening on port ${port}`);
});
