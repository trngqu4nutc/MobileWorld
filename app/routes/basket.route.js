const express = require("express");
const router = express.Router();
const basket = require("../controllers/basket.controller");
const validate = require("../middleware/validateUser");

//localhost:8080/api/basket?userid=16 lay danh sach catalog in cart
router.get("/", basket.findAll);

//localhost:8080/api/basket/bill?userid=17
router.get("/bill", basket.getAllBillById)

//localhost:8080/api/basket/add them/sua catalog vao gio hang
router.post("/add", [validate.validateId], basket.addCatalogInCart);

// //localhost:8080/api/basket them gio hang
// router.post("/", basket.addOrder);

// //localhost:8080/api/basket update gio hang
// router.put("/", basket.saveOderItems);

//localhost:8080/api/basket/delete
router.post("/delete", [validate.validateId], basket.deleteOnCart);

//localhost:8080/api/basket/accept dat hang status = 0
router.post("/accept", [validate.validateId], basket.acceptBasket);

module.exports = router;