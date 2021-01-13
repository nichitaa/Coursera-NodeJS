const express = require("express");
const http = require("http");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const dishRouter = require('./routes/dishRouter')
const hostname = "localhost";
const port = 3000;

const app = express();
// middleware (app.use())
app.use(morgan("dev"));
app.use(express.static(__dirname + "/public")); // serve public dir
app.use(bodyParser.json()); // allows to parse the body of te req message in json


// any http request to this route, will be handled by dishRouter module
app.use('/dishes', dishRouter);

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
