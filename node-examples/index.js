var rect = require('./rectangle')

function solveRectangle(l, b) {
	console.log("recatangle solve ...");
	console.log("l -> ", l);
	console.log("b -> ", b);

	if (l <= 0 || b <= 0) {
		console.log("rectangle dimensions should be > 0");
	} else {
		console.log("area -> ", rect.area(l, b));
		console.log("perimeter -> ", rect.perimeter(l, b));
	}
}

solveRectangle(2, 4);
solveRectangle(1, 0);
solveRectangle(-3, 4.4);
