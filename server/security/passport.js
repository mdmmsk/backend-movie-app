const passport = require('passport');
const MockStrategy = require('passport-mock-strategy');
const BearerStrategy = require('passport-http-bearer');
const { APP_MODE } = require('../config');
const { models } = require('../models');


const customUser = {
  "email": "client2@mail.ru",
  "username": "udafd",
  "roles": [
    "client",
    "admin"
  ],
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNsaWVudDJAbWFpbC5ydSIsInBhc3N3b3JkIjoicXdlcnQxMjMiLCJpYXQiOjE2Nzk2ODk5MDN9.E9bOICaB5n7NZ0xJhYPyR80eDdk0egrLANgr7FITuNo",
}


passport.use(new BearerStrategy(async (token, done) => {
		try{
			const user = await models.userModel.find({ token });
			if (!user.length) { return done(null, false) }
			return done(null, user[0], { scope: 'all' })
		}catch(error) {
			return done(error);
		}
	})
)


passport.use(new MockStrategy(
	{ user: customUser },
	(user, done) => {
		return done(null, user, { scope: 'all' })
	}
))


const pasportAuthentication = () => {
	if(APP_MODE === 'testing') {
		return passport.authenticate('mock', { session: false })
	}
	return passport.authenticate('bearer', { session: false })
}


module.exports = {
	pasportAuthentication,
}