const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const crud = require("./crud"); // node module with crud operations

const url = "mongodb://localhost:27017/";
const dbname = "confusion";

MongoClient.connect(url, (err, client) => {
	assert.equal(err, null); // check if error is null

	console.log("Connected to the server");

	const db = client.db(dbname);

	crud.insertDocument(
		db,
		{
			name: "Pizza",
			description: "description",
		},
		"dishes",
		(result) => {
			console.log("Insert Doc: \n", result.ops); // nr of operations

			// get all documents in dishes collection
			crud.findDocuments(db, "dishes", (docs) => {
				console.log("Found Documents: \n", docs);

				// update document
				crud.updateDocument(
					db,
					{
						name: "Pizza", // old object
					},
					{
						description: "Updated Description for Pizza", // updated fields
					},
					"dishes", // collection
					(result) => {
						console.log(("Update docment: \n", result.result)); // result.result -> object updated

						// find documents
						crud.findDocuments(db, "dishes", (docs) => {
							console.log(
								"Found Documents after update: \n",
								docs
							);

							// clean db
							db.dropCollection("dishes", (result) => {
								console.log("droped Collection: ", result);

								// close connection to db
								client.close();
							});
						});
					}
				);
			});
		}
	);
});
