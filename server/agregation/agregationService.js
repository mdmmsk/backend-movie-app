const { models } = require('../models');
const express = require("express");
const aggregationRouter = express.Router();

async function getDirectorMovies(name, surname) {
	const agg = models.directorModel.aggregate();
	agg.match({$and: [{name}, {surname}]});
	agg.lookup({from: 'movies', localField: '_id', foreignField: 'director', as: 'MoviesList'});
	return await agg.catch((error) => {
		console.log(error);
	});
}


async function countMoviesFromTo(from, to) {
	const agg = models.movieModel.aggregate();
	agg.match({$and: [{"year": { $gte: +from }}, {"year": { $lte: +to }}]});
	agg.count("movieCount");
	return await agg.catch((error) => {
		console.log(error);
	});
}


async function favoriteMoviesCounts () {
	const agg = models.userModel.aggregate();
	agg.unwind("favorites");
	agg.lookup({ from: 'movies', localField: 'favorites', foreignField: '_id', as: 'favorites' })
	agg.sortByCount("favorites.title");
	return await agg.catch((error) => {
		console.log(error);
	});
}


aggregationRouter.get('/favorites-counts', async(req, res) => {
	const result = await favoriteMoviesCounts();
	res.status(200).send(result);
})


aggregationRouter.get("/directors/:name/:surname", async(req, res) => {
	const {name, surname} = req.params;
	const result = await getDirectorMovies(name, surname);
	res.status(209).send(result);
})

aggregationRouter.get('/movies/counter/:from-:to', async(req, res) => {
	const {from, to} = req.params;
	const result = await countMoviesFromTo(from, to);
	res.status(209).send(result);
})


module.exports = aggregationRouter
