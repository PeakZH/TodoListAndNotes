var mysql = require("mysql");
var settings = require('../settings')[process.env.NODE_ENV || 'dev'];
var mysqlPool = mysql.createPool(settings.mysqldb);
module.exports = mysqlPool;
