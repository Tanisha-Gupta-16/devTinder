const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat.js");
const { ConnectionRequest } = require("../models/connectionRequest.js");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initialiseSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://dev-tinder-9ijuyqcpc-tanisha-gupta-16s-projects.vercel.app",
      ],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", async ({ userId, targetUserId }) => {
      let connection = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: userId, toUserId: targetUserId },
          { toUserId: userId, fromUserId: targetUserId },
        ],
        status: "accepted",
      });
      if (connection) {
        const roomId = getSecretRoomId(userId, targetUserId);
        socket.join(roomId);
      } else {
        socket.emit("joinError", {
          message: "You are not connected with this user",
        });
      }
    });
    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text }) => {
        const roomId = getSecretRoomId(userId, targetUserId);
        try {
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({
            senderId: userId,
            text,
          });
          await chat.save();
        } catch (err) {
          console.log(err.message);
        }

        io.to(roomId).emit("messageRecieved", { firstName, text, userId });
      },
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = { initialiseSocket };
