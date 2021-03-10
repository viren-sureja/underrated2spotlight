const express = require('express');
const { check } = require('express-validator');

const checkAuth = require('../middleware/check-auth');
const fileUplaod = require('../middleware/file-upload');
const placesControllers = require('../controllers/places-controller');

const router = express.Router();

// GET routes: open to all
router.get('/:pid', placesControllers.getPlaceById);
router.get('/user/:uid', placesControllers.getPlacesByUserId);

// middleware to check the route
router.use(checkAuth);

// POST routes: for authorised only :)
router.post(
	'/',
	fileUplaod.single('image'),
	[
		check('title').not().isEmpty(),
		check('description').isLength({ min: 5 }),
		check('address').not().isEmpty(),
	],
	placesControllers.createPlace
);
router.patch(
	'/:pid',
	[check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
	placesControllers.updatePlace
);
router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;
