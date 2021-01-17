const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// dish model
const Dishes = require("../models/dishes");

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// for GET, PUT, POST, DELETE of the "/dishes" route
// execute this part and got to the method code (next)
dishRouter
	.route("/")
	// get
	.get((req, res, next) => {
		// find all dishes in db
		Dishes.find({})
			.then(
				(dishes) => {
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					// put json to the body of the reply message
					res.json(dishes);
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
	}) // create
	.post((req, res, next) => {
		// create new dish document in dished collection in db
		Dishes.create(req.body)
			.then(
				(dish) => {
					console.log("Dish created: ", dish);
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.json(dish);
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
	}) // update
	.put((req, res, next) => {
		res.statusCode = 403;
		res.end("put operation not supported on dishes");
	}) // delete all dishes
	.delete((req, res, next) => {
		// remove all dishes documents in Dishes collection
		Dishes.remove({})
			.then(
				(response) => {
					console.log("Deleted all dishes ...");
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.json(response);
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
	});

// FOR SINGULAR DISH
// by dishId
dishRouter
	.route("/:id")
	// get one dish
	.get((req, res, next) => {
		// find one dish by id from the request url params.id
		Dishes.findById(req.params.id)
			.then(
				(dish) => {
					console.log("Dish found: ", dish);
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.json(dish);
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
	}) // create
	.post((req, res, next) => {
		res.end("post operation not supported on /dishes/" + req.params.id);
	}) // update one dish by id
	.put((req, res, next) => {
		Dishes.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body, // in req.body will be the data for update dish
			},
			{ new: true } // new: true --> return the update dish
		)
			.then(
				(dish) => {
					console.log("Update Dish: ", dish);
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.json(dish);
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
	}) // delete dish
	.delete((req, res, next) => {
		Dishes.findByIdAndRemove(req.params.id)
			.then(
				(response) => {
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.json(response);
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
	});

module.exports = dishRouter;
