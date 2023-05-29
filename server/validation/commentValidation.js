const { errorMessages, customExist } = require('../services/validationService');
const { COMMENT_FIELD } = require('../services/commentService')


const commentText = {
	optional: true,
	in: 'body',
	notEmpty: {
		errorMessage: errorMessages.notEmpty(COMMENT_FIELD.TEXT),
		bail: true
	},
	isString: {
		errorMessage: errorMessages.isString(COMMENT_FIELD.TEXT)
	},
	escape: true,
	trim: true
};


module.exports = {
	commentText,
}