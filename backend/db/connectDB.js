const mongoose = require("mongoose");
const DB_NAME=require('../constant')

const connectDb = async () => {
  try {
    await mongoose
      .connect(`${process.env.MONGO_URL}/${DB_NAME}`, {
      })
      .then(() => {
        console.log("Connected to Mongo!");
      })
      .catch((err) => {
        console.error("Error connecting to Mongo", err);
      });
    console.log(`Server Running On ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`${error}`);
  }
};
module.exports = connectDb;
