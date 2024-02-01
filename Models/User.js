const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nickname: { type: String, required: true },
  iconpath: { type: String },
  friend: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdComments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  participatedComments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

exports.User = mongoose.model("User", userSchema);
