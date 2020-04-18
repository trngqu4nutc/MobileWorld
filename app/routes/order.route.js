const express = require("express");
const router = express.Router();
const order = require("../controllers/order.controller");
const validate = require("../middleware/validateUser");

//localhost:8080/api/order?id=16 lay danh sach catalog in cart
router.get("/", order.getCatalogInCart);

//localhost:8080/api/order/add them catalog vao gio hang
router.post("/add", order.addCatalogInCart);

//localhost:8080/api/order them gio hang
router.post("/", order.addOrder);

//localhost:8080/api/order update gio hang
router.put("/", order.saveOderItems);

//localhost:8080/api/order/delete
router.post("/delete", order.deleteOnCart);

//localhost:8080/api/order/accept dat hang status=1
router.post("/accept", order.acceptOrder);

module.exports = router;