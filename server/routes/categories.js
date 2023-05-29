const validationChains = require('../validation/categoryValidation');
const { errorsFormatter, errorHandler } = require('../services/validationService');
const { models } = require("../models");
const express = require("express");
const categoryRouter = express.Router();
const { param, checkSchema, body } = require('express-validator');
const { autorization } = require('../security/authorization')
const { pasportAuthentication } = require('../security/passport');
const mongoose = require("mongoose");
const categoryService = require("../services/categoryService");



categoryRouter.get(
	"/categories",
	async(req, res) => {
		const { sort = null, ...filters } = req.query;
		try{
			const query = models.categoryModel.find({});
			categoryService.service(query, filters, sort);
			const categories = await query.exec();
			res.status(200).send(categories);
		}catch(error) {
			res.status(500).send(error.message);
		}
	}
)


categoryRouter.get(
	"/categories/:categoryId",
	param('categoryId', "Invalid movie ID").escape().trim().isMongoId(), 
	errorHandler(errorsFormatter),
	async(req, res) => {
		const { categoryId } = req.params;
		try{
			const query = models.categoryModel.findById(categoryId);
			query.populate("moviesList");
			query.orFail(new Error("Invalid categoryId"));
			const category = await query.exec();
			res.status(200).send(category);
		}catch(error) {
			error.name === "Error" ? 
				res.status(400).send(error.message) : 
				res.status(500).send(error.message)
		}
	}
)


categoryRouter.post(
	"/categories",
	pasportAuthentication(),
	autorization(['admin']),
	body(categoryService.REQUIRED_FIELDS, "No required fields").exists({ checkNull: true }),
	checkSchema(validationChains),
	errorHandler(errorsFormatter),
	async (req, res) => {
		const data = req.body;
		try {
			const createdComment = await models.categoryModel.create(data);
			res.status(200).send(createdComment);
		}catch(error) {
			res.status(500).send(error.message);
		}
	}
);


categoryRouter.put(
	"/categories/:categoryId",
	param('categoryId', "Invalid movie ID").escape().trim().isMongoId(),
	pasportAuthentication(),
	autorization(['admin']), 
	checkSchema(validationChains),
	errorHandler(errorsFormatter),  
	async(req, res) => {
		const { categoryId } = req.params;
		const { title } = req.body;
		try {
			const update = { title };
			const query = models.categoryModel.findByIdAndUpdate(categoryId, update);
			query.setOptions({ new: true });
			query.orFail(new Error("Document not found"));
			const updatedCategory = await query.exec();
			res.status(200).send(updatedCategory);
		}catch(error) {
			error.name === "Error" ? 
				res.status(400).send(error.message) : 
				res.status(500).send(error.message)
		}
	}
)


categoryRouter.delete(
	"/categories/:categoryId",
	pasportAuthentication(),
	autorization(['admin']), 
	param('categoryId', "Invalid categoryId").escape().trim().isMongoId(),
	errorHandler(errorsFormatter),  
	async(req, res) => {
		const { categoryId } = req.params;
		const session = await mongoose.startSession();
		try {
			await categoryService.deleteCategory(session, categoryId);
			res.status(200).send("Document succesfully deleted");
		}catch(error) {
			error.name === "Error" ? 
				res.status(400).send(error.message) : 
				res.status(500).send(error.message)
		}finally {
			await session.endSession();
		}
	}
)


module.exports = categoryRouter;