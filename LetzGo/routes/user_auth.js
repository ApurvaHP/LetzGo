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


/* GET login-signup page. */
router.get('/login', function(req, res, next) {
	var sess = req.session;
	if(sess.user == null || sess.user == ""){
		if(sess.login != 0 || sess.login == null || sess.login == ""){
			res.render('user_auth',{title:"Sign In | Register", toast: '0'});
		}else if(sess.login == 0 ){
			res.render('user_auth',{title:"Sign In | Register", toast: '1'});
			sess.login = 1;
		}
	}
	else{
		res.redirect('/profile');
	}
});


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
						res.redirect('/users/'+sess.user.username);
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


/* For User Logout */
router.get('/logout', function(req, res) {
	req.session.destroy(function(err) {
		if (err) {
			console.log(err);
		} else {
			//console.log(req.session.username);
			res.redirect('/login');
		}
	});
});

/*For user signup*/
router.post('/signup', function(req, res) {
	var sess = req.session;
	connectionpool.getConnection(function(err, connection) {
		//console.log("Inside cpool");
		var input = JSON.parse(JSON.stringify(req.body));
		console.log(input);
		
		//var queryString = "INSERT INTO users set ? ";
		
		//console.log(queryString);
		var query = connection.query("INSERT INTO users set ? ", input, function(err, rows) {
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

module.exports = router;
