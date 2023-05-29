const { USER_FIELDS } = require('../services/userService');
const { errorMessages } = require('../services/validationService');


const email = {
	optional: true,
	isEmail: {
		options: {
			allow_utf8_local_part: false,
			domain_specific_validation: true,
		},
		errorMessage: errorMessages.isEmail(),
		bail: true
	},
	normalizeEmail: true
};


const	username = {
	optional: true,
	isAlpha: {
		options: [undefined, {ignore: " -"}],
		errorMessage: errorMessages.isAlpha(USER_FIELDS.USER_NAME),
	},
	escape: true,
	trim: true,
}

const password = {
	optional: true,
	isString: {
		errorMessage: errorMessages.isString(USER_FIELDS.PASSWORD),
		bail: true
	},
	isLength: {
		options: {
			min: 8,
			max: 25
		},
		errorMessage: errorMessages.isLength(USER_FIELDS.PASSWORD, "more 8 and less 25"),
		bail: true
	},
	isAlphanumeric: {
		options: [
			undefined,
			{ignore: `!#$^`}
		]
	}
}


const roles = {
	optional: true,
	isArray: {
		option: {min: 1},
		errorMessage: errorMessages.exists(USER_FIELDS.ROLES),
	}
}


const role = {
	optional: true,
	isIn: {
		value: ["admin", 'client', 'moderator'],
		errorMessage: 'Invalid roles item',
	}
}


module.exports = {
	email,
	username,
	password,
	roles,
	role
}