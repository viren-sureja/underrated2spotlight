import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import Card from '../../shared/components/UIElements/Card';
import { useForm } from '../../shared/hooks/FormHook';
import {
	VALIDATOR_MINLENGTH,
	VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import './PlaceForm.css';

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

const UpdatePlace = () => {
	const [isLoading, setIsLoading] = useState(true);
	const placeId = useParams().placeId;
	const indentifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

	const [formState, inputHandler, setFormData] = useForm(
		{
			title: {
				value: '',
				isValid: false,
			},
			description: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	useEffect(() => {
		if (indentifiedPlace) {
			setFormData(
				{
					title: {
						value: indentifiedPlace.title,
						isValid: true,
					},
					description: {
						value: indentifiedPlace.description,
						isValid: true,
					},
				},
				true
			);
		}
		setIsLoading(false);
	}, [setFormData, indentifiedPlace]);

	const placeUpdateSubmitHandler = (event) => {
		event.preventDefault();
		console.log(formState.inputs);
	};

	if (!indentifiedPlace) {
		return (
			<div className="center">
				<Card>
					<h2>Could not find place!</h2>
				</Card>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="center">
				<h2>Loading...</h2>
			</div>
		);
	}

	return (
		<form className="place-form" onSubmit={placeUpdateSubmitHandler}>
			<Input
				id="title"
				element="input"
				type="text"
				label="Title"
				validators={[VALIDATOR_REQUIRE()]}
				errorText="please enter a valid title"
				onInput={inputHandler}
				initialValue={formState.inputs.title.value}
				initialValid={formState.inputs.title.isValid}
			/>
			<Input
				id="description"
				element="textarea"
				label="Description"
				validators={[VALIDATOR_MINLENGTH(5)]}
				errorText="please enter a valid description (with 5 or more characters)"
				onInput={inputHandler}
				initialValue={formState.inputs.description.value}
				initialValid={formState.inputs.description.isValid}
			/>
			<Button type="submit" disabled={!formState.isValid}>
				Update Place
			</Button>
		</form>
	);
};

export default UpdatePlace;
