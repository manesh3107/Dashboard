  const mongoose = require("mongoose");
  const cron = require("node-cron");

  const taskSchema = new mongoose.Schema(
    {
      projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
      assignedManager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      title: {
        type: String,
        required: true,
      },
      description: String,
      status: String,
      dueDate: Date,
      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  );

  // Mongoose middleware to automatically update status to "pending" when due date is overdue
  taskSchema.pre("save", function (next) {
    if (this.dueDate && this.dueDate < new Date() && this.status !== "complete") {
      this.status = "pending";
    }
    next();
  });

  const Task = mongoose.model("Task", taskSchema);

  // Schedule a cron job to update task statuses periodically (e.g., every day)
  cron.schedule("0 0 * * *", async () => {
    try {
      const overdueTasks = await Task.find({
        dueDate: { $lt: new Date() },
        status: { $ne: "complete" },
      });

      if (overdueTasks.length > 0) {
        await Task.updateMany(
          { _id: { $in: overdueTasks.map((task) => task._id) } },
          { $set: { status: "pending" } }
        );

        console.log("Updated overdue task statuses to 'pending'");
      }
    } catch (error) {
      console.error("Error updating overdue task statuses:", error);
    }
  });

  module.exports = Task;
