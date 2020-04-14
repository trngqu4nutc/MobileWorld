const express = require("express");
const router = express.Router();
const order = require("../controllers/order.controller");


//localhost:8080/api/add them catalog vao gio hang
router.post("/add", order.addCatalogInCart);

//localhost:8080/api/order them gio hang
router.post("/", order.addOrder);

//localhost:8080/api/order update gio hang
router.put("/", order.saveOderItems);

//localhost:8080/api/order?id=1&catalogid=1
router.delete("/", order.deleteOnCart);

//localhost:8080/api/order/accept dat hang
router.post("/accept", order.acceptOrder);

module.exports = router;