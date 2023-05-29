const movieService = require('../services/movieService');
const { cache, cacheControl } = require('../services/cacheService');
const { models } = require('../models');
const express = require('express');
const movieRouter = express.Router();
const validationChains = require('../validation/movieValidation');
const { body, param, checkSchema } = require('express-validator');
const { errorsFormatter, errorHandler } = require('../services/validationService');
const { autorization } = require('../security/authorization')
const { pasportAuthentication } = require('../security/passport');
const mongoose = require('mongoose');


movieRouter.get(
	"/movies",
	async (req, res, next) => {
		const { sort = null, ...filters } = req.query;
		if(JSON.stringify(req.query) === "{}") return next("route");
		try {
			const query = models.movieModel.find({});
			movieService.service(query, filters, sort);
			query.select("title");
			const movies = await query.exec();
			res.status(200).send(movies);
		}catch (error) {
			error.name === "Error" ? 
				res.status(400).send(error.message) : 
				res.status(500).send(error.message)
		}
	}
)


movieRouter.get(
	"/movies",
	cacheControl("allMovies"),
	async(req, res) => {
		try{
			const query = models.movieModel.find({});
			query.select("title");
			query.orFail(new Error("movies not found"));
			const movies = await query.exec();
			cache.set("allMovies", movies, 2 * 3600);
			res.status(200).send(movies);
		}catch(error) {
			res.status(500).send(error.message);
		}
	}
)


movieRouter.get(
	"/movies/:movieId", 
	param('movieId', "Invalid movie ID").escape().trim().isMongoId(),
	errorHandler(errorsFormatter),
	async(req, res) => {
		const { movieId } = req.params;
		try{
			const query = models.movieModel.findById(movieId);
			query.populate(['category', 'director', 'comments']);
			query.orFail(new Error("Incorrect movieId"));
			const movie = await query.exec();
			res.status(200).send(movie);
		}catch(error) {
			error.name === "Error" ? 
				res.status(400).send(error.message) : 
				res.status(500).send(error.message)
		}
	}
)


movieRouter.post(
	"/movies",
	pasportAuthentication(),
	autorization(['admin']),
	body(movieService.REQUIRED_FIELDS).exists({checkNull: true}),
	checkSchema(validationChains),
	checkSchema({"category.*": validationChains.categoryItems}),
	errorHandler(errorsFormatter),
	async (req, res) => {
		const movieData = req.body;
		const session = await mongoose.startSession();
		try{
			const movie = await movieService.createMovie(session, movieData);
			res.status(200).send(movie);
			cache.del("allMovies");
		}catch(error) {
			error.name === "Error" ? 
				res.status(400).send(error.message) : 
				res.status(500).send(error.message)
		}finally {
			session.endSession()
		}
	}
);


movieRouter.put(
	"/movies/:movieId",
	pasportAuthentication(),
	autorization(['admin']),
	param('movieId', "Invalid movie ID").escape().trim().isMongoId(),
	checkSchema(validationChains),
	checkSchema({"category.*": validationChains.categoryItems}),
	errorHandler(errorsFormatter),
	async(req, res) => {
		const { movieId } = req.params;
		const update = req.body;
		const session = await mongoose.startSession();
		try{
			await movieService.updateMovie(session, update, movieId);
			res.status(201).send("Movie succesfully updated");
			cache.del("allMovies");
		}catch(error) {
			error.name === "Error" ? 
				res.status(400).send(error.message) : 
				res.status(500).send(error.message)
		}
	}
)


movieRouter.delete(
	"/movies/:movieId",
	pasportAuthentication(),
	autorization(['admin']),
	param('movieId', "Invalid movie ID").escape().trim().isMongoId(),
	errorHandler(errorsFormatter), 
	async(req, res) => {
		const { movieId } = req.params;
		const session = await mongoose.startSession();
		try{
			await movieService.deleteMovie(session, movieId);
			res.status(200).send("Movie succesfulsy deleted");
			cache.del("allMovies");
		}catch(error) {
			error.name === "Error" ? 
				res.status(400).send(error.message) : 
				res.status(500).send(error.message)
		}finally {
			session.endSession();
		}
	}
)


module.exports = movieRouter