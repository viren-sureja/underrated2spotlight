const express = require('express');
const { check } = require('express-validator');

const usersControllers = require('../controllers/users-controller');
const fileUplaod = require('../middleware/file-upload');
const router = express.Router();

// routes
router.get('/', usersControllers.getUsers);
router.post(
	'/signup',
	fileUplaod.single('image'),
	[
		check('name').not().isEmpty(),
		check('email').normalizeEmail().isEmail(),
		check('password').isLength({ min: 6 }),
	],
	usersControllers.signup
);
router.post('/login', usersControllers.login);

module.exports = router;
