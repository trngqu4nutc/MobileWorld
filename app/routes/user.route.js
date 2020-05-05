const authJwt = require("../middleware/authJwt");
const controller = require("../controllers/user.controller");
const upload = require("../util/uploadImage");

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

//update user
router.put("/user", controller.update);

//update image
router.put("/user/image", upload.single("file"), controller.updateAvatar);

//change password
router.put("/user/password", controller.changePassword);

module.exports = router;