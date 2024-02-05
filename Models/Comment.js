const mongoose = require("mongoose");

const { Schema } = mongoose;

const reCommentSchema = new mongoose.Schema({
  description: { type: String, required: true },
  creator: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  postDate: { type: Date, required: true },
});

const commentSchema = new mongoose.Schema({
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  postDate: { type: Date, required: true },
  postUrl: { type: String, required: true },
  postCoordinate: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  imgpath: { type: String, required: true },
  allowPublic: { type: Boolean, required: true },
  publicUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  maillingAddress: [{ type: String }],
  reComments: [reCommentSchema],
});

exports.Comment = mongoose.model("Comment", commentSchema);
