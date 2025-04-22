const express = require("express");
const studentController = require("../controllers/studentController");
const { authenticateToken } = require("../middlewares/jwtauthenticate");

const router = express.Router();

router.get("/users",authenticateToken, studentController.getFellowStudents);
router.get("/tasks",authenticateToken, studentController.viewProjects);
router.put("/tasks/:taskId",authenticateToken, studentController.updateDailyWork);
router.get('/projects/:projectId',authenticateToken,studentController.viewProject)


module.exports = router;

