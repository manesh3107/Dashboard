const mongoose = require("mongoose");

const dailyUpdateSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },
  dailyUpdates: [
    {
      content: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const dailyUpdates = mongoose.model("Dailytask", dailyUpdateSchema);

module.exports = dailyUpdates;
