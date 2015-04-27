function ConnectionPool(num_conns) {
	this.ConnectionPool = [];
	for (var i = 0; i < num_conns; ++i)
		this.ConnectionPool.push(createConn()); // your new Client + auth
	this.last = 0;
}

function createConn() {
	var mysql = require('mysql');
	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : '',
		port : '3306',
		database : 'places'
	});

	connection.connect(function(err) {
		if (!err) {
			console.log("Connected to MySQL");
		} else if (err) {
			console.log(err);
		}
	});
	return connection;
}

ConnectionPool.prototype.get = function() {

	var threshold = 5;
	console.log(threshold);
	console.log("In get first" + this.last);

	var connection = this.ConnectionPool[this.last];
	this.last++;

	/*
	 * if (this.last == this.ConnectionPool.length){ // cyclic increment
	 * this.last = 0; }
	 */
	if (this.last === threshold) {
		// for(var i=0; i < threshold; ++i)
		this.ConnectionPool.push(createConn());
		// }
		// if(this.last == 0){
		/*
		 * for(var i= this.ConnectionPool.length; i>=10; i--){
		 *  }
		 */
	}

	console.log("In get end" + this.last);
	return connection;
};

ConnectionPool.prototype.release = function(mysqlConnection) {
	console.log("In release start" + this.last);

	this.ConnectionPool.push(mysqlConnection);
	// mysqlConnection.destroy();
	this.last--;
	console.log("In release end" + this.last);

};
module.exports = ConnectionPool;