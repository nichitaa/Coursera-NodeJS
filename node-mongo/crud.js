const assert = require("assert");

exports.insertDocument = (db, document, collection) => {
	const coll = db.collection(collection); // get the collection
	return coll.insert(document); // return the promise
};

exports.findDocuments = (db, collection) => {
	const coll = db.collection(collection); // get the collection
	return coll.find({}).toArray(); // return the promise
};

exports.removeDocument = (db, document, collection) => {
	const coll = db.collection(collection); // get the collection
	return coll.deleteOne(document); // return the promise
};

exports.updateDocument = (db, document, update, collection) => {
	const coll = db.collection(collection); // get the collection
	// update document
	return coll.updateOne(document, { $set: update }, null); // return the promise
};
