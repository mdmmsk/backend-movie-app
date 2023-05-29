const { models } = require("../models");


async function deleteCategory(session, categoryId) {
	session.startTransaction();
	try {
		const query = models.categoryModel.findByIdAndRemove(categoryId);
		query.session(session);
		query.orFail(new Error("Document not found"));
		const deletedCategory = await query.exec();

		const filter = { _id: { $in: deletedCategory.moviesList } };
		const update = { $pull: { category: deletedCategory._id} };
		await models.movieModel.updateMany(filter, update, { session });

		await session.commitTransaction();
	}catch (error) {
		await session.abortTransaction();
		throw error;
	}
}


const CATEGORY_FIELDS = {
	TITLE: "title",
	MOVIES_LIST: "movieslist",
}


const REQUIRED_FIELDS = [
	"title",
]


const service = (query, filters, sort) => {
	const { title } = filters;
	title && query.where("title", title);
	if(sort) {
		const sortOrders = parseSortParam(sort);
		query.sort(Object.assign({}, ...sortOrders));
	}
}


module.exports = {
	deleteCategory,
	CATEGORY_FIELDS,
	REQUIRED_FIELDS,
	service
}