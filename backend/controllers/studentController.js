const mongoose = require("mongoose");
const Project = require("../models/projectModel");
const Task = require("../models/taskModel");
const User = require("../models/userModel");
const { login } = require("./userController");
const DailyUpdate = require("../models/dailyUpdatesModel");

const getFellowStudents = async (req, res) => {
  try {
    if (req.usertype === "student") {
      // Students can only view fellow students but cannot delete them.
      const students = await User.find({
        isDeleted: false,
        usertype: "student",
      }).select("username usertype email");

      const fellowStudents = [
        { admin: [] },
        { manager: [] },
        { student: students },
      ];
      res.status(200).json(fellowStudents);
    } else {
      res.status(404).send({ message: "unauthorized user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const viewProjects = async (req, res) => {
  try {
    if (req.usertype === "student") {
      const userId = req._id;

      // Students can only view the projects assigned to them.
      const project = await Task.find(
        { assignedStudents: userId, isDeleted: false },
        { assignedManager: 0 }
      )
        // .populate("assignedManager", "username")
        .populate("assignedStudents", "username")
        .populate("projectId", "title");

      if (!project) {
        return res
          .status(404)
          .json({ error: "Project not found or not assigned to the student" });
      }

      res.status(200).json(project);
    } else {
      res.status(404).send({ message: "unauthorized user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateDailyWork = async (req, res) => {
  try {
    const studentId = req._id; // Assuming you have the user ID in req._id
    const { content } = req.body;
    const { taskId } = req.params;

    // Validate that dailyUpdate is not empty
    if (!content.trim()) {
      return res
        .status(400)
        .json({ message: "Please add something in the Update content" });
    }

    let update = await DailyUpdate.findOne({ taskId, studentId });

    if (!update) {
      update = new DailyUpdate({
        studentId,
        taskId,
        dailyUpdates: [{ content, createdAt: new Date() }],
      });
    } else {
      update.dailyUpdates.push({ content, createdAt: new Date() });
    }

    await update.save();

    res.status(201).json({ update });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const viewProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { dailyTask } = req.body;

    // Find and update (or insert) the document with the specified userId and projectId
    const updatedProject = await Dailytask.findOneAndUpdate(
      { $and: [{ studentId: req._id }, { projectId: projectId }] },
      { dailyTask },
      { new: true, upsert: true }
    );

    // Send the updated (or newly inserted) project as a response
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error(error);
    // Handle other errors by sending a 500 Internal Server Error response
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getFellowStudents,
  viewProjects,
  updateDailyWork,
  viewProject,
};
