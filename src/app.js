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

connectionDB()
  .then(() => {
    console.log("Connected to DB successfully");
    app.listen(3000, () => {
      console.log("Server is listening on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
