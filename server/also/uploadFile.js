const { validate } = require('./services/validationService');
const { EJSON } = require('bson')
const fs = require('node:fs/promises');


async function readFile(fileName) {
	try{
		const file = await fs.readFile(fileName, { encoding: 'utf8' });
		return EJSON.deserialize(JSON.parse(file));
	}catch(error) {
		throw error
	}
}

async function fileDataValidation(data, model) {
	let validData = [];
	let invalidData = [];
	for(let item of data) {
		delete item._id;
		try{
			await validate(item, model);
			validData.push(item);
		}catch(error) {
			invalidData.push({data: item, error})}
	}
	return {validData, invalidData};
}


module.exports = {
	readFile,
	fileDataValidation,
}

// const { readFile, fileDataValidation } = require('./uploadFile');
// const { createDocument } = require('./services/dbService');
// const fs = require('node:fs/promises');

// (async function a() {
// 	try{
// 		const data = await readFile('movies.json');
// 		const {validData, invalidData} = await fileDataValidation(data, movieModel);
// 		if(validData.length) {
// 			await createDocument(movieModel, validData);
// 		}
// 		if(invalidData.length) {
// 			fs.writeFile('invalidData.json', JSON.stringify(invalidData, null, 2));
// 		}
// 	}catch(error) {
// 		console.log(error)
// 	}
// })()