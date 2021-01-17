const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
	{
		rating: {
			type: Number,
			min: 1,
			max: 5,
			required: true,
		},
		comment: {
			type: String,
			required: true,
		},
		author: {
			type: String,
			require: true,
		},
	},
	{
		timestamps: true,
	}
);

const dishSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			required: true,
		},
		// each dish have an array of comments
		comments: [commentSchema],
	},
	{
		timestamps: true,
	}
);

let Dishes = mongoose.model("Dish", dishSchema);

module.exports = Dishes;
