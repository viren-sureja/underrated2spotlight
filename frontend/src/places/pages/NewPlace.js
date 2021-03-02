import React, { useCallback, useReducer } from 'react';
import Input from '../../shared/components/FormElements/Input';
import {
	VALIDATOR_MINLENGTH,
	VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import './NewPlace.css';
import Button from '../../shared/components/FormElements/Button';

const formReducer = (state, action) => {
	switch (action.type) {
		case 'INPUT_CHANGE':
			let formIsValid = true;
			for (const inputId in state.inputs) {
				if (inputId === action.inputId) {
					formIsValid = formIsValid && action.isValid;
				} else {
					formIsValid = formIsValid && state.inputs[inputId].isValid;
				}
			}
			return {
				...state,
				inputs: {
					...state.inputs,
					[action.inputId]: {
						value: action.value,
						isValid: action.isValid,
					},
				},
				isValid: formIsValid,
			};
		default:
			return state;
	}
};

const NewPlace = () => {
	const [formState, dispatch] = useReducer(formReducer, {
		inputs: {
			title: {
				value: '',
				isValid: false,
			},
			description: {
				value: '',
				isValid: false,
			},
		},
		isValid: false,
	});

	const inputHandler = useCallback((id, value, isValid) => {
		dispatch({
			type: 'INPUT_CHANGE',
			value: value,
			isValid: isValid,
			inputId: id,
		});
	}, []);

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
