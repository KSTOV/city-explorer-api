'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
app.use(cors());

const PORT = process.env.PORT;
const weatherAPI = process.env.WEATHER_API_KEY;
const movieAPI = process.env.MOVIE_API_KEY;

class Forecast {
    constructor(obj) {
        this.date = obj.valid_date;
        this.description = obj.weather.description;
        this.clouds = obj.clouds;
        this.maxTemp = obj.max_temp;
        this.lowTemp = obj.low_temp;
    }
}

let getWeather = async (req, res) => {
    
    let lat = req.query.lat;
    let lon = req.query.lon;
    
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${weatherAPI}&days=5`;
    
    try {
        let result = await axios.get(url);
        console.log(result);
        let forcastData = result.data.data.map(forcast => new Forecast(forcast));
        console.log(forcastData);
        if(forcastData) {
            res.status(200).send(forcastData)
        } else {
            res.status(404).send('IT NOT WORK  ¯\_(ツ)_/¯ ')
        }
    } catch {
        return res.status(500).send('WEATHER DATA NOT FOUND.');
    }
}

class Movies {
    constructor(obj) {
        this.title = obj.title;
        this.overview = obj.overview;
        this.average_votes = obj.vote_average;
        this.total_votes = obj.vote_count;
        this.image_url = `https://image.tmdb.org/t/p/w500${obj.poster_path}`
        this.popularity = obj.popularity;
        this.released_date = obj.released_date;
    }
}

let getMovies = async (req, res) => {

    let movieName = req.query.keyword;

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${movieAPI}&query=${movieName}`;
    
    try {
        let result = await axios.get(url);
        let movieData = result.data.results.map(movie => new Movies(movie));
        console.log(movieData);
        if(movieData) {
            res.status(200).send(movieData)
        } else {
            res.status(404).send('IT NOT WORK  ¯\_(ツ)_/¯ ')
        }
    } catch {
        return res.status(500).send('MOVIE DATA NOT FOUND.');
    }
}
app.get('/weather', getWeather);
app.get('/movies', getMovies);
app.get('/*', (req, res) => res.status(404).send('NOT FOUND'));

app.listen(PORT, () => console.log(`Listening at port:${PORT}`));
