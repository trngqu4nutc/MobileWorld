const authJwt = require("../middleware/authJwt");
const controller = require("../controllers/user.controller");

const express = require("express");
const router = express.Router();

//localhost:8080/api/all
router.get("/all", controller.allAccess);

//localhost:8080/api/user/find/{id}
router.get("/user/find/:id", [authJwt.verifyToken], controller.findUserById);

router.get("/user", [authJwt.verifyToken], controller.userBoard);

router.get("/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard);

//update user
router.put("/user", [authJwt.verifyToken], controller.update);

module.exports = router;