'use strict';

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


router.get('/', function(req, res, next) {
	var sess = req.session;
	var uname = sess.username;
	  res.render('profile', { title: 'LetzGO - User Profile', uname: uname });
});


router.get('/:username', function(req, res, next) {	
	var username = req.param('username');
	connectionpool.getConnection(function(err, connection) {
		var queryString = 'SELECT * FROM users where username = "' + username + '"';
		console.log(queryString);
		connection.query(queryString, function(err, rows) {
			//console.log(input);
			if (err){
				console.log("Error Selecting : %s ", err);
				res.redirect('/error');
			}
			else{
				for ( var i in rows) {
					console.log(rows);
					if (i == 0) {
						res.render('profile', { title: 'LetzGO - User Profile', data: rows });
					}
				}
			}
			connection.release();
		});
	});
});

module.exports = router;
