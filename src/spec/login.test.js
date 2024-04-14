const app = require("../../app");
const { setupDB } = require("./setup");
const request = require("supertest");
const { User } = require("../models/User");

setupDB();

describe("Auth Controller", () => {
  describe("POST /login", () => {
    beforeAll(async () => {
      await User.create({
        email: "existinguser@test.com",
        nickname: "Existing User",
        icon: "http://example.com/photo.jpg",
      });
    });

    it("should create a new user if not existing", async () => {
      const userData = {
        user: {
          email: "newuser@test.com",
          displayName: "Test User",
          photoURL: "http://example.com/photo.jpg",
        },
      };

      const response = await request(app).post("/login").send(userData);

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(userData.user.email);
      expect(response.body.user.nickname).toBe(userData.user.displayName);
    });
  });

  it("should log in an existing user", async () => {
    const userData = {
      user: {
        email: "existinguser@test.com",
        displayName: "Existing User",
        photoURL: "http://example.com/photo.jpg",
      },
    };

    const response = await request(app).post("/login").send(userData);

    expect(response.status).toBe(200);
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe(userData.user.email);
    expect(response.body.user.nickname).toBe("Existing User");
  });

  afterAll(async () => {
    await User.deleteMany({});
  });
});
