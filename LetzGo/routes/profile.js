var express = require('express');
var router = express.Router();

//for mysql connection
var connection = require('express-myconnection');
var mysql = require('mysql');

//for session
var session = require('express-session');

connectionpool = mysql.createPool({
	host : 'mysqldbinstanceaws.cd6bkgkbz9zf.us-west-2.rds.amazonaws.com',
	user : 'member',
	password : 'letzgoPassword',
	database : 'letzgoDB'
});


/* GET login page. */
router.get('/profile', function(req, res, next) {
	res.render('profile', { title: 'My Profile'});
});

/*router.get('/profile:id', function(req, res, next) {
	var sess = req.session;
	var id = req.param.id;
	res.render('profile', { title: 'LetzGO - My Profile', uname: id });
});*/

module.exports = router;
