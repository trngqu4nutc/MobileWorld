const authJwt = require("../middleware/authJwt");
const controller = require("../controllers/user.controller");
const upload = require("../util/uploadAvatar");

const express = require("express");
const router = express.Router();

//localhost:8080/api/all
router.get("/all", controller.allAccess);

//localhost:8080/api/user/find/{id}
router.get("/user/find/:id", controller.findUserById);

router.get("/user", [authJwt.verifyToken], controller.userBoard);

router.get("/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard);

//localhost:8080/api/user/all
router.get("/user/all", controller.getAllUser);

//update user
router.put("/user", controller.update);

//update avatar
router.put("/user/image", upload.single("file"), controller.uploadAvatar);


//change password
router.put("/user/password", controller.changePassword);

module.exports = router;