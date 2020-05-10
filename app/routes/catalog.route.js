const experss = require("express");
const router = experss.Router();
const catalog = require("../controllers/catalog.controller");

// router.get("/", catalog.findAll);
//localhost:8080/api/catalog?catalogtypeid=1&offset=1&limit=6
router.get("/", catalog.findByCatalogType);

//localhost:8080/api/catalog/view/{id}
router.get("/view/:id", catalog.findByCatalodId);

//localhost:8080/api/catalog/detail/{id} chi tiết sản phẩm
router.get("/detail/:id", catalog.findDetailByCatalodId);

//localhost:8080/api/catalog/seach?keyword=tuandz tim kiem
router.get("/seach", catalog.seachCatalog);

//localhost:8080/api/catalog/suggest?keyword=tuandz
router.get("/suggest", catalog.getListName);

//localhost:8080/api/catalog/homepage
router.get("/home", catalog.findHome);

//localhost:8080/api/catalog/mobile
router.get("/mobile", catalog.findMobiles);

//localhost:8080/api/catalog/laptop
router.get("/laptop", catalog.findLaptops);

//localhost:8080/api/catalog/load?page=home&title=noi-bat&offset=2&limit=6
router.get("/load", catalog.getCatalogLoad);


router.post("/", catalog.save);

router.put("/", catalog.updateStatus);

//localhost:8080/api/catalog/id
router.delete("/:id", catalog.delete);

module.exports = router;