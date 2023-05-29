const { models } = require('../models');


const findCommentError = `Incorrect commentId or you do not have permissions to change this comment`;
const findMovieError = "Incorrect movieId";


async function createComment(session, commentData, movieId) {
	try {
		session.startTransaction();
		const [ comment ] = await models.commentModel.create([commentData], { session });
		const addInList = { $addToSet: { comments: comment._id } };

		await models.movieModel.findByIdAndUpdate(movieId, addInList).
			session(session).
			orFail(new Error(findMovieError));
			
		await session.commitTransaction();
		return comment;
	}catch(error) {
		await session.abortTransaction();
		throw error;
	}
}


async function updateComment(id, authorId, updateData) {
	const { updatedComment } = updateData;
	const filter = { _id: id, author: authorId };
	const update = { commentText: updatedComment };
	try{
		const query = models.commentModel.findOneAndUpdate(filter, update);
		query.setOptions({ new: true });
		query.orFail(new Error(findCommentError));
		return await query.exec();
	}catch(error) {
		throw error;
	}
}


async function deleteComment(session, params, userData) {
	const { commentId, movieId } = params;
	const { _id: authorId } = userData;
	const filter = { _id: commentId, author: authorId };
	const removeFromList = { $pull: { comments: commentId } }
	try {
		session.startTransaction();

		const comment = await models.commentModel.findOneAndDelete(filter).
			session(session).
			orFail(new Error(findCommentError));

		await models.movieModel.findByIdAndUpdate(movieId, removeFromList).
			session(session).
			orFail(new Error(findMovieError));

		await session.commitTransaction();
		return comment;
	}catch(error) {
		await session.abortTransaction();
		throw error
	}
}


const COMMENT_FIELD = {
  COMMENT: "commentText",
  AUTHOR: "author",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
};


module.exports = {
	createComment,
	updateComment,
	deleteComment,
	COMMENT_FIELD
}