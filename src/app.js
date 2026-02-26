const express = require("express");
const { connectionDB } = require("./config/database.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const { authRouter } = require("./router/auth.js");
const { profileRouter } = require("./router/profile.js");
const { userRouter } = require("./router/user.js");
const { requestRouter } = require("./router/requests.js");
const { paymentRouter } = require("./router/payment.js");
const { chatRouter } = require("./router/chat.js");
const http = require("http");
const { initialiseSocket } = require("./utils/socket.js");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
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
    server.listen(3000, () => {
      console.log("Server is listening on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
