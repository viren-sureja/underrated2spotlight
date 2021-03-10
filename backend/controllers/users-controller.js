const { validationResult } = require('express-validator');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const user = require('../models/user');

const DUMMY_USERS = [
	{
		id: 'u1',
		name: 'VIREN',
		email: 'viren@viren.gmail',
		password: '1234',
	},
];

const getUsers = async (req, res, next) => {
	let users;
	try {
		users = await User.find({}, '-password');
	} catch (err) {
		return next(
			new HttpError('Unable to fetch Users data please try again later', 500)
		);
	}
	res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError('Invalid inputs passed, please check your data', 422)
		);
	}
	const { name, email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		return next(new HttpError('Signing Up failed please try again', 500));
	}
	if (existingUser) {
		// console.log(existingUser == true);
		return next(
			new HttpError('User exists already, please login instead.', 422)
		);
	}

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (err) {
		return next(
			new HttpError('Could not create User, please try again', 500)
		);
	}

	const createdUser = new User({
		name,
		email,
		image: req.file.path,
		password: hashedPassword,
		places: [],
	});

	try {
		await createdUser.save();
	} catch (err) {
		return next(
			new HttpError('User signUp failed, please signUp again.', 500)
		);
	}

	let token;
	try {
		token = jwt.sign(
			{ userId: createdUser.id, email: createdUser.email },
			process.env.JWT_KEY,
			{ expiresIn: '1h' }
		);
	} catch (err) {
		return next(
			new HttpError('User signUp failed, please signUp again.', 500)
		);
	}

	// res.status(201).json({ user: createdUser.toObject({ getters: true }) });
	res.status(201).json({
		userId: createdUser.id,
		email: createdUser.email,
		token,
	});
};

const login = async (req, res, next) => {
	const { email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		return next(new HttpError('loggin In failed please try again', 500));
	}
	if (!existingUser) {
		return next(
			new HttpError('Invalid credentials, could not log you in', 401)
		);
	}

	let isValidPassword = false;
	try {
		isValidPassword = await bcrypt.compare(password, existingUser.password);
	} catch (err) {
		return next(
			new HttpError(
				'could not log you in, Please check your credentials and try again.',
				500
			)
		);
	}
	if (!isValidPassword) {
		return next(
			new HttpError('Invalid credentials, could not log you in.', 403)
		);
	}

	let token;
	try {
		token = jwt.sign(
			{ userId: existingUser.id, email: existingUser.email },
			process.env.JWT_KEY,
			{ expiresIn: '1h' }
		);
	} catch (err) {
		return next(new HttpError('Logging failed, please login again.', 500));
	}

	/* res.status('200').json({
		message: 'Logged in',
		user: existingUser.toObject({ getters: true }),
	}); */
	res.status('200').json({
		userId: existingUser.id,
		email: existingUser.email,
		token,
	});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
