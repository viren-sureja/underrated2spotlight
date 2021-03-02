import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch,
} from 'react-router-dom';

import './index.css';
import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation.js';
import UserPlaces from './places/pages/UserPlaces';

function App() {
	return (
		<Router>
			<MainNavigation />
			<main>
				<Switch>
					<Route path="/" exact>
						<Users />
					</Route>
					<Route path="/places/new" exact>
						<NewPlace />
					</Route>
					<Route path="/:userId/places" exact>
						<UserPlaces />
					</Route>
					<Redirect to="/" />
				</Switch>
			</main>
		</Router>
	);
}
export default App;
