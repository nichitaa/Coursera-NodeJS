const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const url = "mongodb://localhost:27017/";
const dbname = "confusion";

MongoClient.connect(url, (err, client) => {
	assert.equal(err, null); // check if error is null

	console.log("Connected to the server");

	const db = client.db(dbname);
	const collection = db.collection("dishes");

	collection.insertOne(
		{
			name: "dish Name",
			description: "dish description",
		},
		(err, result) => {
			assert.equal(err, null);

			console.log("After Insert: \n");
			console.log(result.ops);

			// search for every doc in this collection
			collection.find({}).toArray((err, docs) => {
				assert.equal(err, null); // make sure the error is null

				console.log("Found: \n");
				console.log(docs);

				// clean the dishes collection
				// delete collection
				db.dropCollection("dishes", (err, result) => {
					assert.equal(err, null);

					client.close(); // close the db connection
				});
			});
		}
	);
});
