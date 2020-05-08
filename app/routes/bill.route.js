const express = require("express");
const router = express.Router();
const bill = require("../controllers/bill.controller");

//localhost:8080/api/bill?userid=17
router.get("/", bill.getAllBillById);

//localhost:8080/api/bill/notify?userid=17
router.get("/notify", bill.viewNotify);

//localhost:8080/api/bill duyet don hang
router.post("/", bill.comfirmOrder);

//localhost:8080/api/bill update don hang
router.put("/", bill.updateCatalog);

module.exports = router;