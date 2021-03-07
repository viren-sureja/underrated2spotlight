import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import {
	VALIDATOR_MINLENGTH,
	VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import './PlaceForm.css';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/FormHook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

const NewPlace = () => {
	const auth = useContext(AuthContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
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
	const history = useHistory();

	const placeSubmitHandler = async (event) => {
		event.preventDefault();
		try {
			await sendRequest(
				'http://localhost:5000/api/places/',
				'POST',
				JSON.stringify({
					title: formState.inputs.title.value,
					description: formState.inputs.description.value,
					address: formState.inputs.address.value,
					creator: auth.userId,
				}),
				{ 'Content-Type': 'application/json' }
			);
			history.push('/');
		} catch (err) {}
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && <LoadingSpinner asOverlay />}
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
		</React.Fragment>
	);
};

export default NewPlace;
