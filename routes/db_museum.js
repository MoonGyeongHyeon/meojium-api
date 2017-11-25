var express = require('express');
var router = express.Router();
var pool = require('../db_pool');
var moment = require('moment');

router.get('/:id', function(req, res, next) {
	var id = req.params.id;
	pool.query('SELECT * FROM museum where id=? ', [id])
	.then(function (row) {
		row[0].found_date = moment(row[0].found_date).format('YYYY-MM-DD');

		res.json(row[0]);
	})
	.catch(function (err) {
		res.json({
			code: -1,
			msg: err
		});
	});
});

router.get('/list/all', function(req, res, next) {
	var startIndex = Number(req.query.start);
	var orderBy = req.query.order_by;

	var order = "";

	switch (orderBy) {
		case '101':
			order = 'daily_customer DESC';
			break;

		case '102':
			order = 'found_date';
			break;

		case '103':
			order = 'area DESC';
			break;
	}

	sql = 'SELECT * FROM museum ORDER BY ' + order + ' LIMIT ?, 10';

	pool.query(sql, [startIndex])
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

router.get('/list/popular', function(req, res, next) {
	pool.query('SELECT id, name, address, image_path FROM museum ORDER BY daily_customer DESC LIMIT 0, 10')
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

router.get('/:id/image', function(req, res, next) {
	var id = req.params.id;

	pool.query('SELECT path FROM image_museum WHERE museum_id=? ORDER BY path ASC', [id])
	.then(function (rows) {
		var len = rows.length;
		var array = Array();

		for (var i=0; i<len; i++) {
			array.push(rows[i].path);
		}

		res.json(array);
	})
	.catch(function (err) {
		res.json({
			code: -1,
			msg: err
		});
	});
});

router.get('/list/nearby', function(req, res, next) {
	var lat = req.query.latitude;
	var lon = req.query.longitude;
	var dist = req.query.distance;

	pool.query('SELECT *, (6371 * acos(cos(radians(?))*cos(radians(latitude))*cos(radians(longitude)-radians(?))+sin(radians(?))*sin(radians(latitude)))) AS distance FROM museum HAVING distance <= ? ORDER BY distance', [lat, lon, lat, dist])
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

router.get('/list/area', function(req, res, next) {
	pool.query('SELECT * FROM museum ORDER BY area DESC LIMIT 0, 6')
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
