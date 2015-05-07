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
	  res.render('attractions', { title: 'LetzGO - Local Attractions', uname: uname });
});


/* GET login-signup page. */
router.get('/:name', function(req, res, next) {	
	//var name = req.param('name');
	var name = req.params.name;
	var atrName = name.replace(/-/g, ' ');

	//aname = "Essex-Property-Homes";
	connectionpool.getConnection(function(err, connection) {
		var q1 = 'SELECT * FROM attractions where name = "' + atrName + '"';
		console.log(q1);
		connection.query(q1, function(err, rows) {
			//console.log(input);
			if (err){
				console.log("Error Selecting : %s ", err);
				res.redirect('/error');
			}
			else{
				for ( var i in rows) {
					//console.log(rows);
					if (i == 0) {
						//res.render('attractions', { title: 'LetzGO - Local Attractions', data: rows });
						var q2 = 'SELECT r.id, u.username as user, u.city as city, a.name as attraction, r.date, r.title, r.description, r.rating FROM reviews r'
									+ ' inner join users u on r.user = u.id'
										+ ' inner join attractions a on r.attraction = a.id'
											+ ' where a.name ="' + atrName + '"';
						console.log(q2);
						connection.query(q2, function(err1, rows1) {
							//console.log(input);
							if (err1){
								console.log("Error Selecting : %s ", err1);
								res.redirect('/error');
							}
							else{
								//for ( var i in rows1) {
								//console.log(rows[0]);
								console.log(rows1);
								if(rows[0].address2 == null){
									rows[0].address2 = '';
								}else{
									rows[0].address2 = ', '+rows[0].address2;
								}
								
								if(rows[0].banner != null){
									//var bannerText = '<img alt="alt text" src="'+rows[0].banner+'">';
									var bannerText = rows[0].banner;
									rows[0].banner = bannerText;
								}else{
									//var bannerText = '<img alt="alt text" src="../images/samples/noBanner.jpg">';
									var bannerText = '../images/samples/noBanner.jpg';
									rows[0].banner = bannerText;
								}
								console.log(rows[0].banner);
								
									//if (i == 0) {
								res.render('attractions', { title: rows[0].name, atrData: rows[0], atrReviewsData: rows1 });
									//}
								//}
							}
							connection.release();
						});
					}
				}
			}
			//connection.release();
		});
	});
});

/*router.get('/attractions', function(req, res, next) {
	var sess = req.session;
	var uname = sess.username;
	  res.render('attractions', { title: 'LetzGO - Local Attractions', uname: uname });
});*/


module.exports = router;
