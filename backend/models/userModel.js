const mongoose=require('mongoose')


const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email:String, 
    usertype:String,
    isDeleted: { type: Boolean, default: false }
  });
  
const userModel = mongoose.model("User", userSchema);
module.exports= userModel