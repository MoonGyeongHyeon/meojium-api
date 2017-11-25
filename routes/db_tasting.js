var express = require('express');
var router = express.Router();
var pool = require('../db_pool');
var moment = require('moment');

router.get('/', function(req, res, next) {
	pool.query('SELECT a.id, a.story_title, museum_id, name, intro, address, latitude, longitude, business_hours, day_off, fee, homepage, tel, found_date, image_path FROM story AS a INNER JOIN museum AS b ON a.museum_id=b.id ORDER BY rand() LIMIT 13')
	.then(function (rows) {
		var len = rows.length;

		for (var i=0; i<len; i++) {
			var id = rows[i].museum_id;
			var name = rows[i].name;
			var intro = rows[i].intro;
			var address = rows[i].address;
			var latitude = rows[i].latitude;
			var longitude = rows[i].longitude;
			var business_hours = rows[i].business_hours;
			var day_off = rows[i].day_off;
			var fee = rows[i].fee;
			var homepage = rows[i].homepage;
			var tel = rows[i].tel;

			rows[i].found_date = moment(rows[i].found_date).format('YYYY-MM-DD');

			var found_date = rows[i].found_date;
			var image_path = rows[i].image_path;

			delete rows[i].museum_id;
			delete rows[i].name;
			delete rows[i].intro;
			delete rows[i].address;
			delete rows[i].latitude;
			delete rows[i].longitude;
			delete rows[i].business_hours;
			delete rows[i].day_off;
			delete rows[i].fee;
			delete rows[i].homepage;
			delete rows[i].tel;
			delete rows[i].found_date;
			delete rows[i].daily_customer;
			delete rows[i].image_path;

			var museum = {
				'id': id,
				'name': name,
				'intro': intro,
				'address': address,
				'latitude': latitude,
				'longitude': longitude,
				'business_hours': business_hours,
				'day_off': day_off,
				'fee': fee,
				'homepage': homepage,
				'tel': tel,
				'found_date': found_date,
				'image_path': image_path
			};

			rows[i].museum = museum;
		}

		res.json(rows);
	})
	.catch(function (err) {
		console.dir(err);
		res.json({
			code: -1,
			msg: err
		});
	});
});


module.exports = router;
