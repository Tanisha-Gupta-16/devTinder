const express = require("express");
const authRouter = express.Router();
const { validateSignupData } = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const { User } = require("../models/user.js");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });

    const savedUser = await user.save();
    const token = await user.getJWT();
    res.cookie("token", token);
    res.json({ message: "User created successfully", data: savedUser });
  } catch (err) {
    res.status(400).json({ message: "Error: " + err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isValidPassword = await user.validatePassword(password);
    if (isValidPassword) {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.json({ message: "Login Successful!!", data: user });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).json({ message: "Error: " + err.message });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.json({ message: "Successfully logged out!!" });
});

module.exports = { authRouter };
