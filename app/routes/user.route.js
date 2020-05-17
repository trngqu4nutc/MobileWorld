const authJwt = require("../middleware/authJwt");
const controller = require("../controllers/user.controller");
const upload = require("../util/uploadAvatar");

const express = require("express");
const router = express.Router();

//localhost:8080/api/all
router.get("/all", controller.allAccess);

//localhost:8080/api/user/find
router.get("/user/find", [authJwt.verifyToken], controller.findUserById);

router.get("/user", [authJwt.verifyToken], controller.userBoard);

router.get("/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard);

//localhost:8080/api/user/all
router.get("/user/all", controller.getAllUser);

//update user
router.put("/user", [authJwt.verifyToken], controller.update);

//update avatar
router.put("/user/image", [authJwt.verifyToken], upload.single("file"), controller.uploadAvatar);


//change password
router.put("/user/password", [authJwt.verifyToken], controller.changePassword);

module.exports = router;