'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weather = require('./data/weather.json');
const app = express();
app.use(cors());
const PORT = process.env.PORT;

app.get('./data/weather.json');
app.get('/weather',getWeather);
app.get('/*', (req, res) => res.status(403).send('not found'));


class Forecast {
    constructor(obj) {
        this.date = obj.valid_date;
        this.description = obj.weather.description;
    }
}

function getWeather(req, res) {
    let searchQuery = req.query.city;
    let lat = req.query.lat;
    let lon = req.query.lon;

    try {
        const cityToSend = weather.find(city => {
            if((city.lat === lat && city.lon === lon) || city.city_name === searchQuery) {
                return true;
            }
            return false;
        });
        if (cityToSend) {
            const forecastData = cityToSend.data.map(city => new Forecast(city));
            res.status(200).send(forecastData);
        } else {
            res.status(404).send('Not Found');
        }
    } catch (e) {
        res.status(500).send('server error');
    }
}

app.listen(PORT, () => console.log(`Listening at port:${PORT}`));




