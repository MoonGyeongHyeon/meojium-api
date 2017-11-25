var express = require('express');
var router = express.Router();
var pool = require('../db_pool');
var moment = require('moment');

router.post('/add', function(req, res, next) {
	var id = req.body.id;
	var nickname = req.body.nickname;

	pool.query('INSERT INTO user(id, nickname) VALUES(?, ?)', [id, nickname])
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
	var id = req.body.id;
	var nickname = req.body.nickname;

	pool.query('UPDATE user SET nickname=? WHERE id=?', [nickname, id])
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

router.post('/exist', function(req, res, next) {
	var id = req.body.id;

	pool.query('SELECT nickname FROM user WHERE id=?', [id])
	.then(function (row) {
		if (row.length == 0) {
			res.json({
				nickname: null
			});
		} else {
			res.json(row[0]);
		}
	})
	.catch(function (err) {
		res.json({
			code: -1,
			msg: err
		});
	});
});

router.post('/info', function(req, res, next) {
	var id = req.body.id;

	pool.query('SELECT count(b.user_id) AS favoriteCount, a.registered_date AS registeredDate FROM user AS a INNER JOIN favorite AS b ON a.id=b.user_id WHERE a.id=?', [id])
	.then(function (row) {
		var favoriteCount = row[0].favoriteCount;
		var registeredDate = row[0].registeredDate;
		pool.query('SELECT count(*) AS stampCount FROM stamp WHERE user_id=?', [id])
		.then(function (row) {
			registeredDate = moment(registeredDate).format('YYYY-MM-DD HH:mm:ss');

			res.json({
				favoriteCount: favoriteCount,
				stampCount: row[0].stampCount,
				registeredDate: registeredDate
			});
		})
		.catch(function (err) {
			res.json({
				code: -1,
				msg: err
			});
		});
	})
	.catch(function (err) {
		res.json({
			code: -1,
			msg: err
		});
	});
});

router.post('/close', function(req, res, next) {
	var id = req.body.id;
	pool.query('DELETE FROM user WHERE id=?', [id])
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
