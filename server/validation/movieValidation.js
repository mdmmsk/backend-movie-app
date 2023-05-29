const { MOVIE_FIELDS } = require('../services/movieService');
const { errorMessages, existIdInCollection } = require('../services/validationService');
const { models } = require('../models');


const title = {
	optional: true,
	notEmpty: {
		errorMessage: errorMessages.notEmpty(MOVIE_FIELDS.TITLE),
		bail: true
	},
	isString: {
		errorMessage: errorMessages.isString(MOVIE_FIELDS.TITLE)
	},
	escape: true,
	trim: true
};


const category = {
	optional: true,
	isArray: {
		option: {min: 1},
		errorMessage: errorMessages.exists(MOVIE_FIELDS.CATEGORY),
	}
};


const categoryItems = {
	optional: true,
	isMongoId: {
		errorMessage:  errorMessages.isMongoId(MOVIE_FIELDS.CATEGORY),
		bail: true
	},
	custom: {
		options: existIdInCollection(models.categoryModel)
	}
};


const year = {
	optional: true,
	trim: true,
	isInt: {
		errorMessage: errorMessages.isInt(MOVIE_FIELDS.YEAR),
		bail: true
	},
	isLength: {
		options: { min: 4, max: 4 },
		errorMessage: errorMessages.isLength(MOVIE_FIELDS.YEAR, "more 4 and less 4")
	},
};


const duration = {
	optional: true,
	trim: true,
	isInt: {
		errorMessage: errorMessages.isInt(MOVIE_FIELDS.DURATION),
	}
};


const director = {
	optional: true,
	trim: true,
	escape: true,
	isMongoId: {
		errorMessage:  errorMessages.isMongoId(MOVIE_FIELDS.DIRECTOR),
		bail: true,
	},
	custom: {
		options: existIdInCollection(models.directorModel),
	}
};


const comments = {
	optional: true,
	isArray: {
		option: {max: 0},
		errorMessage: errorMessages.isArray(MOVIE_FIELDS.COMMENTS) + "(empty)",
	}
};


const description = {
	optional: true,
	isString: {
		errorMessage: errorMessages.isString(MOVIE_FIELDS.DESCRIPTION),
		bail: true
	},
	escape: true,
	trim: true
}


module.exports = {
	title,
	category,
	categoryItems,
	year,
	duration,
	director,
	comments,
	description,
}