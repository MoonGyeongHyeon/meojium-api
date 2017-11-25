var express = require('express');
var router = express.Router();
var pool = require('../db_pool');

router.get('/title/:id', function(req, res, next) {
	var id = req.params.id;
	pool.query('SELECT id, story_title FROM story WHERE museum_id=?', [id])
	.then(function (rows) {
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
