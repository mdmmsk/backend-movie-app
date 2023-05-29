const express = require('express');
const app = express();
const movieRoute = require('./routes/movies');
const categoryRoute = require('./routes/categories');
const commentRoute = require('./routes/comments');
const directorRoute = require('./routes/director');
const userRouter = require('./routes/user');
const aggregationRouter = require('./agregation/agregationService')
const env = require('./config');
const { dbConnect } = require("./services/dbService");
const cors = require("cors");
const passport = require('passport');

dbConnect(env.DB_STRING);


app.use(passport.initialize())


app.use(cors({origin: env.ALLOWED_ORIGINS}));


app.use(express.json());


app.use('/', movieRoute, categoryRoute, commentRoute, userRouter, directorRoute, aggregationRouter);


if(env.APP_MODE !== 'testing') {
	app.listen(env.PORT);
}

module.exports = {
	app,
}