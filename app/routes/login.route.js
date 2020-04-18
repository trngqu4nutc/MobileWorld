const express = require("express");
const router = express.Router();
const login = require("../controllers/login.controller");
const verifySignUp = require("../middleware/verifySignUp");

//localhost:8080/api/login
router.post("/", login.login);

//localhost:8080/api/login/loginfacebook
router.post("/loginfacebook", login.loginByFacebook);

//dang ki
router.post("/register", [verifySignUp.checkDuplicateUsername], login.register);

module.exports = router;