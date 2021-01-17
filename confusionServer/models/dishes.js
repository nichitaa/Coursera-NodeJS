const mongoose = require("mongoose");
const Schema = mongoose.Schema;

require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

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
		image: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		label: {
			type: String,
			default: "",
		},
		price: {
			// mongoose currency type
			type: Currency,
			required: true,
			min: 0,
		},
		feature: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

let Dishes = mongoose.model("Dish", dishSchema);

module.exports = Dishes;
