const mongoose = require("mongoose");
const Dishes = require("./models/dishes");

const url = "mongodb://localhost:27017/confusion";
const connect = mongoose.connect(url);

connect.then((db) => {
	console.log("Connected to the server");

	// create new dish object
	Dishes.create({
		name: "Zeama",
		description: "description for zeama",
	})
		.then((dish) => {
			console.log("dish: ", dish);
			// find all dishes
			return Dishes.find({}).exec();
		})
		.then((dishes) => {
			console.log("dishes: ", dishes);
			// remove all dishes from db
			return Dishes.remove({});
		})
		.then(() => {
			// close the connection to the db
			return mongoose.connection.close();
		})
		.catch((err) => {
			console.log(err);
		});
});
