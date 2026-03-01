const mongoose = require("mongoose");

const connectionDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
};

module.exports = { connectionDB };
