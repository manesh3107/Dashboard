const express = require("express");
const managerController = require("../controllers/managerController");
const { authenticateToken } = require("../middlewares/jwtauthenticate");

const router = express.Router();

router.get("/users",authenticateToken, managerController.getManagersAndStudents);
router.get("/projects", authenticateToken, managerController.getProjects);
router.post("/assigntask",authenticateToken,managerController.createTask)
router.put('/tasks/:taskId', authenticateToken, managerController.updateTask)
router.get('/tasks/:taskId',authenticateToken,managerController.getTask)
router.get('/alltasks/:projectId?',authenticateToken,managerController.getTasks)
router.delete('/tasks/:taskId',authenticateToken,managerController.deleteTask)
router.get('/task/taskDetails',authenticateToken,managerController.taskUpdates)
module.exports = router;
    