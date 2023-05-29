const { CATEGORY_FIELDS } = require('../services/categoryService');
const { errorMessages } = require('../services/validationService');


const title = {
	in: 'body',
	exists: {
		errorMessage: errorMessages.exists(CATEGORY_FIELDS.TITLE),
		bail: true
	},
	notEmpty: {
		errorMessage: errorMessages.notEmpty(CATEGORY_FIELDS.TITLE),
		bail: true
	},
	isString: {
		errorMessage: errorMessages.isString(CATEGORY_FIELDS.TITLE)
	},
	escape: true,
	trim: true
}


module.exports = {
	title,
}