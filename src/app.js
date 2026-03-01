const express = require("express");
const { connectionDB } = require("./config/database.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { authRouter } = require("./router/auth.js");
const { profileRouter } = require("./router/profile.js");
const { userRouter } = require("./router/user.js");
const { requestRouter } = require("./router/requests.js");
const { paymentRouter } = require("./router/payment.js");
const { chatRouter } = require("./router/chat.js");
const http = require("http");
const { initialiseSocket } = require("./utils/socket.js");
const isProduction = process.env.NODE_ENV === "production";
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: isProduction
      ? "https://dev-tinder-web-gold.vercel.app"
      : "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
app.use("/", requestRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initialiseSocket(server);

connectionDB()
  .then(() => {
    console.log("Connected to DB successfully");
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log("Server is listening on port " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
