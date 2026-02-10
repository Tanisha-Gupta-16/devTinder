const express = require("express");
const userRouter = express.Router();
const { authUser } = require("../middlewares/auth.js");
const { ConnectionRequest } = require("../models/connectionRequest.js");
const { User } = require("../models/user.js");
const USER_SAFE_DATA = "firstName lastName photoUrl age about skills";
userRouter.get("/user/requests", authUser, async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({
      toUserId: req.user._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    res.json({ message: "Fetched requests succesfully", data: requests });
  } catch (err) {
    res.status(400).send("Error" + err.message);
  }
});

userRouter.get("/user/connections", authUser, async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({
      $or: [
        { toUserId: req.user._id, status: "accepted" },
        { fromUserId: req.user._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    const data = requests.map((reqs) =>
      reqs.fromUserId._id.toString() === req.user._id.toString()
        ? reqs.toUserId
        : reqs.fromUserId,
    );
    res.json({ message: "Fetched requests succesfully", data });
  } catch (err) {
    res.status(400).send("Error" + err.message);
  }
});

userRouter.get("/user/feed", authUser, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const loggedInUser = req.user;
    const requests = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    requests.forEach((reqs) => {
      hideUsersFromFeed.add(reqs.fromUserId.toString());
      hideUsersFromFeed.add(reqs.toUserId.toString());
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.json({ message: "Fetched users succesfully", data: users });
  } catch (err) {
    res.status(400).send("Error" + err.message);
  }
});

module.exports = { userRouter };
