'use strict';
require('dotenv').config();
const axios = require('axios');
const cache = require('./cache.js');

const movieAPI = process.env.MOVIE_API_KEY;

class Movies {
    constructor(obj) {
        this.title = obj.title;
        this.overview = obj.overview;
        this.image_url = `https://image.tmdb.org/t/p/w500${obj.poster_path}`
        this.popularity = obj.popularity;
        this.release_date = obj.release_date;
    }
}

let getMovies = async (req, res) => {

    let movieName = req.query.query;

    if(cache[movieName] && (Date.now() - cache[movieName].timestamp) < 200000) {
        res.status(200).send(cache[movieName]);
    } else {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${movieAPI}&query=${movieName}&page=1`;
        try {
            let result = await axios(url);
            let movieData = result.data.results.map(movie => new Movies(movie));
            console.log(movieData);
            if(movieData) {
                cache[movieName] = movieData;
                cache[movieName].timestamp = Date.now();
                res.status(200).send(movieData)
            } else {
                res.status(404).send('IT NOT WORK  ¯\_(ツ)_/¯ ')
            }
        } catch {
            return res.status(500).send('MOVIE DATA NOT FOUND.');
        }
    }

}

module.exports = getMovies;