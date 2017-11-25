var express = require('express');
var router = express.Router();
var pool = require('../db_pool');
var fs = require('fs');
var XLSX = require('xlsx');
//var workbook = XLSX.readFile('/home/ubuntu/node/routes/museum_data.xlsx');
//var workbookTitle = XLSX.readFile('/home/ubuntu/node/routes/keyword_title.xlsx');
var workbookContent = XLSX.readFile('/home/ubuntu/node/routes/keyword_content.xlsx');
//var workbookImage = XLSX.readFile('/home/ubuntu/node/routes/title_image.xlsx');

router.get('/', function(req, res, next) {
	var first_sheet_name = workbook.SheetNames[0];
	var worksheet = workbook.Sheets[first_sheet_name];
	
	for (var i=3; i<=70; i++) {
   	 	var cell_name = 'A' + i;
    		var cell_intro = 'B' + i;
    		var cell_address = 'C' + i;
   	 	var cell_latitude = 'D' + i;
    		var cell_longitude = 'E' + i;
   	 	var cell_business_hours = 'F' + i;
   	 	var cell_day_off = 'G' + i;
    		var cell_fee1 = 'H' + i;
    		var cell_fee2 = 'I' + i;
    		var cell_fee3 = 'J' + i;
    		var cell_homepage = 'K' + i;
    		var cell_tel = 'L' + i;
		var cell_found = 'M' + i;
		var cell_daily = 'N' + i;
		var cell_image = 'O' + i;
		var cell_area = 'P' + i;

		var name = "";
		var intro = "";
		var address = "";
		var latitude = "";
		var longitude = "";
		var business_hours ="";
		var day_off ="";
		var fee = "";
		var fee1 = "";
		var fee2 = "";
		var fee3 = "";
		var homepage = "";
		var tel = "";
		var found = "";
		var daily = "";
		var image = "";
		var area = "";
	
		console.log(cell_name);
    		var desired_cell = worksheet[cell_name];
	
		if (typeof desired_cell !== 'undefined') {
			name = desired_cell.v;
		}

      		desired_cell = worksheet[cell_intro];
      		if (typeof desired_cell !== 'undefined') {

         	 	intro = desired_cell.v;
      		}

      		desired_cell = worksheet[cell_address];

      		if (typeof desired_cell !== 'undefined') {

          		address = desired_cell.v;
      		}

      		desired_cell = worksheet[cell_latitude];

      		if (typeof desired_cell !== 'undefined') {

          		latitude = desired_cell.v;
      		}

      		desired_cell = worksheet[cell_longitude];
      		if (typeof desired_cell !== 'undefined') {
          		longitude = desired_cell.v;
     		}

      		desired_cell = worksheet[cell_business_hours];
      		if (typeof desired_cell !== 'undefined') {

          		business_hours = desired_cell.v;
      		}

      		desired_cell = worksheet[cell_day_off];
      		if (typeof desired_cell !== 'undefined') {

          		day_off = desired_cell.v;
      		}

      		desired_cell = worksheet[cell_fee1];
      		if (typeof desired_cell !== 'undefined') {
          		fee1 = desired_cell.v;
      		}

      		desired_cell = worksheet[cell_fee2];
      		if (typeof desired_cell !== 'undefined') {
          		fee2 = desired_cell.v;
      		}

      		desired_cell = worksheet[cell_fee3];
      		if (typeof desired_cell !== 'undefined') {
          		fee3 = desired_cell.v;
      		}

      		desired_cell = worksheet[cell_homepage];
      		if (typeof desired_cell !== 'undefined') {

         		homepage = desired_cell.v;
      		}

      		desired_cell = worksheet[cell_tel];
      		if (typeof desired_cell !== 'undefined') {

          		tel = desired_cell.v;
      		}

      		desired_cell = worksheet[cell_found];
      		if (typeof desired_cell !== 'undefined') {
          		found = String(desired_cell.v);
      		}

      		desired_cell = worksheet[cell_daily];
      		if (typeof desired_cell !== 'undefined') {
          		daily = Number(desired_cell.v);
      		}

      		desired_cell = worksheet[cell_image];
      		if (typeof desired_cell !== 'undefined') {
          		image = desired_cell.v;
      		}

      		desired_cell = worksheet[cell_area];
      		if (typeof desired_cell !== 'undefined') {
          		area = desired_cell.v;
      		}

    		fee = '성인: ' + fee1 + ' / ' + '청소년: ' + fee2 + ' / ' +'어린이: ' + fee3;

		console.log('name: ' + name + ', found_date: ' + found + ' ,daily: ' + daily);

		pool.query('INSERT INTO museum(name, intro, address, latitude, longitude, business_hours, day_off, fee, homepage, tel, found_date, daily_customer, image_path, area) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, intro, address, latitude, longitude, business_hours, day_off, fee, homepage, tel, found, daily, image, area])
		.catch(function (err) {
			console.dir(err);
			res.json({
				code: -1,
				msg: err
			});
		});
   	}
	res.json({
		code: 1,
		msg: "OK"
	});
});

router.get('/keyword/title', function(req, res, next) {
	var first_sheet_name = workbookContent.SheetNames[0];
	var worksheet = workbookContent.Sheets[first_sheet_name];
	var museum = "";
	var title = "";
	var array = Array();
	var cnt = 0;
	for (var i=2; i<=247; i++) {
    		var cell_museum = 'B' + i;
		var cell_title = 'C' + i;

    		var desired_cell = worksheet[cell_museum];
		if (typeof desired_cell !== 'undefined') {
			museum = desired_cell.v;
		}


    		var desired_cell = worksheet[cell_title];
		if (typeof desired_cell !== 'undefined') {
			if (title !== desired_cell.v) {
				title = desired_cell.v;
				array.push(title);
			} else {
				continue;
			}
		}

		console.log('museum: ' + museum + ', title: ' + title);

		pool.query('SELECT id FROM museum WHERE name LIKE ?', [museum])
		.then(function (row) {
			var id = row[0].id
			pool.query('INSERT INTO story(museum_id, story_title) VALUES(?, ?)', [id, array[cnt++]])
			.catch(function (err) {
				res.json({
					code: -1,
					msg: err
				});
			});
		});
   	}
	res.json({
		code: 1,
		msg: "OK"
	});
});

router.get('/image/test', function (req, res, next) {
	var img = fs.readFileSync(req.query.path);
	res.writeHead(200, {'Content-Type': 'image/jpg'});
	res.end(img, 'binary');
});

router.get('/keyword/content', function(req, res, next) {
	var first_sheet_name = workbookContent.SheetNames[0];
	var worksheet = workbookContent.Sheets[first_sheet_name];
	var museum = "";
	var title = "";
	var content = "";
	var image = "";
	var array = Array();
	var contentArray = Array();
	var imageArray = Array();
	var priorityArray = Array();
	var cnt = 0;
	var contentCnt = 0;
	var imageCnt = 0;
	var priority = 0;
	var priorityCnt = 2;
	var index = 0;
	for (var i=2; i<=247; i++) {
    		var cell_museum = 'B' + i;
		var cell_title = 'C' + i;
		var cell_content = 'D' + i;
		var cell_image = 'H' + i;

    		var desired_cell = worksheet[cell_museum];
		if (typeof desired_cell !== 'undefined') {
			museum = desired_cell.v;
		}

    		var desired_cell = worksheet[cell_title];
		if (typeof desired_cell !== 'undefined') {
			if (title !== desired_cell.v) {
				priorityArray.push(i);
			}
			title = desired_cell.v;
			array.push(title);
		}

    		var desired_cell = worksheet[cell_image];
		if (typeof desired_cell !== 'undefined') {
			image = desired_cell.v;
			imageArray.push(image);
		}


    		var desired_cell = worksheet[cell_content];
		if (typeof desired_cell !== 'undefined') {
			content = desired_cell.v;
			contentArray.push(content);
		}

		pool.query('SELECT id FROM museum WHERE name LIKE ?', [museum])
		.then(function (row) {
			var id = row[0].id;
			pool.query('SELECT id FROM story WHERE museum_id=? AND story_title=?', [id, array[cnt++]])
			.then(function (row) {
				var id = row[0].id;
				if (priorityArray[index] == priorityCnt) {
					priority = 0;
					index++;
				}
				priorityCnt++;
				pool.query('INSERT INTO story_content(story_id, image_path, content, priority) VALUES(?, ?, ?, ?)', [id, imageArray[imageCnt++], contentArray[contentCnt++], priority++])
				.catch(function (err) {
					console.log('why')
					res.json({
						code: -1,
						msg: err
					});
				});
			});
		});
   	}
	res.json({
		code: 1,
		msg: "OK"
	});
});

router.get('/title/image', function(req, res, next) {
	var first_sheet_name = workbookImage.SheetNames[0];
	var worksheet = workbookImage.Sheets[first_sheet_name];
	var museum = "";
	var image = "";
	var array = Array();
	var cnt = 0;
	for (var i=2; i<=308; i++) {
    		var cell_museum = 'B' + i;
		var cell_image = 'C' + i;

    		var desired_cell = worksheet[cell_museum];
		if (typeof desired_cell !== 'undefined') {
			museum = desired_cell.v;
		}

    		var desired_cell = worksheet[cell_image];
		if (typeof desired_cell !== 'undefined') {
			image = desired_cell.v;
			array.push(image);
		}

		pool.query('SELECT id FROM museum WHERE name LIKE ?', [museum])
		.then(function (row) {
			var id = row[0].id;
			pool.query('INSERT INTO image_museum(museum_id, path) VALUES(?, ?)', [id, array[cnt++]])
			.catch(function (err) {
				res.json({
					code: -1,
					msg: err
				});
			});
		});
   	}
	res.json({
		code: 1,
		msg: "OK"
	});
});


module.exports = router;

