const { sign, decode } = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');


const TokenMethods = {
	create(payload) {
		try{
			return sign(payload, JWT_SECRET);
		}catch(error) {
			throw error
		}
	},
	parse(token) {
		try{
			return decode(token);
		}catch(error) {
			throw error
		}
	}
}


module.exports = {
	TokenMethods,
}