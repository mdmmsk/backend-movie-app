const { ObjectId } = require('mongodb')


module.exports = {
  async up(db, client) {
		await db.collection('movies').update({year: 2002}, {$set:
      {
        director: ObjectId("63ed09d2ac92ca2eda7247e5")
      }
		})
		await db.collection('movies').update({year: { $ne: 2002 }}, {$set:
      {
        director: ObjectId("63fbdc7e4e1ec8cf5e780277")
      }
		})
  },

  async down(db, client) {
		await db.collection("movies").update({}, {$set:
      {
        director: {directorId: "123"}
      }
		})
  }
};
