const express = require("express");
const bodyParser = require("body-parser");
const Users = require("../models/user");
const passport = require("passport");

const router = express.Router();
router.use(bodyParser.json());

// handling: '/users'
router.get("/", (req, res, next) => {
	res.send("respond with a resource");
});

// Route --> "/users/signup"  SIGN UP
router.post("/signup", (req, res, next) => {
	// passport-local-mongoose has register function
	Users.register(
		new Users({ username: req.body.username }),
		req.body.password,
		(err, user) => {
			// if error
			if (err) {
				res.statusCode = 500;
				res.setHeader("Content-Type", "application/json");
				res.json({ err: err });
			}
			// authenticate user
			else {
				passport.authenticate("local")(req, res, () => {
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					// respond with user and status
					res.json({
						success: true,
						status: "Registration Successful!",
					});
				});
			}
		}
	);
});

// Route --> "/users/login" LOG IN
router.post("/login", passport.authenticate("local"), (req, res, next) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	// respond with user and status
	res.json({
		success: true,
		status: "You are successfully logged in!",
	});
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
