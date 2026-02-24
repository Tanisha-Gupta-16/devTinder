const express = require("express");
const profileRouter = express.Router();
const { authUser } = require("../middlewares/auth.js");
const { validateEditProfileData } = require("../utils/validation.js");
const validator = require("validator");
const bcrypt = require("bcrypt");

profileRouter.get("/profile", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.json({ data: user });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", authUser, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Update Fields");
    }
    const loggedInUser = req.user;
    const updateData = req.body;
    Object.keys(updateData).forEach(
      (key) => (loggedInUser[key] = updateData[key]),
    );
    await loggedInUser.save();
    res.json({ data: loggedInUser, message: "Profile Updated Successfully" });
  } catch (err) {
    res.status(400).json({ message: "Error: " + err.message });
  }
});

profileRouter.patch("/password/edit", authUser, async (req, res) => {
  try {
    const { existingPassword, newPassword } = req.body;
    const isExistingPasswordValid = req.user.validatePassword(existingPassword);
    const isNewPasswordValid = validator.isStrongPassword(newPassword);
    if (!isExistingPasswordValid) {
      throw new Error("Invalid current password");
    }
    if (!isNewPasswordValid) {
      throw new Error("Please enter a strong password");
    }
    req.user["password"] = await bcrypt.hash(newPassword, 10);
    await req.user.save();
    res.send("Password Updated Successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = { profileRouter };
