module.exports = {
  async up(db, client) {
		await db.collection("directors").updateMany({}, { $set: { moviesList: [] } })
  },

  async down(db, client) {
		await db.collection("directors").updateMany({}, { $unset: { moviesList: 0 } })
  }
};