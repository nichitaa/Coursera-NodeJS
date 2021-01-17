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
app.use(cookieParser("12345-67890-09876-54321")); // secret key

function auth(req, res, next) {
	console.log("signed cookies: ", req.signedCookies);

	// if the incoming request does not include user field in signedCookie
	// --> the user has not been authorized yet
	if (!req.signedCookies.user) {
		// expect the user to authorize by including the authorization headers
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
		var auth = new Buffer.from(authHeader.split(" ")[1], "base64")
			.toString()
			.split(":");
		var username = auth[0];
		var password = auth[1];

		// if credentials are correct
		if (username === "admin" && password === "admin") {
			// set up the user's cookies
			// cookie name --> user
			// cookie value --> admin
			res.cookie("user", "admin", { signed: true });
			next(); // go to the next middleware
		}
		// if credentials are wrong
		else {
			var err = new Error("Wrong Credentials");
			err.status = 401; // unauthorized access
			res.setHeader("WWW-Authenticate", "Basic");
			return next(err);
		}
	}

	// else if the signed cookies already exists:
	else {
		// if the signedCookies, user field has value of "admin"
		if (req.signedCookies.user === "admin") {
			// allow the request to pass thru
			next();
		}

		// if the cookie contains invalid value
		else {
			var err = new Error("Wrong Credentials");
			err.status = 401; // unauthorized access
			return next(err);
		}
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
