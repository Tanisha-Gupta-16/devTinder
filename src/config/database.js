const mongoose = require("mongoose");

const connectionDB = async () => {
  await mongoose.connect(
    "mongodb+srv://TANISHA_16:v6kiYZ3LD9X-uzJ@cluster0.7gfepyz.mongodb.net/?appName=Cluster0/devTinder",
  );
};

module.exports = { connectionDB };
