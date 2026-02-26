const express = require("express");
const chatRouter = express.Router();
const { authUser } = require("../middlewares/auth");
const { Chat } = require("../models/chat");

chatRouter.get("/chat/:targetUserId", authUser, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;
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
