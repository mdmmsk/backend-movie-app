module.exports = {
  async up(db, client) {
    await db.collection("users").deleteMany({email: "updated@mail.ru"})
	},
	async down(db, client) {
		
	}
};
