var express = require('express');
var router = express.Router();

//for mysql connection
var connection = require('express-myconnection');
var mysql = require('mysql');

//for session
var session = require('express-session');

connectionpool = mysql.createPool({
	host : 'localhost',
	user : 'root',
	password : 'jaijinendra',
	database : 'letzgodb'
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('user_auth');
});


router.post('/login', function(req, res) {
	var sess = req.session;
	connectionpool.getConnection(function(err, connection) {
		//console.log("Inside cpool");
		var input = JSON.parse(JSON.stringify(req.body));
		console.log(input);

		var queryString = 'SELECT * FROM user_auth where email = "' + input.username
				+ '" AND password = "' + input.password + '"';
		console.log(queryString);
		connection.query(queryString, function(err, rows) {
			console.log(input);
			if (err)
				console.log("Error Selecting : %s ", err);
			for ( var i in rows) {
				if (i == 0) {
					//var sess = req.session;
					//console.log(input.username);
					sess.username = input.username;
					res.redirect('/home');
				}
				else{
					res.redirect('/login');
					sess.username = "";
				}
			}
			connection.release();
		});
	});
});


/* For User Logout */
router.get('/logout', function(req, res) {
	req.session.destroy(function(err) {
		if (err) {
			console.log(err);
		} else {
			//console.log(req.session.username);
			res.redirect('/home');
		}
	});
});

module.exports = router;
