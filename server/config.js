const dotenv = require('dotenv');
dotenv.config();
module.exports = {
	PORT: process.env.PORT,
	DB_STRING: process.env.MONGO_CONNECTION_STRING,
	JWT_SECRET: process.env.JWT_SECRET,
	APP_MODE: process.env.APP_MODE,
	ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS.split(",")
}