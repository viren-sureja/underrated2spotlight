const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');
const DBURI = process.env.DBURI;
const PORT = process.env.PORT;

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
	const error = new HttpError('Could not find this route.', 404);
	throw error;
});

app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({ message: error.message || 'An unknown error occured!' });
});

// start db
mongoose
	.connect(DBURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) =>
		app.listen(PORT, () => console.log(`running on port ${PORT}`))
	)
	.catch((err) => console.log(err));
