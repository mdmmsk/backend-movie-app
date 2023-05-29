module.exports = {
  async up(db, client) {
    await db.collection("movies").deleteMany({title: 'testMoviePost'})
	},
	async down(db, client) {
		
	}
};
