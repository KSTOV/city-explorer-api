'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weather = require('./data/weather.json');
const app = express();
app.use(cors());
const PORT = process.env.PORT;

class Forecast {
    constructor(date, description) {
        this.date = date;
        this.description = description;
    }
}

function getWeather(req, res) {
    res.status(200).send(weather);
    let weatherQuery = req.query;

    let result = weather.find(city => city.city_name.toLowerCase() === weatherQuery.city_name.toLowerCase() && Math.floor(city.lat) === Math.floor(weatherQuery.lat) && Math.floor(city.lon) === Math.floor(weatherQuery.lon));

    let forcast = result ? result.data.map(day => new Forecast(day.valid_date, day.weather.description)) : false;

    if(forcast){
        res.send(forcast);
    } else {
        res.status(403).send('not found');
    }
}

app.get('./data/weather.json');
app.get('/weather',getWeather);
app.get('/*', (req, res) => res.status(403).send('not found'));
app.listen(PORT, () => console.log(`Listening at port:${PORT}`));




