import React, { useContext, useState } from 'react';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import Card from '../../shared/components/UIElements/Card';
import {
	VALIDATOR_EMAIL,
	VALIDATOR_MINLENGTH,
	VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import './Auth.css';
import { useForm } from '../../shared/hooks/FormHook';
import { AuthContext } from '../../shared/context/auth-context';

const Auth = () => {
	const auth = useContext(AuthContext);
	const [isLoginMode, setIsLoginMode] = useState(true);
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
				},
				false
			);
		}
		setIsLoginMode((prevMode) => !prevMode);
	};

	const authSubmitHandler = (event) => {
		event.preventDefault();
		console.log(formState.inputs);
		auth.login();
	};

	return (
		<Card className="authentication">
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
					validators={[VALIDATOR_MINLENGTH(5)]}
					errorText="Please enter a valid password of atleast 5 characters long."
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
	);
};

export default Auth;
