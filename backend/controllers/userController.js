const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Joi = require("joi");
require("dotenv").config();
const method = require("../models/methods");
const cp = require("cookie-parser");
const express = require("express");
const app = express();

const jwtKey = process.env.JWT_KEY;

const registrationSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  usertype: Joi.string().valid("admin", "student", "manager").required(),
});

const register = async (req, res) => {
  const { username, password, email, usertype } = req.body;

  const { error } = registrationSchema.validate({
    username,
    password,
    email,
    usertype,
  });

  if (error) {
    return res.status(400).json({ error: error });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const data = {
    username,
    password: hashedPassword,
    email,
    usertype,
  };

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email or username already exists" });
    }

    await method.postMethod(User, data);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!email && !username) {
      return res.status(400).send({ message: "enter name or email first" });
    }
    const user = await User.findOne({
      isDeleted: false,
      $or: [{ username }, { email }],
    });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const payload = {
          userId: user._id,
          usertype: user.usertype,
          username: user.username,
        };
        const token = jwt.sign(payload, jwtKey);
        res.cookie("token", token, {
          secure: true,
          sameSite: "None",
        });

        res.status(200).send({ token: token, userinfo: user });
        // res.send(token)
      } else {
        res.status(401).send({ error: "Invalid credentials" });
      }
    } else {
      res.status(401).send({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const myProfile = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req._id });
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(0), // Set the expiration date in the past
      secure: true,
      sameSite: "None",
    });

    res.status(204).send({ message: "User Logged out Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = { login, register, logout, myProfile };
