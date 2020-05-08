const express = require("express");
const router = express.Router();
const history = require("../controllers/history.controller");

router.post("/", history.save);

module.exports = router;