var express = require('express');
var router = express.Router();
var pool = require('../db_pool');
var moment = require('moment');

router.post('/list', function(req, res, next) {
	var id = req.body.id;
	var startIndex = Number(req.query.start);
	pool.query('SELECT * FROM favorite AS a INNER JOIN museum AS b ON a.museum_id=b.id WHERE user_id=? LIMIT ?, 10', [id, startIndex])
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

router.post('/checked', function(req, res, next) {
	var userId = req.body.user_id;
	var museumId = req.body.museum_id;
	pool.query('SELECT count(*) As count FROM favorite WHERE user_id=? AND museum_id=?', [userId, museumId])
	.then(function (row) {
		var count = row[0].count;

		if (count == 0) {
			res.json({
				code: 1,
				msg: "Empty"
			});
		} else {
			res.json({
				code: 1,
				msg: "OK"
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

router.post('/add', function(req, res, next) {
	var userId = req.body.user_id;
	var museumId = req.body.museum_id;
	pool.query('INSERT INTO favorite VALUES(?, ?)', [userId, museumId])
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

router.post('/delete', function(req, res, next) {
	var userId = req.body.user_id;
	var museumId = req.body.museum_id;
	pool.query('DELETE FROM favorite WHERE user_id=? AND museum_id=?', [userId, museumId])
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
