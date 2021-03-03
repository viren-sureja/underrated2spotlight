const express = require('express');
const HttpError = require('../models/http-error');

const router = express.Router();

const DUMMY_PLACES = [
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

router.get('/:pid', (req, res, next) => {
	const placeId = req.params.pid;
	const place = DUMMY_PLACES.find((p) => {
		return p.id === placeId;
	});
	if (!place) {
		throw new HttpError('Could not find a place for the provided id.', 404);
	}
	res.json({ place });
});

router.get('/user/:uid', (req, res, next) => {
	const userId = req.params.uid;
	let places = [];
	DUMMY_PLACES.find((p) => {
		if (p.creator === userId) places.push(p);
	});

	if (!places.length) {
		return next(
			new HttpError('Could not find a user for the provided id.', 404)
		);
	}
	res.json({ places });
});

module.exports = router;
