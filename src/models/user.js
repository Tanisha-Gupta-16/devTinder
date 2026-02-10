const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
      validate(value) {
        if (!validator.isAlpha(value)) {
          throw new Error("Firstname should contain alphabets only");
        }
      },
    },
    lastName: {
      type: String,
      maxLength: 20,
      validate(value) {
        if (!validator.isAlpha(value)) {
          throw new Error("Lastname should contain alphabets only");
        }
      },
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please write a valid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Pasword must contain a special character, an uppercase letter, an lowecase letter and a digit.",
          );
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["Male", "Female", "Others"].includes(value)) {
          throw new Error("Gender is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Please Enter a valid URL");
        }
      },
    },
    about: {
      type: String,
      default: "Defalut about of an User",
      minLength: 10,
      maxLength: 100,
    },
    skills: {
      type: [String],
      validate(value) {
        if (!value.length > 15) {
          throw new Error("Skills must not be greater than 15");
        }
      },
    },
  },
  { timestamps: true },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "dev@Tinder", {
    expiresIn: "1d",
  });
  return token;
};
userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const isValidPassword = await bcrypt.compare(password, user.password);
  return isValidPassword;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
