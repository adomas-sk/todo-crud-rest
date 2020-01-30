const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../mongoose');

const saltRounds = 10;

const registerUser = async (email, password) => {
	const existingUser = await User.findOne({ email }).lean();

	if (existingUser) {
		throw new Error('User already exists');
	}

	const salt = await bcrypt.genSalt(saltRounds);
	const hashedPassword = await bcrypt.hash(password, salt);

	await User.create({ email, password: hashedPassword });

	const token = jwt.sign({ email }, process.env.JWT_KEY);

	return token;
};

const loginUser = async (email, password) => {
	const user = await User.findOne({ email }).lean();

	if (!user) {
		throw new Error('No user found');
	}

	const correctPassword = bcrypt.compare(password, user.password);
	if (!correctPassword) {
		throw new Error('Wrong password');
	}

	const token = jwt.sign({ email }, process.env.JWT_KEY);

	return token;
};

const getUserByEmail = async email => {
	const user = await User.findOne({ email }).lean();

	return user;
};

module.exports = {
	loginUser,
	registerUser,
	getUserByEmail,
};
