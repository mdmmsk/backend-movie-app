module.exports = {
  async up(db, client) {
    await db.collection("users").update({}, [{
			$addFields: {
				favotites: []
			}
		}])
  },

  async down(db, client) {
		await db.collection("users").update({}, {
			$unset: {
				favotites:	""
			}
		})
	}
};
