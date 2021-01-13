const express = require("express");
const bodyParser = require("body-parser");

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// for GET, PUT, POST, DELETE of the "/dishes" route
// execute this part and got to the method code (next)
dishRouter
	.route("/")
	.all((req, res, next) => {
		res.statusCode = 200;
		res.setHeader("Content-type", "text/plain");
		next(); // continue
	}) // get
	.get((req, res, next) => {
		res.end("we will send the dishes to you from the db");
	}) // create
	.post((req, res, next) => {
		// req.body is parsed to js object due to bodyParser middleware
		res.end("will add the dish: " + req.body.name);
	}) // update
	.put((req, res, next) => {
		res.statusCode = 403;
		res.end("put operation not supported on dishes");
	}) // delete
	.delete((req, res, next) => {
		res.end("deleting all the dishes");
	});

// FOR SINGULAR DISH
dishRouter
	.route("/:id")
	.all((req, res, next) => {
		res.statusCode = 200;
		res.setHeader("Content-type", "text/plain");
		next(); // continue
	}) // get
	.get("/:id", (req, res, next) => {
		res.end("we will send the dish details by id: " + req.params.id);
	}) // create
	.post("/:id", (req, res, next) => {
		res.end("post operation not supported on /dishes/" + req.params.id);
	}) // update
	.put("/:id", (req, res, next) => {
		res.write("updte dish by id: ", +req.params.id + "\n");
		res.end("will update the dish: " + req.body.name);
	}) // delete
	.delete("/:id", (req, res, next) => {
		res.end("deleting the dish by id: " + req.params.id);
	});

module.exports = dishRouter;
