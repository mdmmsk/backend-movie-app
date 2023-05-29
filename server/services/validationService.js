const { validationResult } = require('express-validator');


const errorMessages = {
	exists(field) {
		return `There is no field ${field}`
	},
	notEmpty(field) {
		return  `Empty value of the ${field} field`
	},
	isString(field) {
		return `The field ${field} must be a string`
	},
	isArray(field) {
		return `The field ${field} must be held only array`
	},
	isObject(field) {
		return 	`The field ${field} must be held only object`
	},
	isMongoId(field) {
		return `The field ${field} must be held array width ID document`
	},
	isEmail() {
		return `Invalid email format (like example@domain.tld)`
	},
	isInt(field) {
		return `The field ${field} must be a integer`
	},
	isLength(field, format) {
		return `The field ${field} must be long ${format} symbols`
	},
	isAlpha(field){
		return `The field ${field} must be held only letters and "-"`
	}
}


async function validate(data, model) {
	try{
		return await model.validate(data);
	}catch(error) {
		throw error
	}
}


const errorsFormatter = validationResult.withDefaults({formatter: error => {
	return {
		field: error.param,
		message: error.msg,
		invalidValue: error.value,
	}
}})


function errorHandler(customValidationResult) {
	return (req, res, next) => {
		const errors = validationResult(req);
		const hasErrors = !errors.isEmpty()
		if(hasErrors) {
			res.status(400).send({errors: customValidationResult(req).array()});
		}else {
			next();
		}
	}
}


function existIdInCollection(model) {
	return async(value) => {
		try {
			const result = await model.exists({_id: value});
			if(result === null) {
				throw new Error("Invalid director id")
			}
			return true;
		}catch(error) {
			throw error
		}
	}
}


function customExist() {
	return value => value === undefined ? false : true
}


module.exports = { 
	errorsFormatter, 
	errorHandler,
	customExist,
	validate, 
	errorMessages,
	existIdInCollection 
}