const mysql = require('mysql2');

async function squery(queryString, values) {
	return new Promise((resolve, reject) => {
		con.connect(function (err) {
			if (err) reject(err);
			con.query(queryString, values, function (err, result, fields) {
				if (err) reject(err);
				resolve(result);
			});
		});
	});
}

exports.squery = squery;
