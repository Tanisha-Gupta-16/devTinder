const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
const chatSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  ],
  messages: [messageSchema],
});
const Chat = new mongoose.model("Chat", chatSchema);
module.exports = { Chat };
