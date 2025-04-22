const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const nm = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

const jwtKey = process.env.JWT_KEY;

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a reset token based on the user's email
    const resetToken = jwt.sign({ email }, process.env.FORGOTPASSKEY, { expiresIn: '1h' });

    user.resetPasswordToken = resetToken;

    await user.save();
    
    // Encode the reset token in the reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${encodeURIComponent(resetToken)}`;

    // Use nodemailer or your preferred email sending service to send the email
    var trans = nm.createTransport({
      service: "gmail", 
      host: "smtp.gmail.com",
      port: 456,
      secure: true,
      auth: {
        user: "manesh312003@gmail.com",
        pass: "xfubyamjqlfhyydt",
      },
    });
    var mailoption = {
      from: "manesh312003.gmail.com",
      to: email,
      subject: "test mail",
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    trans.sendMail(mailoption, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info.response);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Decode the reset token received from the URL
    const decodedToken = jwt.verify(token, process.env.FORGOTPASSKEY);

    const user = await User.findOne({
      email: decodedToken.email,
      // resetPasswordToken: token,
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Hash the new password and update the user document
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { forgotPassword, resetPassword };
