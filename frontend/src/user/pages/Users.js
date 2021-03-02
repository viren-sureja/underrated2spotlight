import React from 'react';
import UsersList from '../components/UsersList';

const Users = () => {
	const USERS = [
		{
			id: 'u1',
			name: 'viren',
			places: 1,
			image: 'https://source.unsplash.com/random/170x170',
		},
	];

	return <UsersList items={USERS} />;
};

export default Users;
