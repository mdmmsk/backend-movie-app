module.exports = {
  async up(db, client) {
    await db.collection("movies").deleteMany({title: 'movie25'})
	},
	async down(db, client) {
		
	}
};
