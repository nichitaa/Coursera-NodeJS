const assert = require("assert");
const { EPROTONOSUPPORT } = require("constants");

exports.insertDocument = (db, document, collection, callback) => {
	const coll = db.collection(collection); // get the collection
	coll.insert(document, (err, result) => {
		assert.equal(err, null); // if error is null
		console.log(
			"INSERTED " +
				result.result.n +
				"documents into collection " +
				collection +
				"\n"
		);
		callback(result); // trigger callback with result object as parameter
	});
};

exports.findDocuments = (db, collection, callback) => {
	const coll = db.collection(collection); // get the collection
	coll.find({}).toArray((err, docs) => {
		assert.equal(err, null); // check if the error null

		callback(docs); // pass the find docs to the callback function
	});
};

exports.removeDocument = (db, document, collection, callback) => {
	const coll = db.collection(collection); // get the collection
	coll.deleteOne(document, (err, result) => {
		assert.equal(err, null);
		console.log("REMOVED DOCUMENT: ", document);
		callback(result);
	});
};

exports.updateDocument = (db, document, update, collection, callback) => {
	const coll = db.collection(collection); // get the collection

	// update document
	// 1param - document to be updated
	// 2param - object with the fields to be updated, (e.g entire update object)
	// 3param - null
	// 4parm - callback
	coll.updateOne(document, { $set: update }, null, (err, result) => {
		assert.equal(err, null);
		console.log("DOCUMENT UPDATED WITH: ", update);
		callback(result);
	});
};
