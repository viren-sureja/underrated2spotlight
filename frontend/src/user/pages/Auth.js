import React, { useContext, useState } from 'react';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
	VALIDATOR_EMAIL,
	VALIDATOR_MINLENGTH,
	VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import './Auth.css';
import { useForm } from '../../shared/hooks/FormHook';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

const Auth = () => {
	const auth = useContext(AuthContext);
	const [isLoginMode, setIsLoginMode] = useState(true);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [formState, inputHandler, setFormData] = useForm(
		{
			email: {
				value: '',
				isValid: false,
			},
			password: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const switchModeHandler = () => {
		if (!isLoginMode) {
			setFormData(
				{
					...formState.inputs,
					name: undefined,
					image: undefined,
				},
				formState.inputs.email.isValid && formState.inputs.password.isValid
			);
		} else {
			setFormData(
				{
					...formState.inputs,
					name: {
						value: '',
						isValid: false,
					},
					image: {
						value: null,
						isValid: false,
					},
				},
				false
			);
		}
		setIsLoginMode((prevMode) => !prevMode);
	};

	const authSubmitHandler = async (event) => {
		event.preventDefault();
		// console.log(formState.inputs);

		if (isLoginMode) {
			try {
				// console.log('form submitted');
				const responseData = await sendRequest(
					process.env.REACT_APP_BACKEND_URL + '/users/login',
					'POST',
					JSON.stringify({
						email: formState.inputs.email.value,
						password: formState.inputs.password.value,
					}),
					{ 'Content-Type': 'application/json' }
				);
				// console.log('form submitted');
				auth.login(responseData.userId, responseData.token);
			} catch (err) {}
		} else {
			try {
				const formData = new FormData();
				formData.append('email', formState.inputs.email.value);
				formData.append('name', formState.inputs.name.value);
				formData.append('password', formState.inputs.password.value);
				formData.append('image', formState.inputs.image.value);

				const responseData = await sendRequest(
					process.env.REACT_APP_BACKEND_URL + '/users/signup',
					'POST',
					formData
				);
				auth.login(responseData.userId, responseData.token);
			} catch (err) {}
		}
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<Card className="authentication">
				{isLoading && <LoadingSpinner asOverlay />}
				<h2>Login Required</h2>
				<hr />
				<form onSubmit={authSubmitHandler}>
					{!isLoginMode && (
						<Input
							element="input"
							id="name"
							type="text"
							label="User Name"
							validators={[VALIDATOR_REQUIRE()]}
							errorText="Please enter a valid user-name."
							onInput={inputHandler}
						/>
					)}
					{!isLoginMode && (
						<ImageUpload
							center
							id="image"
							onInput={inputHandler}
							errorText="Please provide an image."
						/>
					)}
					<Input
						element="input"
						id="email"
						label="E-mail"
						type="email"
						validators={[VALIDATOR_EMAIL()]}
						errorText="Please enter a valid email address."
						onInput={inputHandler}
					/>
					<Input
						element="input"
						id="password"
						label="Password"
						type="password"
						validators={[VALIDATOR_MINLENGTH(6)]}
						errorText="Please enter a valid password of atleast 6 characters long."
						onInput={inputHandler}
					/>
					<Button type="submit" disabled={!formState.isValid}>
						{isLoginMode ? 'Login' : 'SignUp'}
					</Button>
				</form>
				<Button inverse onClick={switchModeHandler}>
					Switch to {isLoginMode ? 'Signup' : 'Login'}
				</Button>
			</Card>
		</React.Fragment>
	);
};

export default Auth;
