/*eslint-env node */

module.exports.registerUserInDB = registerUserInDB;
module.exports.getUserFromCrentials = getUserFromCrentials;
module.exports.doesUserExist = doesUserExist;

//  myDB2Connection = injectedmyDB2Connection;



/**
 * attempts to register a user in the DB with the specified details.
 * it provides the results in the specified callback which takes a
 * DataResponseObject as its only parameter
 *
 * @param username
 * @param password
 * @param registrationCallback - takes a DataResponseObject
 */
function registerUserInDB(userid, username, password, registrationCallback){
/*
  //create query using the data in the req.body to register the user in the db
  const registerUserQuery = `INSERT INTO STUDENTRSC.users (userID, userName,  password) VALUES ('${userid}', '${username}', SHA('${password}'))`;

  //execute the query to register the user
  myDB2Connection.query(registerUserQuery, registrationCallback);
*/
  const db = require('../../Node_v6_tests/node_modules/idb-connector');
  const SHA = require('js-sha256');
  var dbconn = new db.dbconn();
  dbconn.conn("*LOCAL");
  var stmt = new db.dbstmt(dbconn);
  var queryString = "call STUDENTRSC.ADD_USERT(?,?,?,?)";
  var httpSts;
  var s_password = SHA(password);
  console.log("s_password: " + s_password);
  stmt.prepare(queryString, (perror) => {
  	if (perror !== undefined) {
      console.log("Prepare error code: " + perror);
  	} else {
  		stmt.bindParam([
  		  [userid, db.SQL_PARAM_INPUT, 2],
  		  [username, db.SQL_PARAM_INPUT, 1],
  		  [s_password, db.SQL_PARAM_INPUT, 1],
  		  [httpSts, db.SQL_PARAM_OUTPUT, 2],
  		], (berror)  => {
  		   if (berror !== undefined) {
              console.log("Prepare error code: " + berror);
  	       } else {
  			  stmt.execute((aresults, aerror) => {
  			  	console.log('DB2: query: error is: ', aerror, ' and results are: ', aresults);
  			  	registrationCallback && registrationCallback(createDataResponseObject(aerror, aresults));
                stmt.close();
                dbconn.disconn();
                dbconn.close();
  			  });
  			}  
  		});
  	}
  });
}

/**
 * Gets the user with the specified username and password.
 * It provides the results in a callback which takes an:
 * an error object which will be set to null if there is no error.
 * and a user object which will be null if there is no user
 *
 * @param username
 * @param password
 * @param callback - takes an error and a user object
 */
function getUserFromCrentials(username, password, callback) {
/*
  //create query using the data in the req.body to register the user in the db
  const getUserQuery = `SELECT * FROM STUDENTRSC.users WHERE userName = '${username}' AND password = SHA('${password}')`;

  console.log('getUserFromCrentials query is: ', getUserQuery);

  //execute the query to get the user
  myDB2Connection.query(getUserQuery, (dataResponseObject) => {

      //pass in the error which may be null and pass the results object which we get the user from if it is not null
      callback(false, dataResponseObject.results !== null && dataResponseObject.results.length  === 1 ?  dataResponseObject.results[0] : null);
  });
*/  
  const db = require('../../Node_v6_tests/node_modules/idb-connector');
  const SHA = require('js-sha256');
  //myDB2Connection.doesUserExist = null;
  
  var dbconn = new db.dbconn();
  dbconn.conn("*LOCAL");
  var stmt = new db.dbstmt(dbconn);

  var doesUserExistQuery = "call STUDENTRSC.GET_USERWP(?,?,?,?,?,?)";
  var httpStat;
  var user_id;
  var pass_word;
  var s_passwordg = SHA(password);
  stmt.prepare(doesUserExistQuery, (perror) => {
  	if (perror !== undefined) {
      console.log("Prepare error code: " + perror);
  	} else {
  		stmt.bindParam([
  		  [username, db.SQL_PARAM_INPUT, 1],
  		  [s_passwordg, db.SQL_PARAM_INPUT, 1],
  		  [user_id, db.SQL_PARAM_OUTPUT, 2],
  		  [username, db.SQL_PARAM_OUTPUT, 1],
  		  [pass_word, db.SQL_PARAM_OUTPUT, 1],
  		  [httpStat, db.SQL_PARAM_OUTPUT, 2],
  		], (berror)  => {
  		   if (berror !== undefined) {
              console.log("Prepare error code: " + berror);
  	       } else {
  			  stmt.execute((fresults, ferror) => {
  			  	console.log('DB2: query: error is: ', ferror, ' and results are: ', fresults);
  			  	const fsqlobject = (dataResponseObject) => {
  			  		const userid = dataResponseObject.results.length  === 4 ?  dataResponseObject.results[0] : null;
  			  	   console.log("Length: " + dataResponseObject.results.length); console.log("user: " + userid);

  			  	console.log("fsqlobject: " + userid);
                callback && callback(false, userid);};
                fsqlobject(createDataResponseObject(ferror, fresults));
                stmt.close();
                dbconn.disconn();
                dbconn.close();
  			  });
  			}  
  		});
  	}
  });  
}

/**
 * Determines whether or not user with the specified userName exists.
 * It provides the results in a callback which takes 2 parameters:
 * an error object which will be set to null if there is no error, and
 * secondly a boolean value which says whether or the user exists.
 * The boolean value is set to true if the user exists else it's set
 * to false or it will be null if the results object is null.
 *
 * @param username
 * @param callback - takes an error and a boolean value indicating
 *                   whether a user exists
 */
function doesUserExist(username, dUEcallback) {
/*
  //create query to check if the user already exists
  const doesUserExistQuery = `SELECT * FROM users WHERE username = '${username}'`;
  console.log("doesUserExists function");
  console.log("username: " + username);

  //holds the results  from the query
  const sqlCallback = (dataResponseObject) => {

      //calculate if user exists or assign null if results is null
      const doesUserExist = dataResponseObject.results !== null ? dataResponseObject.results.length > 0 ? true : false : null;

      //check if there are any users with this username and return the appropriate value
      callback(dataResponseObject.error, doesUserExist);
  };

  //execute the query to check if the user exists
  myDB2Connection.query(doesUserExistQuery, sqlCallback);
*/
  const db = require('../../Node_v6_tests/node_modules/idb-connector');
  //myDB2Connection.doesUserExist = null;
  
  var dbconn = new db.dbconn();
  dbconn.conn("*LOCAL");
  var stmt = new db.dbstmt(dbconn);

  var doesUserExistQuery = "call STUDENTRSC.GET_USERT(?,?,?,?,?)";
  var httpStat;
  var user_id;
  var pass_word;
  stmt.prepare(doesUserExistQuery, (perror) => {
  	if (perror !== undefined) {
      console.log("Prepare error code: " + perror);
  	} else {
  		stmt.bindParam([
  		  [username, db.SQL_PARAM_INPUT, 1],
  		  [user_id, db.SQL_PARAM_OUTPUT, 2],
  		  [username, db.SQL_PARAM_OUTPUT, 1],
  		  [pass_word, db.SQL_PARAM_OUTPUT, 1],
  		  [httpStat, db.SQL_PARAM_OUTPUT, 2],
  		], (berror)  => {
  		   if (berror !== undefined) {
              console.log("Prepare error code: " + berror);
  	       } else {
  			  stmt.execute((gresults, gerror) => {
  			  	console.log('DB2: query: error is: ', gerror, ' and results are: ', gresults);
//  			  	callback(createDataResponseObject(error, results));

               console.log("httpStat: " + gresults[3]);
               const sqlCallback = (dataResponseObject) => {

                //calculate if user exists or assign null if results is null
                  console.log("doesUserExist: " + dataResponseObject.results[3]);
                  const doesUserExist = dataResponseObject.results[3] === 100 ? false : true;
                  if (!doesUserExist) {
                  	console.log("doesUserExist is false");
                  } else {
                  	console.log("doesUserExist is true");
                  }
               //check if there are any users with this username and return the appropriate value
 //                 callback();
                  dUEcallback && dUEcallback(dataResponseObject.error, doesUserExist);
               };
               sqlCallback(createDataResponseObject(gerror, gresults));
               console.log("After");
                stmt.close();
                dbconn.disconn();
                dbconn.close();
  			  });
  			}  
  		});
  	}
  });
}

function createDataResponseObject(error, results) {

    return {
      error: error,
      results: results === undefined ? null : results === null ? null : results
     };
}