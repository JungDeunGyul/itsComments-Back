const request = require("supertest");
const app = require("../../app");
const { User } = require("../models/User");
const { setupDB } = require("./setup");
const mongoose = require("mongoose");

setupDB();

describe("PATCH /profile", () => {
  let user;

  beforeEach(async () => {
    await User.deleteMany({});
    user = await User.create({
      email: "user@example.com",
      nickname: "User",
      icon: "http://example.com/default.jpg",
    });
  });

  it("should return 404 if user does not exist", async () => {
    const fakeUserId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .patch("/profile")
      .send({ userId: fakeUserId });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  }, 10000);

  it("should return 400 if nickname is invalid 1", async () => {
    const response = await request(app)
      .patch("/profile")
      .send({ userId: user._id.toString(), nickname: "a" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Nickname must be between 2 and 20 characters.",
    );
  }, 10000);

  it("should return 400 if nickname is invalid 2", async () => {
    const response = await request(app).patch("/profile").send({
      userId: user._id.toString(),
      nickname: "abcdefghijklmnopqrstuvwxyz",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Nickname must be between 2 and 20 characters.",
    );
  }, 10000);

  it("should update user profile nickname and return 200", async () => {
    const response = await request(app)
      .patch("/profile")
      .send({ userId: user._id.toString(), nickname: "abcd" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Profile updated successfully");
  }, 10000);
});
