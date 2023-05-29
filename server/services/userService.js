const { parseSortParam } = require("../services/dbService");
const { TokenMethods } = require('../security/webToken');
const { schemas, models } = require("../models");


async function createUser(data) {
	const { email, username, password } = data;
	const token = TokenMethods.create({email, password});
	const userData = { email, username, token };
	try {
		const user = await models.userModel.create(userData);
		return user;
	} catch (error) {
		throw error;
	}
	
}


async function setFavorites(userId, operation, movieId) {
	const updateUserFavorites = (operation === "add") ? 
		{ $addToSet: { favorites: movieId } } : 
		{ $pull: { favorites: movieId } };
	try{
		const { favorites } = await models.userModel.
			findByIdAndUpdate(userId, updateUserFavorites, { new: true }).
			populate("favorites");
		return favorites;
	}catch (error) {
		throw error;
	}
}


async function updateEmail(userId, token, newEmail) {
	const { password } = TokenMethods.parse(token);
	const newToken = TokenMethods.create({ email: newEmail, password });
	const update = { email: newEmail, token: newToken }
	try {
		const updatedUser = await models.userModel.
			findByIdAndUpdate(userId, update, { new: true }).
			select(["username", "email", "token"]);
		return updatedUser;
	} catch (error) {
		throw error;
	}
}


async function updatePassword(userId, token, passwords) {
	const { oldPassword, newPassword } = passwords;
	const { email, password: currentPassword } = TokenMethods.parse(token);
	// console.log(currentPassword);
	if( currentPassword !== oldPassword) throw new Error('Unexpected old password');
	const newToken = TokenMethods.create({ email, password: newPassword });
	try {
		const updatedUser = await models.userModel.
			findByIdAndUpdate(userId, { token: newToken }, { new: true }).
			select(["username", "email", "token"]);
		return updatedUser;
	} catch (error) {
		throw error;
	}
}


async function updatePublicFields(userId, updateData) {
	const update = publicUpdateDataHandler(updateData);
	try {
		if(JSON.stringify(update) === "{}") {
			throw new Error("Incorrect document fields for update");
		}
		const updatedUser = await models.userModel.
			findByIdAndUpdate(userId, update, { new: true }).
			select(["username", "email", "favorites"]);
		return updatedUser;
	} catch(error) {
		throw error;
	}
}

function publicUpdateDataHandler(updateData) {
	const { username } = updateData;
	return {
		...(username && { username }),
	}
}


async function updateUserDataByAdmin(userId, updateData) {
	const update = updateDataHandlerForAdmin(updateData);
	try {
		if(JSON.stringify(update) === "{}") {
			throw new Error("Incorrect document fields for update");
		}
		const updatedUser = await models.userModel.
			findByIdAndUpdate(userId, update, { new: true }).
			orFail(new Error("Incorrect userId"));
		return updatedUser;
	} catch (error) {
		throw error;
	}
}

function updateDataHandlerForAdmin(updateData) {
	const { username, roles } = updateData;
	return {
		...(username && { username }),
		...(roles && { roles }),
	}

}


const USER_FIELDS = {
	EMAIL: "email",
	USER_NAME: "username",
	ROLES: "roles",
	PASSWORD: "password"
}


const service = (query, filters, sort) => {
	const { userId, username, email, role } = filters;
	userId && query.where({ _id: userId});
	username && query.where({ username: username });
	email && query.where({ email: email });
	role && query.where({ roles: { $all: [role] } });
	if (sort) {
		const sortOrders = parseSortParam(sort);
		query.sort(Object.assign({}, ...sortOrders));
	}
}


function userToJSON(doc, ret, options) {
	delete ret.token;
	delete ret.__v;
	return ret;
}


module.exports = {
	USER_FIELDS,
	userToJSON,
	service,
	createUser,
	setFavorites,
	updateEmail,
	updatePassword,
	updatePublicFields,
	updateUserDataByAdmin
}