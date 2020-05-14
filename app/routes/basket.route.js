const express = require("express");
const router = express.Router();
const basket = require("../controllers/basket.controller");
const authJwt = require("../middleware/authJwt");

//localhost:8080/api/basket lay danh sach catalog in cart
router.get("/", [authJwt.verifyToken], basket.findAll);

//localhost:8080/api/basket/add them/sua catalog vao gio hang
router.post("/add", [authJwt.verifyToken], basket.addCatalogInCart);

//localhost:8080/api/basket/delete
router.post("/delete", [authJwt.verifyToken], basket.deleteOnCart);

//localhost:8080/api/basket/accept dat hang status = 0
router.post("/accept", [authJwt.verifyToken], basket.acceptBasket);

module.exports = router;