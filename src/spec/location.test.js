const request = require("supertest");
const app = require("../../app");
const { Comment } = require("../models/Comment");
const { User } = require("../models/User");
const mongoose = require("mongoose");
const { setupDB } = require("./setup");

setupDB();
describe("Location router tests", () => {
  let user, publicComment, privateComment, pageUrl;

  beforeAll(async () => {
    user = await User.create({
      email: "user@example.com",
      nickname: "TestUser",
      friends: [],
      createdComments: [],
      receivedComments: [],
      repliedComments: [],
      feedComments: [],
    });

    pageUrl = "http://example.com/test";

    publicComment = await Comment.create({
      creator: user._id,
      text: "This is a public comment",
      postDate: new Date(),
      postUrl: pageUrl,
      postCoordinate: { x: "100", y: "200" },
      allowPublic: true,
      publicUsers: [],
      reComments: [],
    });

    privateComment = await Comment.create({
      creator: user._id,
      text: "This is a private comment",
      postDate: new Date(),
      postUrl: pageUrl,
      postCoordinate: { x: "100", y: "200" },
      allowPublic: false,
      publicUsers: [user._id],
      reComments: [],
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Comment.deleteMany({});
  });

  it("should retrieve public and private comments for a specific page and user", async () => {
    const response = await request(app).get("/location").query({
      userId: user._id.toString(),
      pageUrl,
    });

    expect(response.status).toBe(200);
    expect(response.body.pageComments.length).toBe(2);
    expect(response.body.pageComments.map((c) => c.text)).toEqual(
      expect.arrayContaining([
        "This is a public comment",
        "This is a private comment",
      ]),
    );
  });

  it("should handle database errors gracefully", async () => {
    const originalFindById = User.findById;
    User.findById = jest.fn().mockRejectedValue(new Error("Database failure"));

    const response = await request(app).get("/location").query({
      userId: user._id.toString(),
      pageUrl,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Failed to get comments.");

    User.findById = originalFindById;
  });
});
