var express = require('express');
var router = express.Router();
var pool = require('../db_pool');

router.get('/:id', function(req, res, next) {
	var id = req.params.id;
	pool.query('SELECT * FROM story_content WHERE story_id=? ORDER BY priority', [id])
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
