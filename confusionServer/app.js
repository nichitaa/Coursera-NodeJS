var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");

// models schema
const Dishes = require("./models/dishes");

// connect to the mongodb server
const url = "mongodb://localhost:27017/confusion";
const connect = mongoose.connect(url);

connect.then(
	(db) => {
		console.log("Connected to the server...");
	},
	(err) => {
		console.log(err);
	}
);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var dishRouter = require("./routes/dishRouter");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

function auth(req, res, next) {
	console.log("auth req,headers: ", req.headers);

	var authHeader = req.headers.authorization;

	if (!authHeader) {
		var err = new Error("You are not authenticated");
		err.status = 401; // unauthorized access
		res.setHeader("WWW-Authenticate", "Basic");
		return next(err);
	}

	// Basic YWRtaW46YXNtaW4=
	// 1 --> get the second part of the message and decode
	// username:password123
	// 2 --> split by ":", and get the credentials in the array auth
	var auth = new Buffer(authHeader.split(" ")[1], "base64")
		.toString()
		.split(":");
	var username = auth[0];
	var password = auth[1];

	if (username === "admin" && password === "admin") {
		next(); // go to the next middleware
	}
	// bad username and password
	else {
		var err = new Error("Wrong Credentials");
		err.status = 401; // unauthorized access
		res.setHeader("WWW-Authenticate", "Basic");
		return next(err);
	}
}

app.use(auth); // my auth middleware

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/dishes", dishRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
