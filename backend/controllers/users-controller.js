const uuid = require('uuid');
const { validationResult } = require('express-validator');

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
		console.log(existingUser == true);
		return next(
			new HttpError('User exists already, please login instead.', 422)
		);
	}

	const createdUser = new User({
		name,
		email,
		image: req.file.path,
		password,
		places: [],
	});

	try {
		await createdUser.save();
	} catch (err) {
		return next(
			new HttpError('User signUp failed, please signUp again.', 500)
		);
	}
	res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
	const { email, password } = req.body;
	// const user = DUMMY_USERS.find((u) => {
	// 	return u.email === email;
	// });
	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		return next(new HttpError('loggin In failed please try again', 500));
	}
	if (!existingUser)
		return next(
			new HttpError(
				'Could not identify the user, email-id is wrong or not registered process to signup or try different email-id',
				401
			)
		);
	if (existingUser.password !== password)
		return next(new HttpError('password is wrong. please try again', 401));
	res.status('200').json({
		message: 'Logged in',
		user: existingUser.toObject({ getters: true }),
	});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
