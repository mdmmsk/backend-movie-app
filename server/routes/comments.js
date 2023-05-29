const express = require("express");
const mongoose = require('mongoose');
const commentService = require('../services/commentService');
const validationChains = require('../validation/commentValidation');
const commentRouter = express.Router();
const { models } = require("../models");
const { errorsFormatter, errorHandler } = require('../services/validationService');
const { param, checkSchema, body } = require('express-validator');
const { autorization } = require('../security/authorization')
const { pasportAuthentication } = require('../security/passport');


commentRouter.get(
	"/movies/:movieId/comments",
	param('movieId', "Invalid movieId").escape().trim().isMongoId(), 
	errorHandler(errorsFormatter),
	async(req, res) => {
		const { movieId } = req.params;
		try{
			const query = models.movieModel.findById(movieId);
			query.select("comments");
			query.populate({ path: 'comments', populate: { path: 'author' } });
			query.orFail(new Error("Documents not found"));
			const { comments } = await query.exec();
			res.status(200).send(comments);
		}catch(error) {
			res.status(500).send(error);
		}
	}
)


commentRouter.post(
	"/movies/:movieId/comments",
	pasportAuthentication(),
	autorization(['client']),
	param('movieId', "Invalid movieId").escape().trim().isMongoId(),
	body(["commentText"]).exists({checkNull: true}),
	checkSchema(validationChains),
	errorHandler(errorsFormatter),
	async(req, res) => {
		const { movieId } = req.params;
		const { commentText } = req.body;
		const session = await mongoose.startSession();
		try{
			const commentData = { commentText, author: req.user._id };
			const comment = await commentService.createComment(session, commentData, movieId);
			res.status(200).send(comment);
		}catch(error) {
			error.name === "Error" ? 
				res.status(400).send(error.message) : 
				res.status(500).send(error.message)
		}finally {
			session.endSession();
		}
	}
)


commentRouter.put(
	"/movies/:movieId/comments/:commentId",
	pasportAuthentication(),
	autorization(['client']),
	param('commentId', "Invalid movie ID").escape().trim().isMongoId(), 
	errorHandler(errorsFormatter), 
	async(req, res) => {
		const { commentId } = req.params;
		const author = req.user._id;
		const updateData = req.body;
		try{
			const updated = await commentService.updateComment(commentId, author, updateData);
			res.status(200).send(updated);
		}catch(error) {
			if(error.name === "Error") {
				res.status(400).send(error.message);
			}else {
				res.status(500).send(error.message);
			}
		}
	}
)


commentRouter.delete(
	"/movies/:movieId/comments/:commentId",
	pasportAuthentication(),
	autorization(['client']),
	param(["movieId", "commentId"], "Invalid movie ID").escape().trim().isMongoId(),
	errorHandler(errorsFormatter),   
	async(req, res) => {
		try{
			const session = await mongoose.startSession();
			const deleted = await commentService.deleteComment(session, req.params, req.user);
			res.status(200).send(deleted);
		}catch(error) {
			if(error.name === "Error") {
				res.status(400).send(error.message);
			}else {
				res.status(500).send(error.message);
			}
		}
	}
)


module.exports = commentRouter


