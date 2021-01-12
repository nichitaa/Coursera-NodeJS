const http = require("http");

const fs = require("fs");
const path = require("path");

const hostname = "localhost";
const port = 3000;

const server = http.createServer((req, res) => {
	console.log("Request for " + req.url + " by method " + req.method);

	if (req.method === "GET") {
		var fileUrl;
		if (req.url === "/") fileUrl = "/index.html";
		else fileUrl = req.url;

		var filePath = path.resolve("./public" + fileUrl);
		const fileExt = path.extname(filePath);
		// if the file extension is .html
		if (fileExt === ".html") {
			fs.exists(filePath, (exists) => {
				// file does not exist
				if (!exists) {
					res.statusCode = 404;
					res.setHeader("Content-type", "text/html");
					res.end(
						"<html><body><h1>ERROR 404: not found </h1></body></html>"
					);
					return;
				} else {
					res.statusCode = 200;
					res.setHeader("Content-type", "text/html");
					fs.createReadStream(filePath).pipe(res);
				}
			});
		} else {
			res.statusCode = 404;
			res.setHeader("Content-type", "text/html");
			res.end(
				"<html><body><h1>ERROR 404: not an html file </h1></body></html>"
			);
			return;
		}
		// if the request.method is not GET
	} else {
		res.statusCode = 404;
		res.setHeader("Content-type", "text/html");
		res.end(
			"<html><body><h1>ERROR 404: method not suported </h1></body></html>"
		);
		return;
	}
});

server.listen(port, hostname, () => {
	console.log(`Server has started on http://${hostname}:${port}`);
});
