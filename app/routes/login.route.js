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

//localhost:8080/api/login/forgot
router.post("/forgot", login.forGotPassword);

module.exports = router;