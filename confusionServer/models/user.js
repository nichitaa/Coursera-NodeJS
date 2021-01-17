const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
	admin: {
		type: Boolean,
		default: false,
	},
});

// passport local mongoose will add username and password
userSchema.plugin(passportLocalMongoose)

// create model of Users objects
let Users = mongoose.model("User", userSchema);

module.exports = Users;
