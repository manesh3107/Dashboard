const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cp = require("cookie-parser");
const connectDB = require("./db/connectDB");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
connectDB();

app.use(cp());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

const PORT = process.env.PORT;
// console.log(process.argv)

const authRouter = require("./routes/userRoute");
const adminRouter = require("./routes/adminRoute");
const managerRouter = require("./routes/managerRoute");
const studentRouter = require("./routes/studentRoute");
const forgotPasswordRouter = require("./routes/forgotPasswordRoute");

app.use("/", authRouter);
app.use("/admin", adminRouter);
app.use("/manager", managerRouter);
app.use("/student", studentRouter);
app.use("/api", forgotPasswordRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
