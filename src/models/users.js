const mongoose = require("mongoose");
const { validateEmail } = require("../utils");

const { Schema } = mongoose;

const users = new Schema(
  {
    firstName: {
      type: String,
      required: "Last Name is required",
    },

    lastName: {
      type: String,
      required: "First Name is required",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
      unique: true,
    },
    password: {
      type: String,
      required: "Password is required",
      validate: [
        function (password) {
          return password.length > 5;
        },
        "Password length has be to greater than 5.",
      ],
    },
  },
  {
    timestamps: true,
  }
);

users.index({ email: 1 });

const Users = mongoose.model("users", users);
module.exports = Users;
