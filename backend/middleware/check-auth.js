const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
	if (req.method === 'OPTIONS') {
		return next();
	}
	try {
		// here authorization will be like Authorization:'Bearer TOKEN' hence used split.
		const token = req.headers.authorization.split(' ')[1];
		if (!token) {
			throw new Error('Authentication failed!');
		}
		const decodedToken = jwt.verify(token, 'supersecret_dont_share');
		req.userData = { userId: decodedToken.userId };
		next();
	} catch (err) {
		return next(new HttpError('Authentication failed!', 403));
	}
};