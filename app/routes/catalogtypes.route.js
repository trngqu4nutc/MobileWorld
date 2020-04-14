const experss = require("express");
const router = experss.Router();
const catalogtypes = require("../controllers/catalogtypes.controller");

// const authJwt = require("../middleware/authJwt");

// const authJwt = require("../middleware/authJwt");

//localhost:8080/api/catalogtypes
router.get("/", catalogtypes.findAll);

router.post("/", catalogtypes.save);

//localhost:8080/api/catalogtypes/id
router.delete("/:id", catalogtypes.delete);

module.exports = router;