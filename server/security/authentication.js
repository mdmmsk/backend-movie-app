const { models, schemas } = require('../models')
const { TokenMethods } = require('../security/webToken');
const userService = require("../services/userService")


async function authentication(email, password){
	try{
		const query = models.userModel.find({});
		query.select(['token', 'email', 'username']);
		userService.service(query, { email });
		const user = await query.exec();
		if(!user.length) throw new Error('User with such e-mail was not found');
		const decoded = TokenMethods.parse(user[0].token)
		if(decoded.password === password) {
			return user[0];
		}
		throw new Error("Invalid password");
	}catch(error) {
		throw error
	}
}


module.exports = {
	authentication,
}