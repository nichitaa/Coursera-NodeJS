var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// importing express-session/ file-store
const session = require("express-session");
const FileStore = require("session-file-store")(session);

// auth packages
const passport = require("passport");
const authenticate = require("./authenticate");

// import mongoose odm
const mongoose = require("mongoose");

// import router handlers
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var dishRouter = require("./routes/dishRouter");

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

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// we can use either cookie or session
// app.use(cookieParser("12345-67890-09876-54321")); // secret key
app.use(
	session({
		name: "session-id", // name for the cookie itself (will appear in browser)
		secret: "12345-67890-09876-54321",
		saveUninitialized: false,
		resave: false,
		store: new FileStore(),
	})
);

// auth
app.use(passport.initialize());
app.use(passport.session());

// A UNAUTHORIZED user can access those endpoints
// in order to authenticate
app.use("/", indexRouter);
app.use("/users", usersRouter);

function auth(req, res, next) {
	// if the incoming request does not include user field loaded by passport module
	// --> the user has not been authorized yet
	if (!req.user) {
		var err = new Error("You are not authenticated");
		err.status = 403; // forbidden
		return next(err);
	} else {
		next();
	}
}

app.use(auth); // my auth middleware

app.use(express.static(path.join(__dirname, "public")));

// ONLY AUTHORIZED USERS ENDPOINTS
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
