var express = require("express");
const bodyParser = require("body-parser");
const Users = require("../models/user");

var router = express.Router();
router.use(bodyParser.json());

// handling: '/users'
router.get("/", (req, res, next) => {
	res.send("respond with a resource");
});

// Route --> "/users/signup"  SIGN UP
router.post("/signup", (req, res, next) => {
	// find one user with username from the request body
	Users.findOne({ username: req.body.username })
		.then((user) => {
			// if the user already exists
			if (user !== null) {
				var err = new Error(
					"User " + req.body.username + " already exists!"
				);
				err.status = 403;
				next(err);
			}
			// if the username is free
			else {
				// create new user
				return Users.create({
					username: req.body.username,
					password: req.body.password,
				});
			}
		})
		.then(
			(user) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				// respond with user and status
				res.json({ status: "Registration Successful!", user: user });
			},
			(err) => next(err)
		)
		.catch((err) => next(err));
});

// Route --> "/users/login" LOG IN
router.post("/login", (req, res, next) => {
	// if the incoming request does not include user field in user session
	// --> the user has not been authorized yet
	if (!req.session.user) {
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

		Users.findOne({
			username: username,
		})
			.then((user) => {
				// if the user does not exist
				if (user === null) {
					var err = new Error(
						"User " + username + " does not exist!"
					);
					err.status = 403;
					return next(err);
				}

				// else if password does not correspond
				else if (user.password !== password) {
					var err = new Error("Incorect Password");
					err.status = 403;
					return next(err);
				}

				// VALID credentials
				else if (
					(user.username = username && user.password === password)
				) {
					// set up session
					req.session.user = "authenticated";
					res.statusCode = 200;
					res.setHeader("Content-Type", "text/plain");
					res.end("You are authenticated!");
				}
			})
			.catch((err) => next(err));
	}

	// if the session.user is already set
	else {
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/plain");
		res.end("You are already authenticated");
	}
});

// Route --> "/users/logout" LOG OUT
router.get("/logout", (req, res, next) => {
	if (req.session) {
		// delete the session
		req.session.destroy();
		// clear the cookie bu the cookie name ("session-id")
		res.clearCookie("session-id");
		// redirect to the home page
		res.redirect("/");
	} else {
		var err = new Error("You are not logged in!");
		err.status = 403; // forbidden
		next(err);
	}
});

module.exports = router;
