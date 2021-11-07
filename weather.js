'use strict';
require('dotenv').config();
const axios = require('axios');
const cache = require('./cache.js');

const weatherAPI = process.env.WEATHER_API_KEY;

class Forecast {
    constructor(obj) {
        this.date = obj.valid_date;
        this.description = obj.weather.description;
        this.clouds = obj.clouds;
        this.maxTemp = obj.max_temp;
        this.minTemp = obj.min_temp;
        this.highTemp = obj.min_temp;
        this.lowTemp = obj.low_temp;
    }
}

let getWeather = async (req, res) => {
    
    let lat = req.query.lat;
    let lon = req.query.lon;

    if(cache[lat, lon] && (Date.now() - cache[lat, lon].timestamp) < 200000) {
        res.status(200).send(cache[lat, lon]);
    } else {
        const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${weatherAPI}&days=10`;
        try {
            let result = await axios(url);
            console.log(result);
            let forcastData = result.data.data.map(forcast => new Forecast(forcast));
            console.log(forcastData);
            if(forcastData) {
                cache[lat, lon] = forcastData;
                cache[lat, lon].timestamp = Date.now();
                res.status(200).send(forcastData);
            } else {
                res.status(404).send('IT NOT WORK  ¯\_(ツ)_/¯ ');
            }
        } catch {
            return res.status(500).send('WEATHER DATA NOT FOUND.');
        }
    }
    
}

module.exports = getWeather;