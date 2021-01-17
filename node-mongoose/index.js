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
			// update the dish by id
			return Dishes.findByIdAndUpdate(
				dish._id,
				{
					$set: {
						description: "updated Description",
					},
				},
				{
					new: true,
				}
			).exec();
		})
		.then((dish) => {
			console.log("updated: ", dish);

			// add a comment to dish comments array
			dish.comments.push({
				rating: 5,
				comment: "good dish",
				author: "pan nichita",
			});
			// save the comment
			return dish.save();
		})
		.then((dish) => {
			console.log("dish with comment: ", dish);

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
