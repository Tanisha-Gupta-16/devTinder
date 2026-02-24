const jwt = require("jsonwebtoken");
const { User } = require("../models/user.js");

const authUser = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    const { token } = cookies;

    if (!token) {
      return res.status(401).json({ message: "Please Login!!" });
    }
    const decodedObj = await jwt.verify(token, "dev@Tinder");

    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("Please signup first");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = { authUser };
