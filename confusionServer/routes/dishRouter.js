const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// dish model
const Dishes = require("../models/dishes");

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// handle "/dishes" requests
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

// handle "/dishes/:id" requests
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

// COMMENTS ROUTES
// handle "/dishes/:dishId/comments" requests
dishRouter
	.route("/:dishId/comments")
	.get((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then(
				(dish) => {
					// if dish exists
					if (dish !== null) {
						res.statusCode = 200;
						res.setHeader("Content-Type", "application/json");
						res.json(dish.comments); // return only the comments array
					} else {
						err = new Error(
							"Dish " + req.params.dishId + " not found!"
						);
						err.status = 404;
						return next(err);
					}
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
	})

	.post((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then(
				(dish) => {
					if (dish !== null) {
						// add new comment to array
						dish.comments.push(req.body);
						dish.save().then(
							(updatedDish) => {
								res.statusCode = 200;
								res.setHeader(
									"Content-Type",
									"application/json"
								);
								res.json(updatedDish);
							},
							(err) => next(err)
						);
					} else {
						err = new Error(
							"Dish " + req.params.dishId + " not found!"
						);
						err.status = 404;
						return next(err);
					}
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
	})

	.put((req, res, next) => {
		res.statusCode = 403;
		res.end(
			"put operation not supported on dishes/" +
				req.params.dishId +
				"/comments"
		);
	})

	.delete((req, res, next) => {
		Dishes.findById(req.params.dishId).then((dish) => {
			if (dish !== null) {
				// remove ALL comments from the dish itself
				for (let i = dish.comments.length - 1; i >= 0; i--) {
					// access a document by id and remove it from array
					const commentId = dish.comments[i]._id;
					dish.comments.id(commentId).remove();
				}
				dish.save().then(
					(updatedDish) => {
						res.statusCode = 200;
						res.setHeader("Content-Type", "application/json");
						res.json(updatedDish);
					},
					(err) => next(err)
				);
			} else {
				err = new Error("Dish " + req.params.dishId + " not found!");
				res.statusCode = 404;
				return next(err);
			}
		});
	});

// handle "/dishes/:dishId/:commentId" requests
dishRouter
	.route("/:dishId/comments/:commentId")
	.get((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then(
				(dish) => {
					// if dish exists and comment too
					if (
						dish !== null &&
						dish.comments.id(req.params.commentId) !== null
					) {
						res.statusCode = 200;
						res.setHeader("Content-Type", "application/json");
						res.json(dish.comments.id(req.params.commentId)); // send one comment
					} else if (dish === null) {
						err = new Error(
							"Dish " + req.params.dishId + " not found!"
						);
						err.status = 404;
						return next(err);
					} else {
						err = new Error(
							"Comment " + req.params.comments + " not found!"
						);
						err.status = 404;
						return next(err);
					}
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
	})

	.post((req, res, next) => {
		res.end(
			"post operation not supported on /dishes/" +
				req.params.dishId +
				"/comments/" +
				req.params.commentId
		);
	})

	// update one comment
	.put((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then(
				(dish) => {
					// if dish exists and comment too
					if (
						dish !== null &&
						dish.comments.id(req.params.commentId) !== null
					) {
						// UPDATE THE COMMENT
						const commentId = req.params.commentId;
						if (req.body.rating) {
							dish.comments.id(commentId).rating =
								req.body.rating;
						}
						if (req.body.comment) {
							dish.comments.id(commentId).comment =
								req.body.comment;
						}
						// save changes
						dish.save().then(
							(updatedDish) => {
								res.statusCode = 200;
								res.setHeader(
									"Content-Type",
									"application/json"
								);
								res.json(updatedDish);
							},
							(err) => next(err)
						);
					} else if (dish === null) {
						err = new Error(
							"Dish " + req.params.dishId + " not found!"
						);
						err.status = 404;
						return next(err);
					} else {
						err = new Error(
							"Comment " + req.params.comments + " not found!"
						);
						err.status = 404;
						return next(err);
					}
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
	})

	.delete((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then(
				(dish) => {
					if (
						dish !== null &&
						dish.comments.id(req.params.commentId) !== null
					) {
						// delete the comment
						dish.comments.id(req.params.commentId).remove();
						// save changes
						dish.save().then(
							(dish) => {
								res.statusCode = 200;
								res.setHeader(
									"Content-Type",
									"application/json"
								);
								res.json(dish);
							},
							(err) => next(err)
						);
					} else if (dish !== null) {
						err = new Error(
							"Dish " + req.params.dishId + " Not found!"
						);
						res.statusCode = 404;
						return next(err);
					} else {
						err = new Error(
							"Comment" + req.params.commentId + " Not found!"
						);
						res.statusCode = 404;
						return next(err);
					}
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
	});

module.exports = dishRouter;
