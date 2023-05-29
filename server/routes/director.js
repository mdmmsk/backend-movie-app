const validationChains = require("../validation/directorValidation");
const directorService = require("../services/directorService");
const { errorsFormatter, errorHandler } = require('../services/validationService');
const { models } = require("../models");
const express = require("express");
const directorRouter = express.Router();
const { param, body, checkSchema } = require('express-validator');
const { autorization } = require('../security/authorization')
const { pasportAuthentication } = require('../security/passport');


directorRouter.get(
	"/directors", 
	async(req, res) => {
		const { sort, ...filters } = req.query;
		try {
			const query = models.directorModel.find({});
			directorService.service(query, filters, sort);
			query.populate("moviesList");
			const directors = await query.exec();
			res.status(200).send(directors);
		}catch(error) {
			error.name === "Error" ? 
				res.status(400).send(error.message) : 
				res.status(500).send(error.message)
		}
	}
)


directorRouter.get(
	"/directors/:directorId",
	param('directorId', "Invalid directorId").escape().trim().isMongoId(), 
	errorHandler(errorsFormatter),
	async(req, res) => {
		const { directorId } = req.params;
		try {
			const query = models.directorModel.findById(directorId);
			query.populate("moviesList");
			const director = await query.exec();
			res.status(200).send(director);
		}catch(error) {
			error.name === "Error" ? 
				res.status(400).send(error.message) : 
				res.status(500).send(error.message)
		}
	}
)


directorRouter.post(
	"/directors",
	pasportAuthentication(),
	autorization(['admin']),
	body(["name", "surname"]).exists({checkNull: true}),
	checkSchema(validationChains),
	errorHandler(errorsFormatter),
	async(req, res) => {
		const directorData = req.body;
		try {
			const director = await models.directorModel.create(directorData);
			res.status(201).send(director);
		}catch(error) {
			error.name === "Error" ? 
				res.status(400).send(error.message) : 
				res.status(500).send(error.message)
		}
	}
)


directorRouter.put(
	"/directors/:directorId",
	pasportAuthentication(),
	autorization(['admin']),
	param('directorId', "Invalid directorId").escape().trim().isMongoId(), 
	checkSchema(validationChains),
	errorHandler(errorsFormatter), 
	async(req, res) => {
		const { directorId } = req.params;
		const updateData = req.body;
		try {
			const updateResult = await directorService.updateDirector(directorId, updateData)
			res.status(200).send(updateResult);
		}catch(error) {
			error.name === "Error" ? 
				res.status(400).send(error.message) : 
				res.status(500).send(error.message)
		}
	}
)


directorRouter.delete(
	"/directors/:directorId",
	pasportAuthentication(),
	autorization(['admin']),
	param('directorId', "Invalid directorId").escape().trim().isMongoId(), 
	errorHandler(errorsFormatter), 
	async(req, res) => {
		const { directorId } = req.params;
		try {
			const deletedDirector = await models.directorModel.
				findByIdAndRemove(directorId).
				orFail(new Error("Incorrect directorId"));
			res.status(200).send(deletedDirector);
		}catch(error) {
			error.name === "Error" ? 
				res.status(400).send(error.message) : 
				res.status(500).send(error.message)
		}
	}
)


module.exports = directorRouter