const mongoose = require('mongoose');


const dbConnect = function(url) {
	mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).
  catch(error => console.log(error));
}


function parseSortParam(string) {
	const sortFields = string.split("%");
	return sortFields.map(item => {
		const fieldAndValue = item.split("_");
		if(fieldAndValue[1] === "1" || fieldAndValue[1] === "-1") {
			return { [fieldAndValue[0]]: +fieldAndValue[1] };
		} else {
			throw new Error('Invalid sort values');
		}
	})
}


const createSchema = function(props, option = {}) {
	return new mongoose.Schema(props, option);
}


const getModel = function(modelName, schema) {
	return mongoose.model(modelName, schema);
}


module.exports = { 
	getModel,
	createSchema,
	dbConnect, 
	parseSortParam 
}