import React from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';

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

const UserPlaces = () => {
	const userId = useParams().userId;
	const loadedPlaces = DUMMY_PLACES.filter(
		(places) => places.creator === userId
	);
	return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
