const uuid = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
	{
		id: 'u1',
		name: 'VIREN',
		email: 'viren@viren.gmail',
		password: '1234',
	},
];

const getUsers = (req, res, next) => {
	res.json({ users: DUMMY_USERS });
};
const signup = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new HttpError('Invalid inputs passed, please check your data', 422);
	}
	const { name, email, password } = req.body;

	const hasUser = DUMMY_USERS.find((u) => u.email === email);

	if (hasUser) {
		throw new HttpError(
			'provided email is registered, please proceed to login',
			422
		);
	}

	const createdUser = {
		id: uuid.v4(),
		name,
		email,
		password,
	};
	DUMMY_USERS.push(createdUser);
	res.status(201).json({ user: createdUser });
};
const login = (req, res, next) => {
	const { email, password } = req.body;
	const user = DUMMY_USERS.find((u) => {
		return u.email === email;
	});
	if (!user)
		throw new HttpError(
			'Could not identify the user, email-id is wrong',
			401
		);
	if (user.password !== password)
		throw new HttpError('password is wrong', 401);
	res.status('200').json({ message: 'Logged in' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
