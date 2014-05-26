var mongodb = require("mongodb"), poolModule = require('generic-pool');
var settings = require('../settings')[process.env.NODE_ENV || 'dev'];
var pool = poolModule.Pool({
  name : 'mongodb',
  create : function (callback) {
    mongodb.MongoClient.connect('mongodb://' + settings.mongodb.host + ':'
        + settings.mongodb.port + '/' + settings.mongodb.db, {
      server : {
        poolSize : 1
      }
    }, function (err, db) {
    	console.info("db is:%s",db);
    	callback(err, db);
    });
  },
  destroy : function (db) {
    db.close();
  }
});
module.exports = pool;
