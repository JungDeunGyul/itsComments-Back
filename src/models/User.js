const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  nickname: { type: String, required: true },
  icon: { type: String },
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdComments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  receivedComments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  repliedComments: [
    {
      comment: { type: Schema.Types.ObjectId, ref: "Comment" },
      text: { type: String },
    },
  ],
  feedComments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

exports.User = mongoose.model("User", userSchema);
