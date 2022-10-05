const express = require("express");
const authRouter = require("./routes/authRoute");

const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.use("/api/v1/auth", authRouter);

module.exports = app;
