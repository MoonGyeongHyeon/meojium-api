var express = require('express');
var router = express.Router();
var pool = require('../db_pool');
var moment = require('moment');

router.get('/', function(req, res, next) {
	var keyword = req.query.keyword;
	var sql = "SELECT * FROM museum WHERE name LIKE '%" + keyword + "%' OR address LIKE '%" + keyword + "%'";
	pool.query(sql)
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

router.post('/add', function(req, res, next) {
	var userId = req.body.user_id;
	var keyword = req.body.keyword;
	
	pool.query('SELECT * FROM search WHERE user_id=? AND keyword=?', [userId, keyword])
	.then(function (row) {
		var len = row.length;
		if (len == 0) {
			pool.query('INSERT INTO search(user_id, keyword) VALUES(?, ?)', [userId, keyword])
			.then(function (row) {
				res.json({
					code: 1,
					msg: "OK"
				});
			});
		} else {
			pool.query('UPDATE search SET searched_date=now() WHERE user_id=? AND keyword=?', [userId, keyword])
			.then(function (row) {
				res.json({
					code: 1,
					msg: "OK"
				})
			});
		}
	})
	.catch(function (err) {
		res.json({
			code: -1,
			msg: err
		});
	});
});

router.post('/list', function(req, res, next) {
	var userId = req.body.id;
	pool.query('SELECT id, keyword, searched_date FROM search WHERE user_id=? ORDER BY searched_date DESC', [userId])
	.then(function (rows) {
		var len = rows.length;

		for (var i=0; i<len; i++) {
			rows[i].searched_date = moment(rows[i].searched_date).format('YYYY-MM-DD');
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

router.post('/delete', function(req, res, next) {
	var userId = req.body.id;
	pool.query('DELETE FROM search WHERE user_id=?', [userId])
	.then(function () {
		res.json({
			code: 1,
			msg: "OK"
		});
	})
	.catch(function (err) {
		res.json({
			code: -1,
			msg: err
		});
	});
});

router.post('/update', function(req, res, next) {
	var userId = req.body.id;
	var keyword = req.body.keyword;
	pool.query('UPDATE search SET searched_date=now() WHERE user_id=? AND keyword=?', [userId, keyword])
	.then(function () {
		res.json({
			code: 1,
			msg: "OK"
		});
	})
	.catch(function (err) {
		res.json({
			code: -1,
			msg: err
		});
	});
});

module.exports = router;
