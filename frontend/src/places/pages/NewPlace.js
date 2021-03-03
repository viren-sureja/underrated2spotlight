import React from 'react';
import Input from '../../shared/components/FormElements/Input';
import {
	VALIDATOR_MINLENGTH,
	VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import './PlaceForm.css';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/FormHook';

const NewPlace = () => {
	const [formState, inputHandler] = useForm(
		{
			title: {
				value: '',
				isValid: false,
			},
			description: {
				value: '',
				isValid: false,
			},
			address: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const placeSubmitHandler = (event) => {
		event.preventDefault();
		console.log(formState.inputs);
	};

	return (
		<form className="place-form" onSubmit={placeSubmitHandler}>
			<Input
				id="title"
				type="text"
				label="Title"
				element="input"
				validators={[VALIDATOR_REQUIRE()]}
				errorText="please enter a valid title."
				onInput={inputHandler}
			/>
			<Input
				id="description"
				label="Description"
				element="textarea"
				validators={[VALIDATOR_MINLENGTH(5)]}
				errorText="please enter a valid description (atleast 5 character long)."
				onInput={inputHandler}
			/>
			<Input
				id="address"
				label="Address"
				element="input"
				validators={[VALIDATOR_REQUIRE()]}
				errorText="please enter a valid address."
				onInput={inputHandler}
			/>
			<Button type="submit" disabled={!formState.isValid}>
				Add Place
			</Button>
		</form>
	);
};

export default NewPlace;
