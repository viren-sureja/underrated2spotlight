import React from 'react';
import UsersList from '../components/UsersList';

const Users = () => {
	const USERS = [
		{
			id: 'u1',
			name: 'viren',
			places: 1,
			image: 'https://source.unsplash.com/random/1080x720',
		},
	];

	return <UsersList items={USERS} />;
};

export default Users;
