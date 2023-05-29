const userService = require("../services/userService");
const validationChains = require('../validation/userValidation');
const { schemas, models } = require("../models");
const express = require("express");
const userRouter = express.Router();
const { body, param, checkSchema } = require('express-validator');
const { errorsFormatter, errorHandler } = require('../services/validationService');
const { authentication } = require('../security/authentication');
const { autorization } = require('../security/authorization');
const { pasportAuthentication } = require('../security/passport');


userRouter.get(
	"/users", 
	pasportAuthentication(),
	autorization(['admin']),
	async(req, res) => {
		const { sort = null, ...filters } = req.query;
		schemas.userSchema.set("toJSON", { transform: userService.userToJSON });
		try {
			const query = models.userModel.find({});
			query.populate('favorites');
			userService.service(query, filters, sort);
			const users = await query.exec();
			res.status(200).send(users)
		}catch(error) {
			error.name === "Error" ? 
				res.status(400).send(error.message) : 
				res.status(500).send(error.message)
		}
	}
)


userRouter.get(
	"/account",
	pasportAuthentication(),
	autorization(['client']),
	errorHandler(errorsFormatter),
	async(req, res) => {
		const userId = req.user._id;
		const token = req.user.token;
		try {
			schemas.userSchema.set("toJSON", { transform: userService.userToJSON });
			const user = await models.userModel.find({ _id: userId, token }).populate(["favorites"]);
			res.status(200).send(user);
		}catch(error) {
			error.name === "Error" ? 
				res.status(400).send(error.message) : 
				res.status(500).send(error.message)
		}
	}
)


userRouter.post(
	"/signup",
	body(['email', 'password'], "Fields 'email' and 'password' required").exists({checkNull: true}),
	checkSchema({ 
		email: validationChains.email, 
		username: validationChains.username, 
		password: validationChains.password,
	}),
	errorHandler(errorsFormatter),
	async(req, res) => {
		try {
			schemas.userSchema.set("toJSON", { transform: false });
			const user = await userService.createUser(req.body);
			res.status(201).send(user);
		}catch(error) {
			error.name === "Error" ? 
				res.status(400).send(error.message) : 
				res.status(500).send(error.message)
		}
	}
)


userRouter.post(
	"/login",
	body(['email', 'password'], "Fields 'email' and 'password' required").exists({checkNull: true}),
	checkSchema({ 
		email: validationChains.email, 
		password: validationChains.password, 
	}),
	errorHandler(errorsFormatter),
	async(req, res) => {
		const { email, password } = req.body;	
		try {
			schemas.userSchema.set("toJSON", { transform: false });
			const user = await authentication(email, password);
			res.status(200).send(user);
		}catch(error) {
			error.name === "Error" ? 
				res.status(400).send(error.message) : 
				res.status(500).send(error.message)
		}
	}
)


userRouter.post(
	'/set-favorites',
	pasportAuthentication(),
	autorization(['client']),
	body(['operation', 'movieId'], "Fields 'operation' and 'movieId' required").exists({checkNull: true}),
	body('operation', "value must be held add/delete").escape().trim().isIn(['add', "delete"]),
	body('movieId', "Invalid movieId").escape().trim().isMongoId(), 
	errorHandler(errorsFormatter), 
	async(req, res) => {
		const { operation, movieId } = req.body;
		const userId = req.user._id;
		try {
			const favorites = await userService.setFavorites(userId, operation, movieId);
			res.status(200).send(favorites);
		} catch (error) {
			error.name === "Error" ? 
				res.status(400).send(error.message) : 
				res.status(500).send(error.message)
		}
	}
)


userRouter.put(
	"/account/settings/email",
	pasportAuthentication(),
	autorization(['client']),
	body('newEmail', "Field 'newEmail' required").exists({checkNull: true}),
	checkSchema({ newEmail: validationChains.email }),
	errorHandler(errorsFormatter), 
	async(req, res) => {
		const { newEmail } = req.body;
		const userId = req.user._id;
		const token = req.user.token;
		try {
			schemas.userSchema.set("toJSON", { transform: false });
			const user = await userService.updateEmail(userId, token, newEmail);
			res.status(200).send(user);
		}catch(error) {
			error.name === "Error" ? 
				res.status(400).send(error.message) : 
				res.status(500).send(error.message)
		}
	}
)


userRouter.put(
	"/account/settings/security/password",
	pasportAuthentication(),
	autorization(['client']),
	body(['oldPassword', 'newPassword'], "Fields 'oldPassword' and 'newPassword' required").exists({checkNull: true}),
	checkSchema({ 
		oldPassword: validationChains.password, 
		newPassword: validationChains.password, 
	}),
	errorHandler(errorsFormatter), 
	async(req, res) => { 
		const userId = req.user._id;
		const token = req.user.token;
		try {
			schemas.userSchema.set("toJSON", { transform: false });
			const user = await userService.updatePassword(userId, token, req.body);
			res.status(200).send(user);
		}catch(error) {
			error.name === "Error" ? 
				res.status(400).send(error.message) : 
				res.status(500).send(error.message)
		}
	}
)


userRouter.put(
	"/account/settings/public",
	pasportAuthentication(),
	autorization(['client']),
	checkSchema({ username: validationChains.username }),
	errorHandler(errorsFormatter), 
	async(req, res) => { 
		const userId = req.user._id;
		try {
			schemas.userSchema.set("toJSON", { transform: false });
			const user = await userService.updatePublicFields(userId, req.body)
			res.status(200).send(user);
		}catch(error) {
			error.name === "Error" ? 
				res.status(400).send(error.message) : 
				res.status(500).send(error.message)
		}
	}
)


userRouter.put(
	"/users/:userId/settings",
	pasportAuthentication(),
	autorization(['admin']),
	param('userId', "Invalid userId").escape().trim().isMongoId(),
	checkSchema({ 
		username: validationChains.username,
		roles: validationChains.roles,
	}),
	body({'roles.*': validationChains.role}),
	errorHandler(errorsFormatter), 
	async(req, res) => { 
		const { userId } = req.params;
		try {
			schemas.userSchema.set("toJSON", { transform: userService.userToJSON });
			const user = await userService.updateUserDataByAdmin(userId, req.body);
			res.status(200).send(user);
		} catch(error) {
			error.name === "Error" ? 
				res.status(400).send(error.message) : 
				res.status(500).send(error.message)
		}
	}
)


userRouter.delete(
	"/users/:userId",
	pasportAuthentication(),
	autorization(['admin']),
	param('userId', "Invalid movie ID").escape().trim().isMongoId(), 
	errorHandler(errorsFormatter), 
	async(req, res) => {
		const { userId } = req.params;
		try {
			const deletedUser = await models.userModel.findByIdAndDelete(userId);
			res.status(200).send(deletedUser);
		}catch(error) {
			res.status(400).send(error);
		}
	}
)


module.exports = userRouter;

