const express = require("express");
const router = express.Router();
const bill = require("../controllers/bill.controller");

//localhost:8080/api/bill?userid=17&type=0 type la status
router.get("/", bill.getAllBillById);

//localhost:8080/api/bill
router.post("/", bill.comfirmOrder);

router.post("/cancel", bill.cancelCatalog);

router.post("/comfirm", bill.comfirmGetOrder);

module.exports = router;