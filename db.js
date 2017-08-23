// var mysql = require('mysql')
// var connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database : process.env.DB_NAME
// })

// connection.connect()

// module.exports = connection;

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://"+process.env.DB_USER+":"+process.env.DB_PASSWORD+"@"+process.env.DB_HOST+"/"+process.env.DB_NAME;
var _db;

module.exports = {

connectToServer: function( callback ) {
  MongoClient.connect( url, function( err, db ) {
    _db = db;
    return callback( err );
  } );
},

getDb: function() {
  return _db;
}
};