const uuid = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
// const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');

let DUMMY_PLACES = [
	{
		id: 'p1',
		title: 'emp. state building',
		imageUrl:
			'https://lh5.googleusercontent.com/p/AF1QipPkbMIS9hMUlPb5oqcHlT4ekb44TdI9RlLITrId=w408-h510-k-no',
		description:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus aliquam exercitationem dignissimos sapiente sequi, suscipit libero corporis magnam alias officia reprehenderit, commodi a ut ipsa dolor vel architecto ullam delectus?',
		address: '20 W 34th st, New York, NY 10001',
		location: {
			lat: 40.7484405,
			lng: -73.9856644,
		},
		creator: 'u1',
	},
	{
		id: 'p3',
		title: 'emp. state building',
		imageUrl:
			'https://lh5.googleusercontent.com/p/AF1QipPkbMIS9hMUlPb5oqcHlT4ekb44TdI9RlLITrId=w408-h510-k-no',
		description:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus aliquam exercitationem dignissimos sapiente sequi, suscipit libero corporis magnam alias officia reprehenderit, commodi a ut ipsa dolor vel architecto ullam delectus?',
		address: '20 W 34th st, New York, NY 10001',
		location: {
			lat: 40.7484405,
			lng: -73.9856644,
		},
		creator: 'u1',
	},
	{
		id: 'p2',
		title: 'Statue of Unity',
		imageUrl:
			'https://lh5.googleusercontent.com/p/AF1QipN2pcAX-IKspn7MMGJORUT5oMUtVi8hX5B_uury=w408-h267-k-no',
		description:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus aliquam exercitationem dignissimos sapiente sequi, suscipit libero corporis magnam alias officia reprehenderit, commodi a ut ipsa dolor vel architecto ullam delectus?',
		address:
			'Sardar Sarovar Dam, Statue of Unity Rd, Kevadia, Gujarat 393155',
		location: {
			lat: 21.8380184,
			lng: 73.7168841,
		},
		creator: 'u2',
	},
];

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
	try {
		places = await Place.find({ creator: userId });
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
	const { title, description, coordinates, address, creator } = req.body;

	// to use the co-ordinates verify by giving
	/* 
	// let coordinates;
	try {
		coordinates = await getCoordsForAddress(address);
	} catch (error) {
		return next(error);
	} 
	*/
	console.log(req.body);
	const createdPlace = new Place({
		title,
		description,
		address,
		location: coordinates,
		image: 'https://source.unsplash.com/random/720x480',
		creator,
	});

	// DUMMY_PLACES.push(createdPlace);
	try {
		await createdPlace.save();
	} catch (err) {
		const error = new HttpError(
			'Creating place failed, please try again :)',
			500
		);
		return next(error);
	}

	res.status(201).json({ places: createdPlace });
};

const updatePlace = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		next(new HttpError('Invalid inputs passed, please check your data', 422));
	}
	const { title, description } = req.body;
	const placeId = req.params.pid;
	// const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) }; // make copy of an object.
	// const index = DUMMY_PLACES.findIndex((p) => p.id === placeId);
	let updatedPlace;
	try {
		updatedPlace = await Place.findById(placeId);
	} catch (err) {
		return new HttpError(
			'Something went wrong, could not update places.',
			500
		);
	}
	updatedPlace.title = title;
	updatedPlace.description = description;
	try {
		await updatedPlace.save();
	} catch (err) {
		return new HttpError('something went wrong, could not add to db.', 500);
	}
	// DUMMY_PLACES[index] = updatedPlace;
	res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};
const deletePlace = async (req, res, next) => {
	const placeId = req.params.pid;
	// if (!DUMMY_PLACES.find((p) => p.id === placeId))
	// 	throw new HttpError('Could not find a place for that id.', 404);
	// DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id != placeId);
	let place;
	try {
		place = Place.findById(placeId);
	} catch (err) {
		return new HttpError('could not find an item', 500);
	}
	try {
		await place.remove();
	} catch (err) {
		return new HttpError('could not delete an item', 500);
	}
	res.status(200).json({ message: 'Deleted place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
