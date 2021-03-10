const fs = require('fs');
const uuid = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
// const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const mongoose = require('mongoose');

const getPlaceById = async (req, res, next) => {
	const placeId = req.params.pid;
	// const place = DUMMY_PLACES.find((p) => {
	// 	return p.id === placeId;
	// });
	let place;
	try {
		place = await Place.findById(placeId);
	} catch (err) {
		return next(
			new HttpError('Something went wrong, could not find a place.', 500)
		);
	}
	if (!place) {
		next(new HttpError('Could not find a place for the provided id.', 404));
	}
	res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
	const userId = req.params.uid;

	let places;
	// another method;
	// let userWithPlaces;
	try {
		places = await Place.find({ creator: userId });
		// userWithPlaces = await User.findById(userId).populate('places');
	} catch (err) {
		const error = new HttpError(
			'Fetching places failed, please try again later',
			500
		);
		return next(error);
	}

	if (!places || places.length === 0) {
		return next(
			new HttpError('Could not find places for the provided user id.', 404)
		);
	}

	res.json({
		places: places.map((place) => place.toObject({ getters: true })),
	});
};

const createPlace = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError('Invalid inputs passed, please check your data', 422)
		);
	}
	const { title, description, address } = req.body;

	// use address to fetch coordinates
	/* 
	// let coordinates;
	try {
		coordinates = await getCoordsForAddress(address);
	} catch (error) {
		return next(error);
	} 
	*/

	const createdPlace = new Place({
		title,
		description,
		address,
		location: {
			lat: 27.1764142,
			lng: 78.0402217,
		},
		image: req.file.path,
		creator: req.userData.userId,
	});
	let user;
	try {
		user = await User.findById(req.userData.userId);
	} catch (err) {
		return next(
			new HttpError('Creating place failed, please try again :)', 500)
		);
	}
	if (!user) {
		return next(new HttpError('Could not find user for provided id', 404));
	}

	// DUMMY_PLACES.push(createdPlace);
	// console.log(req.body);
	try {
		// we use session so that to complete isolated independent task to finish at single time.
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await createdPlace.save({ session: sess }); // save createdPlace to place collection
		user.places.push(createdPlace); // pushes place to user's
		await user.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		// console.log(err);
		return next(
			new HttpError('Creating place failed, please try again :)', 500)
		);
	}
	res.status(200).json({ message: 'successfully created!!!' });
};

const updatePlace = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		next(new HttpError('Invalid inputs passed, please check your data', 422));
	}
	const { title, description } = req.body;
	const placeId = req.params.pid;

	let place;
	try {
		place = await Place.findById(placeId);
	} catch (err) {
		return new HttpError(
			'Something went wrong, could not update places.',
			500
		);
	}

	if (place.creator.toString() !== req.userData.userId) {
		return next(
			new HttpError('You are not allowed to edit this place.', 401)
		);
	}

	place.title = title;
	place.description = description;
	try {
		await place.save();
	} catch (err) {
		return new HttpError('something went wrong, could not add to db.', 500);
	}

	res.status(200).json({ place: place.toObject({ getters: true }) });
};
const deletePlace = async (req, res, next) => {
	const placeId = req.params.pid;
	let place;

	try {
		place = await Place.findById(placeId).populate('creator');
	} catch (err) {
		return next(
			new HttpError('Something went wrong plz try to delete again.', 500)
		);
	}
	if (!place) {
		return next(new HttpError('Could not find place for this id.', 404));
	}

	if (place.creator.id !== req.userData.userId) {
		return next(
			new HttpError('you are not alllowed to delete this place.', 401)
		);
	}

	const imagePath = place.image;

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await place.remove({ session: sess });
		place.creator.places.pull(place);
		await place.creator.save({ session: sess });
		sess.commitTransaction();
	} catch (err) {
		return new HttpError(
			'Something went wrong plz try to delete again.',
			500
		);
	}

	try {
		await place.remove();
	} catch (err) {
		return new HttpError('could not delete an item', 500);
	}
	fs.unlink(imagePath, (err) => {
		// console.log(err);
	});
	res.status(200).json({ message: 'Deleted place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
