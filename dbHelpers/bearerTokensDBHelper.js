/*eslint-env node */

module.exports.saveAccessToken = saveAccessToken;
module.exports.getUserIDFromBearerToken = getUserIDFromBearerToken;

/**
 * Saves the accessToken against the user with the specified userID
 * It provides the results in a callback which takes 2 parameters:
 *
 * @param accessToken
 * @param userID
 * @param callback - takes either an error or null if we successfully saved the accessToken
 */
function saveAccessToken(accessToken, userID, callback) {
/*
  const getUserQuery =  `INSERT INTO STUDENTRSC.access_tokens (acs_token, userID) VALUES ("${accessToken}", ${userID}) ON DUPLICATE KEY UPDATE acs_token = "${accessToken}";`;

  //execute the query to get the user
  myDB2Connection.query(getUserQuery, (dataResponseObject) => {

      //pass in the error which may be null and pass the results object which we get the user from if it is not null
      callback(dataResponseObject.error);
  });
*/
  const db = require('../../Node_v6_tests/node_modules/idb-connector');
  var dbconn = new db.dbconn();
  dbconn.conn("*LOCAL");
  var stmt = new db.dbstmt(dbconn);
  var queryString = "call STUDENTRSC.ADD_KEY(?,?,?)";
  var httpSts;
  stmt.prepare(queryString, (perror) => {
  	if (perror !== undefined) {
      console.log("Prepare error code: " + perror);
  	} else {
  		stmt.bindParam([
  		  [userID, db.SQL_PARAM_INPUT, 2],
  		  [accessToken, db.SQL_PARAM_INPUT, 1],
  		  [httpSts, db.SQL_PARAM_OUTPUT, 2],
  		], (berror)  => {
  		   if (berror !== undefined) {
              console.log("Prepare error code: " + berror);
  	       } else {
  			  stmt.execute((aresults, aerror) => {
  			  	console.log('DB2: query: error is: ', aerror, ' and results are: ', aresults);
  			  	const fsqlobject = (dataResponseObject) => {
  			  	console.log("fsqlobject: " + dataResponseObject.error);
                callback && callback(dataResponseObject.error);};
                fsqlobject(createDataResponseObject(aerror, aresults));
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
 * Retrieves the userID from the row which has the spcecified bearerToken. It passes the userID
 * to the callback if it has been retrieved else it passes null
 *
 * @param bearerToken
 * @param callback - takes the user id we if we got the userID or null to represent an error
 */
function getUserIDFromBearerToken(bearerToken, callback){
/*
  //create query to get the userID from the row which has the bearerToken
  const getUserIDQuery = `SELECT * FROM STUDENTRSC.access_tokens WHERE acs_token = '${bearerToken}';`;

  //execute the query to get the userID
  myDB2Connection.query(getUserIDQuery, (dataResponseObject) => {

      //get the userID from the results if its available else assign null
      const userID = dataResponseObject.results !== null && dataResponseObject.results.length === 1 ?
                                                              dataResponseObject.results[0].userID : null;

      callback(userID);
  });
  */
  const db = require('../../Node_v6_tests/node_modules/idb-connector');
  var dbconn = new db.dbconn();
  dbconn.conn("*LOCAL");
  var stmt = new db.dbstmt(dbconn);

  var doesUserExistQuery = "call STUDENTRSC.GET_KEY(?,?,?)";
  var httpStat;
  var user_id;
  stmt.prepare(doesUserExistQuery, (perror) => {
  	if (perror !== undefined) {
      console.log("Prepare error code: " + perror);
  	} else {
  		stmt.bindParam([
  		  [bearerToken, db.SQL_PARAM_INPUT, 1],
  		  [user_id, db.SQL_PARAM_OUTPUT, 2],
  		  [httpStat, db.SQL_PARAM_OUTPUT, 2],
  		], (berror)  => {
  		   if (berror !== undefined) {
              console.log("Prepare error code: " + berror);
  	       } else {
  			  stmt.execute((fresults, ferror) => {
  			  	console.log('DB2: query: error is: ', ferror, ' and results are: ', fresults);
  			  	const fsqlobject = (dataResponseObject) => {
  			  		const userid = dataResponseObject.results !== null && dataResponseObject.results.length === 2 ?  dataResponseObject.results[0] : null;
  			  	   console.log("Length: " + dataResponseObject.results.length); console.log("user: " + userid);

  			  	console.log("fsqlobject: " + userid);
                callback && callback(userid);};
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

function createDataResponseObject(error, results) {

    return {
      error: error,
      results: results === undefined ? null : results === null ? null : results
     };
}