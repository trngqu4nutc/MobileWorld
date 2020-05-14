const express = require("express");
const router = express.Router();
const bill = require("../controllers/bill.controller");
const authJwt = require("../middleware/authJwt");

//localhost:8080/api/bill?type=0
router.get("/", [authJwt.verifyToken], bill.getAllBillById);

//localhost:8080/api/bill/notify
router.get("/notify", [authJwt.verifyToken], bill.viewNotify);

//localhost:8080/api/bill duyet don hang
router.post("/", [authJwt.verifyToken], bill.comfirmOrder);

//localhost:8080/api/bill update don hang
router.put("/", [authJwt.verifyToken], bill.updateCatalog);

module.exports = router;