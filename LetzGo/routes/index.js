var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'LetzGO - Trip Recommendation System' });
});

router.get('/home', function(req, res, next) {
	  res.render('home', { title: 'LetzGO - Home' });
	});

module.exports = router;
