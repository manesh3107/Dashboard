const Project = require("../models/projectModel");
const User = require("../models/userModel");
const method = require("../models/methods");
const Task = require("../models/taskModel");
const mongoose = require("mongoose");
const DailyUpdate = require("../models/dailyUpdatesModel");

const getManagersAndStudents = async (req, res) => {
  try {
    if (req.usertype === "manager") {
      // Managers can see fellow managers and all students but cannot delete anyone.
      // const managersAndStudents = await User.find({
      //   isDeleted: false,
      //   $or: [{ usertype: "manager" }, { usertype: "student" }],
      // });
      const MgrData = {
        isDeleted: false,
        usertype: "manager",
      };
      const managers = await method.getMethod(User, MgrData);

      const StudData = {
        isDeleted: false,
        usertype: "student",
      };
      const students = await method.getMethod(User, StudData);

      const managersAndStudents = [
        { admin: [] },
        { manager: managers },
        { student: students },
      ];
      res.status(200).json(managersAndStudents);
    } else {
      res.status(404).send({ message: "unauthorized user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProjects = async (req, res) => {
  try {
    if (req.usertype === "manager") {
      const userId = req._id;

      const projectsWithTasks = await Project.aggregate([
        {
          $match: {
            assignedManager: new mongoose.Types.ObjectId(userId),
            isDeleted: false,
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
            projectName: 1,
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
        {
          $lookup: {
            from: "tasks",
            localField: "_id",
            foreignField: "projectId",
            as: "tasks", // Include projects even if no tasks
          },
        },
      ]);

      res.status(200).json(projectsWithTasks);
    } else {
      res.status(404).send({ message: "Unauthorized user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createTask = async (req, res) => {
  try {
    if (req.usertype === "manager" || req.usertype === "admin") {
      const managerId = req._id;
      const {
        projectId,
        title,
        assignedStudents,
        description,
        status,
        dueDate,
      } = req.body;

      // {
      //   projectId,
      //   title,
      //   assignedStudents,
      //   description,
      //   status,
      //   dueDate,
      // }
      console.log(assignedStudents);
      if (!assignedStudents || assignedStudents.length !== 3) {
        return res
          .status(400)
          .json({ message: "Please assign exactly three students." });
      }

      const students = await User.find({ _id: { $in: assignedStudents } });

      if (
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
      method.postMethod(Task, data);
      res.status(201).json({ message: "Task created successfully" });
    } else {
      res.status(404).send({ message: "unauthorized user" });
    }
  } catch (error) {
    console.log(error);
  }
};

const updateTask = async (req, res) => {
  try {
    if (req.usertype === "manager" || req.usertype === "admin") {
      const { taskId } = req.params; // Assuming taskId is passed in the request parameters
      const { title, assignedStudents, description, status, dueDate } =
        req.body;

      if (status !== "completed") {
        if (!assignedStudents || assignedStudents.length !== 3) {
          return res
            .status(400)
            .json({ message: "Please assign exactly three students." });
        }

        const students = await User.find({ _id: { $in: assignedStudents } });
        if (
          students.length !== 3 ||
          students.some((student) => student.usertype !== "student")
        ) {
          return res.status(400).json({
            error: "Invalid assignment. Please assign 3 valid students.",
          });
        }
      }

      const updatedTaskData = {
        title,
        description,
        status,
        dueDate,
        assignedStudents,
      };

      // Assuming you have a method to update the task in the database
      await method.updateMethod(Task, taskId, updatedTaskData);

      res.status(200).json({ message: "Task updated successfully" });
    } else {
      res.status(404).send({ message: "Unauthorized user" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTask = async (req, res) => {
  try {
    if (req.usertype === "manager" || req.usertype == "admin") {
      const { taskId } = req.params;
      console.log(taskId);
      const task = await Task.findOne({ _id: taskId });
      res.status(200).send(task);
    } else {
      res.status(404).send({ message: "unauthorized user" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const getTasks = async (req, res) => {
  try {
    if (req.usertype === "manager") {
      const { projectId } = req.params;
      // console.log(req._id)
      const query = projectId
        ? { projectId: projectId, isDeleted: false, assignedManager: req._id }
        : { isDeleted: false, assignedManager: req._id };
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

const deleteTask = async (req, res) => {
  try {
    if (req.usertype === "manager" || req.usertype === "admin") {
      const { taskId } = req.params;
      console.log(taskId);
      // const deletedProject=await Project.findByIdAndDelete(projectId); for permanent delete

      await Task.findByIdAndUpdate(taskId, {
        isDeleted: true,
      });

      res.status(200).json({ message: "Task deleted sucessfully" });
    } else {
      res.status(404).send({ message: "Unauthorized user" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
};

const taskUpdates = async (req, res) => {
  try {
    if (req.usertype === "manager") {
      const userId = req._id;
      // console.log(userId);

      //   const tasks = await Task.find({ assignedManager: userId, isDeleted: false })
      //   .populate({
      //     path: "assignedStudents",
      //     model: "User",
      //   });

      // const taskIds = tasks.map((task) => task._id);

      // const dailyUpdates = await DailyUpdate.find({ taskId: { $in: taskIds } })
      //   .populate({
      //     path: "studentId",
      //     model: "User",
      //   })
      //   .populate({
      //     path: "taskId",
      //     model: "Task",
      //   });

      // res.json({ tasks, dailyUpdates });

      const tasks = await Task.find({
        assignedManager: userId,
        isDeleted: false,
      }).populate({
        path: "assignedStudents",
        model: "User",
      });

      const taskIds = tasks.map((task) => task._id);

      const dailyUpdates = await DailyUpdate.find({ taskId: { $in: taskIds } })
        .populate({
          path: "studentId",
          model: "User",
        })
        .populate({
          path: "taskId",
          model: "Task",
        });

      // Create a map to group updates by task
      const updatesByTask = new Map();

      dailyUpdates.forEach((update) => {
        const taskId = update.taskId.toString(); // Convert ObjectId to string for comparison

        if (!updatesByTask.has(taskId)) {
          updatesByTask.set(taskId, {
            task: update.taskId,
            updates: [],
          });
        }

        updatesByTask.get(taskId).updates.push(update);
      });

      // Convert the map values to an array
      const groupedUpdates = [...updatesByTask.values()];

      // Now groupedUpdates contains an array of objects, each with a task and its updates
      // console.log(groupedUpdates);
      res.status(200).send(groupedUpdates);
      // res.status(200).send({ tasks, dailyUpdates });
    } else {
      res.status(404).send({ message: "Unauthorized user" });
    }
  } catch (error) {
    console.error("Error retrieving manager tasks and daily updates:", error);
    res.status(500).json({ error: "internal server error" });
  }
};

module.exports = {
  getManagersAndStudents,
  getProjects,
  createTask,
  updateTask,
  getTask,
  getTasks,
  deleteTask,
  taskUpdates,
};
