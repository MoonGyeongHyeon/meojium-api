var express = require('express');
var router = express.Router();
var pool = require('../db_pool');
var moment = require('moment');

router.get('/:id', function(req, res, next) {
	var museumId = req.params.id;
	var startIndex = Number(req.query.start);
	var count = Number(req.query.count);
	pool.query('SELECT a.id, b.nickname, a.content, a.registered_date FROM review AS a INNER JOIN user AS b ON a.user_id=b.id WHERE museum_id=? ORDER BY registered_date DESC LIMIT ?, ?', [museumId, startIndex, count])
	.then(function (rows) {
		var len = rows.length;
		for (var i=0; i<len; i++) {
			rows[i].registered_date = moment(rows[i].registered_date).format('YYYY-MM-DD');
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

router.post('/write', function(req, res, next) {
	var userId = req.body.user_id;
	var content = req.body.content;
	var museumId = Number(req.body.museum_id);

	pool.query('INSERT INTO review(user_id, content, museum_id) VALUES(?, ?, ?)', [userId, content, museumId])
	.then(function (row) {
		res.json({
			code: 1,
			msg: "OK",
			insertId: row.insertId
		});
	})
	.catch(function (err) {
		res.json({
			code: -1,
			msg: err
		});
	});
});

router.get('/delete/:id', function(req, res, next) {
	var id = req.params.id;

	pool.query('DELETE FROM review WHERE id=?', [id])
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
