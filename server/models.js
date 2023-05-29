const { ObjectId } = require("mongodb");
const { getModel, createSchema } = require("./services/dbService");


const moviesParams = {
	title: { type: String, required: true }, 
	category: [
		{
			type: ObjectId, 
			ref: 'Category', 
			required: true,
		}
	], 
	year: { type: Number, required: true }, 
	duration: { type: Number, required: true },  
	director: { type: ObjectId, ref: "Director", required: true },
	comments: [{ type: ObjectId, ref: 'Comment', default: [] }],
	description: { type: String, default: "" }
}


const categoriesParams = {
	title: {type: String, required: true},
	moviesList: [{type: ObjectId, ref: 'Movie'}]
}


const commentParams = {
	createdAt: {type: Number, unmodifiable: true, immutable: true},
	updatedAt: {type: Number, unmodifiable: true},
	commentText: {type: String, required: true},
	author: {type: ObjectId, required: true, ref: "User"}
}


const directorParams = {
	name: { type: String, required: true },
	surname: { type: String, required: true },
	moviesList: [{type: ObjectId, ref: 'Movie'}]
}



const userParams = {
	email: {type: String, required: true},
	username: {type: String, required: true, default: "user"},
	roles: {type: [{type: String}], default: "client"}, 
	token: {type: String, required: true},
	favorites: [{type: ObjectId, default: [], ref: 'Movie'}],
}


const schemas = {
	movieSchema: createSchema(moviesParams),
	categorySchema: createSchema(categoriesParams),
	commentSchema: createSchema(commentParams, { timestamps: true}),
	directorSchema: createSchema(directorParams),
	userSchema: createSchema(userParams),
}


const models = {
	movieModel: getModel("Movie", schemas.movieSchema),
	categoryModel: getModel("Category", schemas.categorySchema),
	commentModel: getModel("Comment", schemas.commentSchema),
	directorModel: getModel("Director", schemas.directorSchema),
	userModel: getModel("User", schemas.userSchema),
}


module.exports = { 
	schemas,
	models,
};