module.exports = (x, y, callback) => {
	if (x <= 0 || y <= 0) {
		// simulate 1 second timeout processing
		setTimeout(
			() => callback(new Error("The length can not <= 0"), null),
			1000
		);
	} else {
		setTimeout(
			() =>
				// null -> no error
				// second parameter -> js object with the needed functions
				callback(null, {
					perimeter: (x, y) => 2 * (x + y),
					area: (x, y) => x * y,
				}),
			1000
		);
	}
};
