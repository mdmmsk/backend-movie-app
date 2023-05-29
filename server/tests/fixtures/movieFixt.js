class MovieData {
	constructor({
		title = "movie99", category = ["63fbdd0a4e1ec8cf5e780279"],
		year = 2000, duration = 120, director = "63fbdc7e4e1ec8cf5e780277",
		description = "test movie description",
	}) {
			this["title"] = title;
			this["category"] = category; 
			this["year"] = year; 
			this["duration"] = duration;  
			this["director"] = director;
			this["description"] = description;
	}
}


const postData = {
	correct: new MovieData({}),
	noRequiredFields: new MovieData({title: null, category: null}),
	inCorrect: new MovieData({category: 123, director: [], year: "thirty"})
}


const putData = {
	correct: {
		director: "63ed09d2ac92ca2eda7247e5",
		duration: 150,
		category: ["6407a01decaedfa964776696", "63fbdd0a4e1ec8cf5e780279"]
	},
	inCorrect: {
		title: {'title': 123},
		category: {'category': "6407a01decaedfa964776696"},
		year: {'year': [1234]},
		duration: {'duration': "dfj123"},
		director: {'director': ["1234"]},
		description: {'description': 1234}
	},
}


module.exports = {
	postData,
	putData,
	MovieData,
}