const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    followers: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    resetToken: {
      type: String,
    },
    expireToken: Date,
    following: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    pic: {
      type: String,
      default:
        "https://res.cloudinary.com/dl0dsqomf/image/upload/v1593009743/user-logos-user-logo-png-1920_1280_xn3ckj.png",
    },
  },
  { timestamps: true }
);

mongoose.model("User", userSchema);
