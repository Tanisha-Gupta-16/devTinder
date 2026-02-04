const express = require("express");
const app = express();

app.use("/", (req, res) => {
  res.send("Helllllooooo User");
});
app.listen(3000, () => {
  console.log("Server is listening on port 30000");
});
