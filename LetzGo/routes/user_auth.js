var express = require('express');
var router = express.Router();

//for mysql connection
var connection = require('express-myconnection');
var mysql = require('mysql');

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
	connectionpool.getConnection(function(err, connection) {
		//console.log("Inside cpool");
		var input = JSON.parse(JSON.stringify(req.body));
		console.log(input);

		var queryString = 'SELECT * FROM user_auth where email = "' + input.username
				+ '" AND password = "' + input.password + '"';
		console.log(queryString);
		connection.query(queryString, function(err, rows) {
			if (err)
				console.log("Error Selecting : %s ", err);
			for ( var i in rows) {
				if (i == 0) {
					res.redirect('/home');
				}
				else{
					res.redirect('/login');
				}
			}
			connection.release();
		});
	});
});

module.exports = router;
