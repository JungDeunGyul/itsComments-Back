const { MongoClient } = require("mongodb");

module.exports = {
  setupDB() {
    let connection;
    let db;

    beforeAll(async () => {
      connection = await MongoClient.connect(process.env.MONGODB_TEST_URI, {
        dbName: "testcode",
      });

      db = await connection.db();
    }, 10000);

    afterAll(async () => {
      await db.collection("users").deleteMany({});
      await db.collection("comments").deleteMany({});
      await connection.close();
    });
  },
};
