const { parseSortParam } = require("../services/dbService");
const { models } = require("../models");


function updateDirector(directorId, updateData) {
	const update = directorUpdataHandler(updateData);
	try {
		const director = models.directorModel.
			findByIdAndUpdate(directorId, update, { new: true }).
			orFail(new Error("Incorrect directorId"));
		return director;
	}catch(error) {
		throw error;
	}
}


function directorUpdataHandler(updateData) {
	const { name, surname } = updateData
	return {
		...(name && { name }),
		...(surname && { surname })
	}
}


const DIRECTOR_FIELDS = {
	NAME: "name",
	SURNAME: "surname",
	MOVIES_LIST: "moviesList",
}


const service = (query, filters, sort) => {
	const { name, surname } = filters;
	name && query.where("name", name);
	surname && query.where("surname", surname);
	if(sort) {
		const sortOrders = parseSortParam(sort);
		query.sort(Object.assign({}, ...sortOrders));
	}
}



module.exports = {
	DIRECTOR_FIELDS,
	service,
	updateDirector,
}