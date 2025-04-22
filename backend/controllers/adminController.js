const Project = require("../models/projectModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const Task = require("../models/taskModel");
const Method = require("../models/methods");

const getUsers = async (req, res) => {
  try {
    if (req.usertype === "admin") {
      const admins = await User.find({
        isDeleted: false,
        usertype: "admin",
      }).select("username usertype");
      const managers = await User.find({
        isDeleted: false,
        usertype: "manager",
      }).select("username usertype");
      const students = await User.find({
        isDeleted: false,
        usertype: "student",
      }).select("username usertype");

      const users = [
        { admin: admins },
        { manager: managers },
        { student: students },
      ];

      res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      res.header("Access-Control-Allow-Credentials", true);
      res.status(200).json(users);
    } else {
      res.status(404).send({ message: "unauthorized user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.usertype === "admin") {
      const { userId } = req.params;

      // Soft delete by updating isDeleted field
      await User.findByIdAndUpdate(userId, { isDeleted: true });

      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(400).send({ message: "unauthorizes User" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createProject = async (req, res) => {
  try {
    if (req.usertype === "admin") {
      const adminId = req._id;
      const { title, description, dueDate, comments, managerId } = req.body;

      // Validate that exactly 1 manager and 3 students are assigned

      if (!managerId) {
        return res.status(400).json({
          error: "Invalid assignment. Please assign a manager .",
        });
      }

      const manager = await User.findById(managerId);
      // const students = await User.find({ _id: { $in: studentIds } });

      if (!manager || manager.usertype !== "manager") {
        return res.status(400).json({
          error: "Invalid assignment. Please assign a valid manager.",
        });
      }

      // const project = new Project({
      //   title,
      //   description,
      //   dueDate,
      //   comments,
      //   assignedManager: managerId,
      //   assignedStudents: studentIds,
      // });

      // await project.save();

      const data = {
        title,
        description,
        dueDate,
        comments,
        assignedManager: managerId,
        admin: adminId,
      };
      Method.postMethod(Project, data);
      res.status(201).json({ message: "Project created successfully" });
    } else {
      res.status(404).send({ message: "unauthorized user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProject = async (req, res) => {
  try {
    if (req.usertype === "admin") {
      const { projectId } = req.params;
      const project = await Project.findOne({ _id: projectId });
      res.status(200).json(project);
    } else {
      res.status(404).send({ message: "unauthorized user" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const updateProject = async (req, res) => {
  try {
    if (req.usertype === "admin") {
      const { projectId } = req.params;
      const { title, description, dueDate, comments, assignedManager } =
        req.body;
      // console.log(dueDate);
      // const updatedProject = await Project.findByIdAndUpdate(projectId, {
      //   title,
      //   description,
      //   dueDate,
      //   comments,
      // });

      if (!assignedManager) {
        return res.status(400).json({
          error: "Invalid assignment. Please assign exactly 3 students.",
        });
      }

      const manager = await User.findById(assignedManager);
      // const students = await User.find({ _id: { $in: assignedStudents } });

      if (!manager || manager.usertype !== "manager") {
        return res.status(400).json({
          error: "Invalid assignment. Please assign a valid manager",
        });
      }
      const data = {
        title,
        description,
        dueDate,
        comments,
        assignedManager,
      };
      const updatedProject = await Method.updateMethod(
        Project,
        projectId,
        data
      );
      res.status(200).json({
        message: "Project updated successfully",
        project: updatedProject,
      });
    } else {
      res.status(400).send({ message: "unauthorized user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteProject = async (req, res) => {
  try {
    if (req.usertype === 'admin') {
      const { projectId } = req.params;

      await Task.updateMany({ projectId, isDeleted: false }, { isDeleted: true });

      await Project.findByIdAndUpdate(projectId, { isDeleted: true });

      res.status(200).json({ message: 'Project deleted successfully' });
    } else {
      res.status(400).send({ message: 'Unauthorized user' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProjects = async (req, res) => {
  try {
    if (req.usertype === "admin") {
      const isAdmin = true; // Replace with the logic to determine if the user is an admin

      const projectWithTasks = await Project.aggregate([
        {
          $match: {
            $and: [
              { isDeleted: false },
              isAdmin
                ? {} // If admin, don't filter by assignedManager
                : { assignedManager: new mongoose.Types.ObjectId(userId) }, // If not admin, filter by assignedManager
            ],
          },
        },
        {
          $lookup: {
            from: "tasks",
            localField: "_id",
            foreignField: "projectId",
            as: "tasks",
          },
        },

        {
          $project: {
            _id: 1,
            title: 1,
            projectDetails: "$$ROOT",
            assignedManager: 1,
            admin: 1,
            totalTasks: { $size: { $ifNull: ["$tasks", []] } }, // Handle null tasks array
            tasks: 1,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "assignedManager",
            foreignField: "_id",
            as: "assignedManagerDetails",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "admin",
            foreignField: "_id",
            as: "adminDetails",
          },
        },
      ]);

      // console.log(projectWithTasks);

      res.status(200).json(projectWithTasks);
    } else {
      res.status(404).send({ message: "unauthorized user" });
    }
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

const getTasks = async (req, res) => {
  try {
    if (req.usertype === "admin") {
      const { projectId } = req.params;
      // console.log(req._id)
      const query = projectId
        ? { projectId: projectId, isDeleted: false }
        : { isDeleted: false };
      const tasks = await Task.find(query)
        .populate("projectId", "title")
        .populate("assignedManager", "username")
        .populate("assignedStudents", "username");
      res.status(200).json(tasks);
    } else {
      res.status(404).send({ message: "unauthorized user" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createTask = async (req, res) => {
  try {
    if (req.usertype === "admin") {
      const {
        projectId,
        title,
        managerId,
        assignedStudents,
        description,
        status,
        dueDate,
      } = req.body;

      // console.log(assignedStudents);
      console.log(managerId)
      if (!managerId || !assignedStudents || assignedStudents.length !== 3) {
        return res
          .status(400)
          .json({ message: "Please assign exactly three students." });
      }
      const manager = await User.findById(managerId);
      console.log(manager.username)
      const students = await User.find({ _id: { $in: assignedStudents } });

      if (
        manager.usertype !== "manager" ||
        students.length !== 3 ||
        students.some((student) => student.usertype !== "student")
      ) {
        return res.status(400).json({
          error: "Invalid assignment. Please assign 3 valid students.",
        });
      }

      const data = {
        projectId,
        title,
        description,
        status,
        dueDate,
        assignedManager: managerId,
        assignedStudents,
      };
      Method.postMethod(Task, data);
      res.status(201).json({ message: "Task created successfully" });
    } else {
      res.status(404).send({ message: "unauthorized user" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getUsers,
  deleteUser,
  createProject,
  updateProject,
  deleteProject,
  getProjects,
  getProject,
  getTasks,
  createTask
};
