const request = require('supertest');
const mongoose = require('mongoose');
const { postUserData, putUserData, tokens, setFavorites } = require('./fixtures/userFixt');
const { app } = require('../app'); 
const server = app.listen(2991);

let userId;
describe('/users', () => {
	it('POST/signup', async() => {
		const { body } = await request(app).
			post('/signup').
			send(postUserData.correct).
			expect(201);
		expect(body.email).toBe("test@mail.ru");
		userId = body._id;
	});

	it('POST/login', async() => {
		const { body } = await request(app).
			post('/login').
			send(postUserData.correct).
			expect(200);
		expect(body.email).toBe("test@mail.ru");
	});

	it('PUT/email', async() => {
		const { body } = await request(app).
			put(`/users/${userId}/settings/email`).
			set('authorization', "Bearer " + tokens.admin).
			send(putUserData.updateEmail).
			expect(200);
		expect(body.email).toBe("updated@mail.ru");
	})

	it('PUT/password', async() => {
		const { body } = await request(app).
			put(`/users/${userId}/settings/email`).
			send(putUserData.updateEmail).
			expect(200);
		expect(body.email).toBe("updated@mail.ru");
	})
})


describe('user_favorites', () => {
	it('add_movie', async() => {
		const { body } = await request(app).
			post('/set-favorites').
			send(setFavorites.add).
			expect(201);
		expect(body.at(-1)).toBe(setFavorites.add.movieId)
	})

	it('delete_movie', async() => {
		const { body } = await request(app).
			post('/set-favorites').
			send(setFavorites.delete).
			expect(201);
	})

	it('counts', async() => {
		const { body } = await request(app).
			get('/favorites-counts').
			expect(200);
	})
})


afterAll(done => {
  mongoose.connection.close();
	server.close();
  done()
})

// npm run test -- -i "tests/movies.test.js" -t '/movies PUT'