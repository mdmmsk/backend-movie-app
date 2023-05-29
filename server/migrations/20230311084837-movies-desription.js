module.exports = {
  async up(db, client) {
		await db.collection("movies").update({}, [{$addFields: {description: {$getField: "title"} } }])
  },

  async down(db, client) {
		await db.collection("movies").update({}, [{ $unset: "description" }])
  }
};
