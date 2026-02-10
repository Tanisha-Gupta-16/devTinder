const express = require("express");
const requestRouter = express.Router();
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");
const { authUser } = require("../middlewares/auth");

requestRouter.post(
  "/request/send/:status/:toUserId",
  authUser,
  async (req, res) => {
    try {
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const fromUser = req.user;
      const fromUserId = req.user._id;
      const ALLOWED_STATUS = ["ignored", "interested"];

      if (!ALLOWED_STATUS.includes(status)) {
        throw new Error("Invalid status type");
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("User does not found");
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error("Connection request already exists");
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: `${fromUser.firstName} ${status} ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).send("Error:" + err.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  authUser,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;
      const ALLOWED_STATUS = ["accepted", "rejected"];

      if (!ALLOWED_STATUS.includes(status)) {
        throw new Error("Invalid status type");
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser,
        status: "interested",
      });
      if (!connectionRequest) {
        throw new Error("Request does not exists");
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: `${status} request from ${connectionRequest.fromUserId}`,
        data,
      });
    } catch (err) {
      res.status(400).send("Error:" + err.message);
    }
  },
);

module.exports = { requestRouter };
