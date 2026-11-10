const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth.controller");

router.post("/register-user", AuthController.registerUser);
router.post("/login", AuthController.login);

module.exports = router;