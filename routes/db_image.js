var express = require('express');
var router = express.Router();
var pool = require('../db_pool');
var moment = require('moment');

router.get('/list/popular', function(req, res, next) {
	pool.query('SELECT * FROM museum ORDER BY daily_customer DESC LIMIT 0, 10')
	.then(function (rows) {
		var len = rows.length;
		for (var i=0; i<len; i++) {
			rows[i].found_date = moment(rows[i].found_date).format('YYYY-MM-DD');
		}

		res.json(rows);
	})
	.catch(function (err) {
		res.json({
			code: -1,
			msg: err
		});
	});
});

router.get('/list/history', function(req, res, next) {
	pool.query('SELECT * FROM museum ORDER BY found_date LIMIT 0, 10')
	.then(function (rows) {
		var len = rows.length;
		for (var i=0; i<len; i++) {
			rows[i].found_date = moment(rows[i].found_date).format('YYYY-MM-DD');
		}

		res.json(rows);
	})
	.catch(function (err) {
		res.json({
			code: -1,
			msg: err
		});
	});
});

module.exports = router;
