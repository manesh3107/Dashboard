const express = require("express");
const { login,register,logout,myProfile } = require('../controllers/userController');
const { authenticateToken } = require("../middlewares/jwtauthenticate");

const router = express.Router();

router.post("/login", login);
router.post("/register",register)
router.post("/logout",logout)
router.get('/myProfile',authenticateToken,myProfile)

module.exports = router;


