const experss = require("express");
const router = experss.Router();
const catalogbrands = require("../controllers/catalogbrands.controller");

//localhost:8080/api/catalogbrands
router.get("/", catalogbrands.findAll);

router.post("/", catalogbrands.save);

//localhost:8080/api/catalogbrands/id
router.delete("/", catalogbrands.delete);

module.exports =  router;