const request = require('supertest');
const mongoose = require('mongoose');
const { postData, putData } = require('./fixtures/movieFixt');
const { app } = require('../app'); 
const server = app.listen(2990);


// jest
// .spyOn(console, 'log') // метод sendMagicLink у mailService будет заменен на
// .mockImplementation(() => 'test');


let testId;
describe('/movies', () => {
  it('POST', async () => {
    const { body } = await request(app).
			post('/movies').
			send(postData.correct).
			expect(201);
		testId = body._id;
		expect(body.title).toEqual(postData.correct.title);
  });

	it('PUT', async () => {
    const { body } = await request(app).
			put(`/movies/${testId}`).
			send(putData.correct).
			expect(201);
		expect(body.director).toEqual(putData.correct.director);
  });

	it('DELETE', async () => {
    const { body } = await request(app).
			delete(`/movies/${testId}`).
			expect(200);
		expect(body).toBeTruthy();
  });

	it('/GET/query', async () => {
    const { body } = await request(app).
			get('/movies?sort=title_1').
			expect(200);
		expect(body).toContainEqual(expect.objectContaining({year: 2018}))
  });
});

describe('/movies/bad-requests', () => {
	it('POST', async () => {
    await request(app).
			post('/movies').
			send(postData.inCorrect).
			expect(400);
  });

	it('POST', async () => {
    await request(app).
			post('/movies').
			send(postData.noRequiredFields).
			expect(400);
  });

	it('PUT', async () => {
    const { body } = await request(app).
			put(`/movies/63fca5beb34e0719485fa1b9`).
			send(putData.inCorrect.title).
			expect(400);
		expect(body.errors[0].field).toBe("title");
  });

	it('DELETE', async () => {
    const { body } = await request(app).
			delete(`/movies/63fca5beb34e0719485fa1b7`).
			expect(400);
		expect(body.error.message).toBe("Not found");
  });

	it('/GET/query', async () => {
    await request(app).
			get('/movies?year2018').
			expect(400);
  });
})


afterAll(done => {
  mongoose.connection.close();
	server.close();
  done()
})

