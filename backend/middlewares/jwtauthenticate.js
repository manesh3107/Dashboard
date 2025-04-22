const jwt = require("jsonwebtoken");
const cp = require("cookie-parser");
const express = require("express");
const app = express();
app.use(cp());

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res
        .status(401)
        .json({ message: "Access denied. Token not provided." });

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid token." });

      req.user = user;
      req.usertype = user.usertype;
      req._id=user.userId
      next();
    });
  } catch (error) {
    res.status(400).json({ message: "Internal server error" });
  }
};

module.exports = {  authenticateToken };
