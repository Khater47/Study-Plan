var path = require('path');
const sqlite = require('sqlite3');
const fs = require('fs');

const runQuery = (query, db) => {
	return new Promise((resolve, reject) => {
		db.run(query, [], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve('Done');
			}
		});
	});
};

function createDB(dbPath) {
	allFileContents = fs.readFileSync(
		path.resolve(__dirname, 'dbCreationQueries.sql'),
		'utf-8'
	);

	const db = new sqlite.Database(dbPath, (err) => {
		if (err) throw err;
	});

	for (let query of allFileContents.split(';')) {
		db.serialize(() => {
			runQuery(query, db).catch((err) => {
				console.log(err);
			});
		});
	}
}

createDB('./university.db');
