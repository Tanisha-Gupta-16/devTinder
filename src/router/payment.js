const express = require("express");
const paymentRouter = express.Router();
const { authUser } = require("../middlewares/auth.js");

paymentRouter.post("/payment/create", authUser, async (req, res) => {});

module.exports = { paymentRouter };
