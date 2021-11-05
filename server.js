'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const getWeather = require('./weather.js');
const getMovies = require('./movie.js');
const app = express();
app.use(cors());

const PORT = process.env.PORT;

app.get('/weather', getWeather);
app.get('/movies', getMovies);
app.get('/*', (req, res) => res.status(404).send('NOT FOUND'));

app.listen(PORT, () => console.log(`Listening at port:${PORT}`));
