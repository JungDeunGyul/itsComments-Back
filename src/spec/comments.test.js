const request = require("supertest");
const app = require("../../app");
const { Comment } = require("../models/Comment");
const { User } = require("../models/User");
const { setupDB } = require("./setup");

setupDB();

describe("Comment routes", () => {
  let user;
  let commentId;

  beforeAll(async () => {
    await User.deleteMany({});
    await Comment.deleteMany({});

    user = await User.create({
      email: "testuser@example.com",
      nickname: "TestUser",
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Comment.deleteMany({});
  });

  describe("POST /comments/new - Create new comment", () => {
    it("should create a new comment and return 200 status", async () => {
      const response = await request(app)
        .post("/comments/new")
        .send({
          userData: user.email,
          text: "This is a test comment",
          postDate: new Date(),
          postUrl: "http://example.com/testpage",
          postCoordinate: JSON.stringify({ x: "123", y: "456" }),
          allowPublic: true,
          publicUsers: JSON.stringify([]),
        })
        .set("Content-Type", "application/json");

      expect(response.status).toBe(200);
      expect(response.body.newComment).toBeDefined();
      expect(response.body.newComment.text).toBe("This is a test comment");
      commentId = response.body.newComment._id;
    });
  });

  it("should return 404 if user is not found", async () => {
    const response = await request(app)
      .post("/comments/new")
      .send({
        userData: "nonuser@example.com",
        text: "This is a test comment",
        postDate: new Date(),
        postUrl: "http://example.com/testpage",
        postCoordinate: JSON.stringify({ x: "123", y: "456" }),
        allowPublic: true,
        publicUsers: JSON.stringify([]),
      })
      .set("Content-Type", "application/json");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  describe("DELETE /comments/:commentId - Delete a comment", () => {
    it("should return 404 if user does not have permission to delete the comment", async () => {
      const response = await request(app)
        .delete(`/comments/${commentId}`)
        .send({ userId: "no permission user" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(
        "You do not have permission to delete.",
      );
    });

    it("should delete the comment and return 200 status", async () => {
      const response = await request(app)
        .delete(`/comments/${commentId}`)
        .send({ userId: user._id });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("comment is successfully deleted.");

      const fetchDeleted = await request(app).get(`/comments/${commentId}`);
      expect(fetchDeleted.status).toBe(404);
    });
  });
});
