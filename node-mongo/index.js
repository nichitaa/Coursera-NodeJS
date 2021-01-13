const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const crud = require("./crud"); // node module with crud operations

const url = "mongodb://localhost:27017/";
const dbname = "confusion";

MongoClient.connect(url)
	.then((client) => {
		// assert.equal(err, null); // check if error is null
		console.log("Connected to the server");

		const db = client.db(dbname);

		crud.insertDocument(
			db,
			{
				name: "dish name",
				description: "dish description",
			},
			"dishes"
		)
			.then((result) => {
				console.log("Inserted Document: ", result.ops);
				return crud.findDocuments(db, "dishes");
			})
			.then((docs) => {
				console.log("Found Documents: \n", docs);
				return crud.updateDocument(
					db,
					{ name: "dish name" },
					{ description: "updated description" },
					"dishes"
				);
			})
			.then((result) => {
				console.log(("Update document: \n", result.result));
				return crud.findDocuments(db, "dishes");
			})
			.then((docs) => {
				console.log("Found Documents after update: \n", docs);
				return db.dropCollection("dishes");
			})
			.then((result) => {
				console.log("Droped Collection: ", result);
				client.close();
			})
			.catch((err) => console.log(err));
	})
	.catch((err) => console.log(err));
