const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ingnored", "accepted", "interested", "rejected"],
        message: `{VALUE} is not a valid status`,
      },
    },
  },
  {
    timeStamp: true,
  },
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function () {
  const request = this;
  if (request.fromUserId.equals(request.toUserId)) {
    throw new Error("Cannot send request to yourself");
  }
});

const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = { ConnectionRequest };
