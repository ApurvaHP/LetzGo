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



/*router.get('/attractions', function(req, res, next) {
	var sess = req.session;
	var uname = sess.username;
	  res.render('attractions', { title: 'LetzGO - Local Attractions', uname: uname });
});*/


/* GET login-signup page. */
/*router.get('/attractions/Essex-Property-Homes', function(req, res, next) {
	var sess = req.session;
	var str = sess.aurl;
	str = "Essex-Property-Homes";
	//aname = str.replace("-", " ");
	aname = "Essex Property Homes";
	connectionpool.getConnection(function(err, connection) {
		var queryString = 'SELECT * FROM attractions where name = "' + aname + '"';
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
						res.render('attractions', { title: 'LetzGO - Local Attractions', data: rows });
					}
				}
			}
			connection.release();
		});
	});
});*/


router.post('/login', function(req, res) {
	var sess = req.session;
	connectionpool.getConnection(function(err, connection) {
		//console.log("Inside cpool");
		var input = JSON.parse(JSON.stringify(req.body));
		console.log(input);
		var queryString = 'SELECT * FROM users where username = "' + input.username
				+ '" AND password = "' + input.password + '"';
		//console.log(queryString);
		connection.query(queryString, function(err, rows) {
			//console.log(input);
			if (err){
				console.log("Error Selecting : %s ", err);
				sess.login = 0;
				sess.user = "";
				res.redirect('/login');
			}
			else{
				for ( var i in rows) {
					if (i == 0) {
						sess.user = rows[i];
						console.log(sess.user);
						res.redirect('/profile');
					}
					else{
						sess.login = 0;
						sess.user = "";
						res.redirect('/login');
					}
				}
			}
			connection.release();
		});
	});
});



router.get('/attractions', function(req, res, next) {
	var sess = req.session;
	var uname = sess.username;
	  res.render('attractions', { title: 'LetzGO - Local Attractions', uname: uname });
});


module.exports = router;
