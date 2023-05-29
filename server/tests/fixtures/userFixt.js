class UserData {
	constructor({
		email = "qwerty@mail.ru",
		password = "testPassword",
		username = "testUser",
		roles = ["client", "admin"]
	}) {
		this.email = email;
		this.password = password;
		this.username = username;
		this.roles = roles;
	}
}


const postUserData = {
	correct: new UserData({}),
	incorrect: new UserData({email: 123}),
	noRequiredFields: new UserData({password: null})
}


const putUserData = {
	updatePassword: {
		"oldPassport": "testPassword",
		"newPassport": "newPassword"
	},
	updateEmail: {
		"newEmail": "updated@mail.ru"
	},
	updatePublicData: {
		"newUsername": "newUserName"
	},
	updateRoles: {
		"newRoles": ["client", "admin"]
	}
}


const tokens = {
	admin: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQG1haWwucnUiLCJwYXNzd29yZCI6InF3ZXJ0eTEyMyIsImlhdCI6MTY3ODM5MjI5M30.3d6HHyklpkDAjY1vq6I1o7F7WteDpxYqkijewNPkr_A',
	client: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQG1haWwucnUiLCJwYXNzd29yZCI6InF3ZXJ0eTEyMyIsImlhdCI6MTY3ODM5MjY3M30.suKbhQRNRZZpRChJxAfndzpWutb-BlZsqgB5-BEne40'
}


const setFavorites = {
	add: {
		operation: 'add',
		movieId: '641dbed84e591df99ca00b92'
	},
	delete: {
		operation: 'delete',
		movieId: '63fca5beb34e0719485fa1b9'
	}
}


module.exports = {
	UserData,
	postUserData,
	putUserData,
	tokens,
	setFavorites
}