const express = require("express");
const chatRouter = express.Router();
const { authUser } = require("../middlewares/auth");
const { Chat } = require("../models/chat");
const { ConnectionRequest } = require("../models/connectionRequest");

chatRouter.get("/chat/:targetUserId", authUser, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;
    let connection = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: userId, toUserId: targetUserId },
        { toUserId: userId, fromUserId: targetUserId },
      ],
      status: "accepted",
    });
    if (!connection) {
      throw new Error("You can only chat with connections");
    }
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
    }
    await chat.save();
    res.json({ data: chat });
  } catch (err) {
    res.status(400).json({ message: "Error" + err.message });
  }
});

module.exports = { chatRouter };
