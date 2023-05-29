const { DIRECTOR_FIELDS } = require("../services/directorService");
const { errorMessages } = require("../services/validationService")


const name = {
	optional: true,
	notEmpty: {
		errorMessage: errorMessages.notEmpty(DIRECTOR_FIELDS.NAME),
		bail: true
	},
	escape: true,
	trim: true,
	isString: {
		errorMessage: errorMessages.isString(DIRECTOR_FIELDS.NAME),
		bail: true
	},
};


const surname = {
	optional: true,
	notEmpty: {
		errorMessage: errorMessages.notEmpty(DIRECTOR_FIELDS.SURNAME),
		bail: true
	},
	escape: true,
	trim: true,
	isString: {
		errorMessage: errorMessages.isString(DIRECTOR_FIELDS.SURNAME),
		bail: true
	},
};


module.exports = {
	name, surname,
}