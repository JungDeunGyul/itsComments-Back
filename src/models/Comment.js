const mongoose = require("mongoose");

const { Schema } = mongoose;

const reCommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  postDate: { type: Date, required: true },
});

const commentSchema = new mongoose.Schema({
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  postDate: { type: Date, required: true },
  postUrl: { type: String, required: true },
  postCoordinate: {
    x: { type: String, required: true },
    y: { type: String, required: true },
  },
  screenshot: { type: String, required: true },
  allowPublic: { type: Boolean, required: true },
  publicUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  recipientEmail: [{ type: String }],
  reComments: [reCommentSchema],
  expiresAt: { type: Date, index: true },
});

commentSchema.pre("save", async function (next) {
  if (this.creator.toString() === process.env.NON_MEMBER) {
    this.expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  }

  next();
});

exports.Comment = mongoose.model("Comment", commentSchema);
