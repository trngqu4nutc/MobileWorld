const db = require('../models');
const Catalog = db.catalog;
const CatalogType = db.catalogtype;
const Specifications = db.specifications;
const Specificationsmobile = db.specificationsmobile;
const Specificationslaptop = db.specificationslaptop;

const Op = require("sequelize").Op;

exports.save = async (req, res) => {
    let { catalog, specifications } = req.body;
    let specificationsProduct;
    if (req.body.specificationsmobile != null) {
        specificationsProduct = req.body.specificationsmobile;
    } else if (req.body.specificationslaptop != null) {
        specificationsProduct = req.body.specificationslaptop
    }
    let transaction;
    try {
        transaction = await db.sequelize.transaction();
        let data;
        if (catalog.id) {
            await Catalog.update(catalog, { where: { id: catalog.id } }, { transaction });
            await Specifications.update(
                specifications,
                { where: { catalogid: catalog.id } },
                { transaction }
            );
            if (catalog.catalogtypeid == 1) {
                await Specificationsmobile.update(
                    specificationsProduct,
                    { where: { catalogid: catalog.id } },
                    { transaction }
                );
            } else {
                await Specificationslaptop.update(
                    specificationsProduct,
                    { where: { catalogid: catalog.id } },
                    { transaction }
                );
            }
            await transaction.commit();
            return res.json({
                message: "Product was update successfully!"
            });
        } else {
            let catalogs = await Catalog.findAll({ where: { name: catalog.name } });
            if (catalogs.length >= 1) {
                return res.json({
                    message: "Product was exists!"
                });
            } else {
                data = await Catalog.create(catalog, { transaction });
                if (data != null) {
                    if (specifications != null) {
                        specifications.catalogid = parseInt(data.id);
                        data.specifications = await Specifications.create(specifications, { transaction });
                        if (catalog.catalogtypeid === 1 && specificationsProduct != null) {
                            specificationsProduct.catalogid = parseInt(data.id);
                            data.specificationsProduct = await Specificationsmobile.create(specificationsProduct, { transaction });
                            await transaction.commit();
                            return res.json({
                                catalog: data,
                                specifications: data.specifications,
                                specificationsmobile: data.specificationsProduct
                            });
                        } else if (catalog.catalogtypeid === 2 && specificationsProduct != null) {
                            specificationsProduct.catalogid = parseInt(data.id);
                            data.specificationsProduct = await Specificationslaptop.create(specificationsProduct, { transaction });
                            await transaction.commit();
                            return res.json({
                                catalog: data,
                                specifications: data.specifications,
                                specificationslaptop: data.specificationsProduct
                            });
                        } else {
                            await transaction.commit();
                            return res.json({
                                catalog: data,
                                specifications: data.specifications
                            });
                        }
                    } else {
                        await transaction.commit();
                        return res.json({
                            catalog: data
                        });
                    }
                }
            }
        }
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
            res.status(500).send({
                message:
                    error.message || "Some error occurred while saving the category."
            });
        }
    }
}

exports.delete = async (req, res) => {
    let id = req.params.id;
    let transaction;
    try {
        transaction = await db.sequelize.transaction();
        let data = await Catalog.findByPk(id);
        if (data == null) {
            if(data.catalogtypeid == 1){
                await Specificationsmobile.destroy({ where: { catalogtypeid: data.catalogtypeid } }, { transaction });
            }else{
                await Specificationslaptop.destroy({ where: { catalogtypeid: data.catalogtypeid } }, { transaction });
            }
            await Specifications.destroy({ where: { catalogtypeid: data.catalogtypeid } }, { transaction });
            await Catalog.destroy({ where: { id: id } }, { transaction });
            return res.json({
                message: "Product was deleted successfully!"
            });
        }
        return res.status(500).json({
            message: "Could not delete Product with id=" + id
        });
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        return res.status(500).json({
            message: "Could not delete Product with id=" + id
        });
    }
}

//catalogType
exports.findByCatalogType = async (req, res) => {
    let { catalogtypeid, offset, limit } = req.query;
    try {
        // const catalogid = await CatalogType.findOne({ where: { catalogtype: catalogtype } });
        if (catalogtypeid != null) {
            const data = await Catalog.findAll({
                attributes: ['id', "name", "pictureuri", "price", "description", "catalogtypeid"],
                offset: (parseInt(offset) - 1) * parseInt(limit),
                limit: parseInt(limit),
                where: { catalogtypeid: catalogtypeid }
            });
            res.json({
                title: "Android",
                products: data
            });
        } else {
            res.status(500).json({
                message: `Can not find catalog by catalog name ${catalogtype}`
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

//get localhost:8080/api/catalog/{id}
exports.findByCatalodId = async (req, res) => {
    let { id } = req.params;
    try {
        let data = await Catalog.findByPk(
            id,
            { attributes: ['id', 'name', 'pictureuri', 'price', 'description', 'content'] });
        if (data != null) {
            return res.status(200).json(data);
        } else {
            return res.status(200).json({
                error: `Can not find catalog by id: ${id}`
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

//get localhost:8080/api/catalog/detail/{id}
exports.findDetailByCatalodId = async (req, res) => {
    let { id } = req.params;
    try {
        let data = {};
        catalog = await Catalog.findByPk(
            id,
            { attributes: ['id', 'name', 'pictureuri', 'price', 'description', 'catalogtypeid', 'quantity'] });
        data.specifications = await Specifications.findOne({
            attributes: ['cpu', 'ram', 'screen', 'os'],
            where: { catalogid: catalog.id }
        });
        if (catalog.catalogtypeid == 1) {
            data.specificationsmobile = await Specificationsmobile.findOne({
                attributes: ['backcamera', 'frontcamera', 'internalmemory', 'memorystick', 'sim', 'batery'],
                where: { catalogid: catalog.id }
            });
            return res.status(200).json({
                info: catalog,
                technical: convertMobile(data)
            });
        } else if (catalog.catalogtypeid == 2) {
            data.specificationslaptop = await Specificationslaptop.findOne({
                attributes: ['cardscreen', 'connector', 'harddrive', 'design', 'size', 'release'],
                where: { catalogid: catalog.id }
            });
            return res.status(200).json({
                info: catalog,
                technical: convertLaptop(data)
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

exports.findHome = async (req, res) => {
    //san pham moi, noi bat, mat hang
    try {
        let newCatalogs = {
            title: "Sản phẩm mới",
            product: mapCatalog(await getListCatalog('createdAt', 'DESC', 1), await getListCatalog('createdAt', 'DESC', 2)),
            mode: -1
        }
        let highCatalogs = {
            title: "Nổi bật",
            product: mapCatalog(await getListCatalog('price', 'DESC', 1), await getListCatalog('price', 'DESC', 2)),
            mode: -1
        }
        let listCatalog = {
            title: "Mặt Hàng",
            product: await getListCatalogOffset(0)
        }
        res.status(200).json([newCatalogs, highCatalogs, listCatalog]);
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

exports.findLaptops = async (req, res) => {
    //san pham moi, noi bat, mat hang
    try {
        let newCatalogs = {
            title: "Sản phẩm mới",
            product: await getListCatalog('createdAt', 'DESC', 2),
            mode: -1
        }
        let highCatalogs = {
            title: "Nổi bật",
            product: await getListCatalog('price', 'DESC', 2),
            mode: -1
        }
        let listCatalog = {
            title: "Mặt Hàng",
            product: await Catalog.findAll({
                attributes: ['id', 'name', 'pictureuri', 'price', 'description', 'catalogtypeid', 'quantity'],
                offset: 0, limit: 6,
                where: { catalogtypeid: 2 }
            })
        }
        res.status(200).json([newCatalogs, highCatalogs, listCatalog]);
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

exports.findMobiles = async (req, res) => {
    try {
        let newCatalogs = {
            title: "Sản phẩm mới",
            product: await getListCatalog('createdAt', 'DESC', 1, 0, 6),
            mode: -1
        }
        let highCatalogs = {
            title: "Nổi bật",
            product: await getListCatalog('price', 'DESC', 1, 0, 6),
            mode: -1
        }
        let listCatalog = {
            title: "Mặt Hàng",
            product: await Catalog.findAll({
                attributes: ['id', 'name', 'pictureuri', 'price', 'description', 'catalogtypeid', 'quantity'],
                offset: 0, limit: 6,
                where: { catalogtypeid: 1 }
            })
        }
        res.status(200).json([newCatalogs, highCatalogs, listCatalog]);
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

//localhost:8080/api/catalog/seach?keyword=tuandz?offset=1?limit=2
exports.seachCatalog = async (req, res) => {
    let { keyword, offset, limit } = req.query;
    console.log(keyword);
    try {
        let catalogs = await Catalog.findAll({
            attributes: ['id', 'name', 'pictureuri', 'price', 'description', 'catalogtypeid', 'quantity'],
            offset: (parseInt(offset) - 1) * parseInt(limit),
            limit: parseInt(limit),
            where: {
                name: { [Op.substring]: keyword }
            }
        });
        if (catalogs.length == 0) {
            return res.status(200).json({
                error: `Can not find any catalog with keyword: ${keyword}`
            });
        } else {
            return res.status(200).json(catalogs);
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

//localhost:8080/api/catalog/suggest?keyword=tuandz
exports.getListName = async (req, res) => {
    let { keyword } = req.query;
    try {
        let result = await Catalog.findAll({
            attributes: ['name'],
            where: {
                name: { [Op.substring]: keyword }
            }
        });
        return res.status(200).json(castToListName(result));
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

//localhost:8080/api/catalog/load?page=home&title=noi-bat&offset=2&limit=6
exports.getCatalogLoad = async (req, res) => {
    let { page, title, offset, limit } = req.query;
    offset = parseInt(offset) - 1;
    limit = parseInt(limit);
    try {
        if (page == "home") {
            if (title == "san-pham-moi") {
                let catalogs = mapCatalog(await getListCatalog('createdAt', 'DESC', 1, offset * (limit / 2)), await getListCatalog('createdAt', 'DESC', 2, offset * (limit / 2)));
                return res.status(200).json(catalogs);
            } else if (title == "noi-bat") {
                let catalogs = mapCatalog(await getListCatalog('price', 'DESC', 1, offset * (limit / 2)), await getListCatalog('price', 'DESC', 2, offset * (limit / 2)));
                return res.status(200).json(catalogs);
            } else if (title == "mat-hang") {
                let catalogs = await getListCatalogOffset(offset * limit, limit);
                return res.status(200).json(catalogs);
            }
        } else if (page == "mobile") {
            return res.status(200).json(await loadCatalog(title, offset, limit, 1));
        } else if (page == "laptop") {
            return res.status(200).json(await loadCatalog(title, offset, limit, 2));
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

const convertMobile = (data) => {
    return {
        cpu: data.specifications.cpu,
        ram: data.specifications.ram,
        screen: data.specifications.screen,
        os: data.specifications.os,
        backcamera: data.specificationsmobile.backcamera,
        frontcamera: data.specificationsmobile.frontcamera,
        internalmemory: data.specificationsmobile.internalmemory,
        memorystick: data.specificationsmobile.memorystick,
        sim: data.specificationsmobile.sim,
        batery: data.specificationsmobile.batery
    }
}

const convertLaptop = (data) => {
    return {
        cpu: data.specifications.cpu,
        ram: data.specifications.ram,
        screen: data.specifications.screen,
        os: data.specifications.os,
        cardscreen: data.specificationslaptop.cardscreen,
        connector: data.specificationslaptop.connector,
        harddrive: data.specificationslaptop.harddrive,
        design: data.specificationslaptop.design,
        size: data.specificationslaptop.size,
        release: data.specificationslaptop.release
    };
}

const mapCatalog = (mobiles, laptops) => {
    return mobiles.concat(laptops);
}

const getListCatalog = async (name, soft, catalogtypeid, offset = 0, limit = 3) => {
    return await Catalog.findAll({
        attributes: ['id', 'name', 'pictureuri', 'price', 'description', 'catalogtypeid', 'quantity'],
        offset: offset, limit: limit,
        order: [[name, soft]],
        where: { catalogtypeid: catalogtypeid }
    });
}

const getListCatalogOffset = async (offset, limit = 6) => {
    return await Catalog.findAll({
        attributes: ['id', 'name', 'pictureuri', 'price', 'description', 'catalogtypeid', 'quantity'],
        offset: offset, limit: limit
    });
}

const castToListName = (list) => {
    let result = [];
    list.forEach(item => {
        result.push(item.name);
    });
    return result;
}

const loadCatalog = async (title, offset, limit, catalogtypeid) => {
    let catalogs = [];
    if (title == "san-pham-moi") {
        catalogs = await getListCatalog('createdAt', 'DESC', catalogtypeid, offset * limit, limit);
    } else if (title == "noi-bat") {
        catalogs = await getListCatalog('price', 'DESC', catalogtypeid, offset * limit, limit);
    } else if (title == "mat-hang") {
        catalogs = await Catalog.findAll({
            attributes: ['id', 'name', 'pictureuri', 'price', 'description', 'catalogtypeid', 'quantity'],
            offset: offset * limit, limit: limit,
            where: { catalogtypeid: catalogtypeid }
        });
    }
    return catalogs;
}