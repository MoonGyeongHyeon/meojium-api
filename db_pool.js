var config = require('./config.json');
var promiseMysql = require('promise-mysql');
var pool  = promiseMysql.createPool({
	connectionLimit : config.connectionLimit,
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database
});

module.exports = pool;
