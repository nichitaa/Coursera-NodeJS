var rect = require("./rectangle");

function solveRectangle(l, b) {
	console.log("recatangle solve ...");
	console.log("l -> ", l);
	console.log("b -> ", b);
	// l, b, callback function
	rect(l, b, (err, rectangle) => {
		if (err) {
			console.log("ERROR: ", err.message);
		} else {
			// do not pass l, b again, as we already have passed them before the callback itself
			console.log("perimeter -> ", rectangle.perimeter(l, b));
			console.log("area -> ", rectangle.area(l, b));
		}
	});
	console.log("after callback");
}

solveRectangle(2, 4);
solveRectangle(1, 0);
solveRectangle(-3, 4.4);
