const jwt = require('jsonwebtoken');

const { getUserByEmail } = require('./controllers/user.controller');

const authenticationMiddleware = async (req, res, next) => {
	const token = req.get('token');

	if (!token) {
		throw new Error('User not authenticated');
	}

	const decoded = await jwt.verify(token, process.env.JWT_KEY);
	const user = await getUserByEmail(decoded.email);
	res.locals.user = user;
	next();
};

module.exports = {
	authenticationMiddleware,
};
