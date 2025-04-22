const express = require("express");
const adminController = require("../controllers/adminController");
const { authenticateToken } = require("../middlewares/jwtauthenticate");
const router = express.Router();

router.get("/users",authenticateToken, adminController.getUsers);
router.delete("/users/:userId",authenticateToken, adminController.deleteUser);
router.get('/projects',authenticateToken,adminController.getProjects)
router.post("/projects",authenticateToken, adminController.createProject);
router.put("/projects/:projectId",authenticateToken, adminController.updateProject);
router.delete('/projects/:projectId',authenticateToken, adminController.deleteProject)
router.get('/projects/:projectId',authenticateToken,adminController.getProject)
router.get('/alltasks/:projectId?',authenticateToken,adminController.getTasks)
router.post("/assigntask",authenticateToken,adminController.createTask)

module.exports = router;
