const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  nickname: { type: String, required: true },
  icon: { type: String },
  friend: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdComments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  repliedComments: [
    {
      comment: { type: Schema.Types.ObjectId, ref: "Comment" },
      text: { type: String },
    },
  ],
  accessibleComments: [
    {
      comment: { type: Schema.Types.ObjectId, ref: "Comment" },
      isChecked: { type: Boolean },
    },
  ],
});

exports.User = mongoose.model("User", userSchema);
