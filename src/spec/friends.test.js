const request = require("supertest");
const app = require("../../app");
const { User } = require("../models/User");
const { setupDB } = require("./setup");

setupDB();

describe("Friends router", () => {
  let user;
  let friend;

  beforeEach(async () => {
    await User.deleteMany({});
    user = await User.create({
      email: "user@test.com",
      nickname: "UserTest",
      friends: [],
    });
    friend = await User.create({
      email: "friend@test.com",
      nickname: "FriendTest",
    });
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("GET /friends", () => {
    it("should return the list of friends", async () => {
      user.friends.push(friend._id);
      await user.save();
      const response = await request(app).get(
        `/friends?id=${user._id.toString()}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.friends.length).toBe(1);
      expect(response.body.friends[0]._id).toBe(friend._id.toString());
    });
  });

  describe("PATCH /friends/addition", () => {
    it("should add a friend and return 200", async () => {
      const response = await request(app).patch("/friends/addition").send({
        userId: user._id.toString(),
        friendMail: friend.email,
      });

      expect(response.status).toBe(200);
      expect(response.body.friends).toContainEqual(
        expect.objectContaining({ email: friend.email }),
      );
    });

    it("should return 400 if trying to add self as a friend", async () => {
      const response = await request(app).patch("/friends/addition").send({
        userId: user._id.toString(),
        friendMail: user.email,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("You can't add yourself as a friend.");
    });
  });

  describe("PATCH /friends/delete", () => {
    beforeEach(async () => {
      user.friends.push(friend._id);
      await user.save();
    });

    it("should delete a friend and return 200", async () => {
      const response = await request(app).patch("/friends/delete").send({
        userId: user._id.toString(),
        friendId: friend._id.toString(),
      });

      expect(response.status).toBe(200);
      expect(response.body.friends.length).toBe(0);
    });
  });
});
