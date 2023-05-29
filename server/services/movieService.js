const { models } = require('../models');
const { parseSortParam } = require("../services/dbService");


async function createMovie(session, movieData) {
	session.startTransaction();
	try {
		const [ createdMovie ] = await models.movieModel.
			create([movieData], { session });
		const addInList = { $addToSet: { moviesList: createdMovie._id } };

		await models.categoryModel.
			updateMany({ _id: { $in: createdMovie.category } }, addInList).
			session(session);

		await models.directorModel.
			findByIdAndUpdate(createdMovie.director, addInList, { session });

		await session.commitTransaction();
		return createdMovie;
	}catch(error) {
		await session.abortTransaction();
		throw error;
	}
}


async function updateMovie(session, updateData, movieId) {
	session.startTransaction();
	const update = movieUpdateDataHandler(updateData)
	const removeFromList = { $pull: { moviesList: movieId } };
	const addInCurrentList = { $addToSet: { moviesList: movieId } };
	try {
		const movie = await models.movieModel.
			findByIdAndUpdate(movieId, update, { session }).
			orFail(new Error("no documents match the given movieId"));

		if(update.category) {
			await models.categoryModel.
				updateMany({ _id: { $in: movie.category } }, removeFromList).
				session(session);
			await models.categoryModel.
				updateMany({ _id: { $in: update.category } }, addInCurrentList).
				session(session);
		}

		if(update.director) {
			await models.directorModel.
				findByIdAndUpdate(movie.director, removeFromList, { session })
			await models.directorModel.
				findByIdAndUpdate(update.director, addInCurrentList, { session })
		}
		
		await session.commitTransaction();
		return movie;
	}catch(error) {
		await session.abortTransaction();
		throw error;
	}
}


async function deleteMovie(session, movieId) {
	session.startTransaction();
	const removeFromList = { $pull: { moviesList: movieId}};
	try {
		const deletedMovie = await models.movieModel.
			findByIdAndRemove(movieId, { session }).
			orFail(new Error('Incorrect movieId'));

		await models.categoryModel.
			updateMany({ _id: { $in: deletedMovie.category } }, removeFromList).
			session(session);

		await models.directorModel.
			findByIdAndUpdate(deletedMovie.director, removeFromList, { session });

		await session.commitTransaction();
	}catch(error) {
		await session.abortTransaction();
		throw error;
	}
}


const MOVIE_FIELDS = {
	TITLE: "title",
	CATEGORY: "category",
	YEAR: "year",
	DURATION: "duration",
	DESCRIPTION: "description",
	DIRECTOR: "director",
	COMMENTS: "comments"
}


const REQUIRED_FIELDS = [
	"title",
	"category",
	"year",
	"duration",
	"director",
]


service = (query, filters, sort) => {
	const { title, year, duration } = filters;
	title && query.where('title', title);
	year && query.where('year', year);
	duration && query.where('duration', duration);
	if(sort) {
		const sortOrders = parseSortParam(sort);
		query.sort(Object.assign({}, ...sortOrders));
	}
}


function movieUpdateDataHandler(updateData) {
	const { title, category, year, duration, director } = updateData;
  return {
    ...(title && { title }),
    ...(category && { category }),
    ...(year && { year }),
    ...(duration && { duration }),
    ...(director && { director }),
  };
}


module.exports = {
	createMovie,
	updateMovie,
	deleteMovie,
	service,
	MOVIE_FIELDS,
	REQUIRED_FIELDS
}