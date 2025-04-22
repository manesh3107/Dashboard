const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Joi=require('joi')
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/user");

const registrationSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    usertype: Joi.string().valid("admin", "student", "manager").required(),
  });

// Define a user schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email:String, 
  usertype:String
});

const User = mongoose.model("User", userSchema);


app.post("/register", async (req, res) => {
  const { username, password,email,usertype } = req.body;

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

  const user = new User({
    username,
    password: hashedPassword,
    email,
    usertype
  });


  try {
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;

//   const user = await User.findOne({ username });

//   var jwtkey = "manesh@2023++";

//   if (user) {
//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (passwordMatch) {
//         let payload={
//             usertype:user.usertype
//         }
//         console.log(user)
//         const token=jwt.sign(payload,jwtkey)
//       res.status(200).send(token);
//     } else {
//       res.status(401).json({ error: "Invalid credentials" });
//     }
//   } else {
//     res.status(401).json({ error: "Invalid credentials" });
//   }
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
