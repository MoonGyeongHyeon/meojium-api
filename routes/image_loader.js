var express = require('express');
var router = express.Router();
var pool = require('../db_pool');
var fs = require('fs');

router.get('/load', function (req, res, next) {
	var img = fs.readFileSync(req.query.path);

	res.writeHead(200, {'Content-Type': 'image/png'});
	res.end(img, 'binary');
});

module.exports = router;

