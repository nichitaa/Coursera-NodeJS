const express = require("express");
const http = require("http");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const hostname = "localhost";
const port = 3000;

const app = express();
// middleware (app.use())
app.use(morgan("dev"));
app.use(express.static(__dirname + "/public")); // serve public dir
app.use(bodyParser.json()); // allows to parse the body of te req message in json

// for GET, PUT, POST, DELETE
// execute this part and got to the method code (next)
app.all("/dishes", (req, res, next) => {
	res.statusCode = 200;
	res.setHeader("Content-type", "text/plain");
	next(); // continue
});

app.get("/dishes", (req, res, next) => {
	res.end("we will send the dishes to you from the db");
});

// create
app.post("/dishes", (req, res, next) => {
	// req.body is parsed to js object due to bodyParser middleware
	res.end("will add the dish: " + req.body.name);
});

// update
app.put("/dishes", (req, res, next) => {
	res.statusCode = 403;
	res.end("put operation not supported on dishes");
});

// delete
app.delete("/dishes", (req, res, next) => {
	res.end("deleting all the dishes");
});

// FOR SINGULAR DISH
app.get("/dishes/:id", (req, res, next) => {
	res.end("we will send the dish details by id: " + req.params.id);
});

// create
app.post("/dishes/:id", (req, res, next) => {
	res.end("post operation not supported on /dishes/" + req.params.id);
});

// update
app.put("/dishes/:id", (req, res, next) => {
	res.write("updte dish by id: ", +req.params.id + "\n");
	res.end("will update the dish: " + req.body.name);
});

// delete
app.delete("/dishes/:id", (req, res, next) => {
	res.end("deleting the dish by id: " + req.params.id);
});

app.use((req, res, next) => {
	console.log(req.headers);
	res.statusCode = 200;
	res.setHeader("Content-Type", "text/html");
	res.end("<html><body><h1>Hello Express</h1></body></html>");
});

const server = http.createServer(app);
server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
