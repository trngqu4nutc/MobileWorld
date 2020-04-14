const db = require('../models');
const Catalog = db.catalog;
const CatalogType = db.catalogtype;
const Specifications = db.specifications;
const Specificationsmobile = db.specificationsmobile;
const Specificationslaptop = db.specificationslaptop;

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
            data.catalog = await Catalog.update(catalog, { where: { id: catalog.id } });
            if (data == 1) {
                res.json({
                    message: "Product was update successfully!"
                });
            } else {
                res.json({
                    message: `Cannot update with id=${catalog.id}!`
                });
            }
        } else {
            let catalogs = await Catalog.findAll({ where: { name: catalog.name } });
            if (catalogs.length >= 1) {
                res.json({
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
                            res.json({
                                catalog: data,
                                specifications: data.specifications,
                                specificationsmobile: data.specificationsProduct
                            });
                            return;
                        } else if (catalog.catalogtypeid === 2 && specificationsProduct != null) {
                            specificationsProduct.catalogid = parseInt(data.id);
                            data.specificationsProduct = await Specificationslaptop.create(specificationsProduct, { transaction });
                            await transaction.commit();
                            res.json({
                                catalog: data,
                                specifications: data.specifications,
                                specificationslaptop: data.specificationsProduct
                            });
                            return;
                        } else {
                            await transaction.commit();
                            res.json({
                                catalog: data,
                                specifications: data.specifications
                            });
                        }
                    } else {
                        await transaction.commit();
                        res.json({
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
    try {

        let data = await Catalog.destroy({ where: { id: id } });
        if (data === 1) {
            res.json({
                message: "Product was deleted successfully!"
            });
        } else {
            res.json({
                message: `Cannot delete Tutorial with id=${id}!`
            });
        }
    } catch (error) {
        res.status(500).json({
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
                offset: parseInt(offset) - 1,
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
            title: "San pham moi",
            product: mapCatalog(await getListCatalog('createdAt', 'DESC', 1), await getListCatalog('createdAt', 'DESC', 2)),
            mode: -1
        }
        let highCatalogs = {
            title: "Noi bat",
            product: mapCatalog(await getListCatalog('price', 'DESC', 1), await getListCatalog('createdAt', 'ASC', 2)),
            mode: -1
        }
        let listCatalog = {
            title: "Mat Hang",
            product: await getListCatalogOffset(0)
        }
        res.status(200).json({
            list: [newCatalogs, highCatalogs, listCatalog]
        });
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
            title: "San pham moi",
            product: await getListCatalog('createdAt', 'DESC', 2),
            mode: -1
        }
        let highCatalogs = {
            title: "Noi bat",
            product: await getListCatalog('price', 'DESC', 2),
            mode: -1
        }
        let listCatalog = {
            title: "Mat Hang",
            product: await Catalog.findAll({
                attributes: ['id', 'name', 'pictureuri', 'price', 'description', 'catalogtypeid', 'quantity'],
                offset: 0, limit: 6,
                where: { catalogtypeid: 2 }
            })
        }
        res.status(200).json({
            list: [newCatalogs, highCatalogs, listCatalog]
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

exports.findMobiles = async (req, res) => {
    try {
        let newCatalogs = {
            title: "San pham moi",
            product: await getListCatalog('createdAt', 'DESC', 1, 6),
            mode: -1
        }
        let highCatalogs = {
            title: "Noi bat",
            product: await getListCatalog('price', 'DESC', 1, 6),
            mode: -1
        }
        let listCatalog = {
            title: "Mat Hang",
            product: await Catalog.findAll({
                attributes: ['id', 'name', 'pictureuri', 'price', 'description', 'catalogtypeid', 'quantity'],
                offset: 0, limit: 6,
                where: { catalogtypeid: 1 }
            })
        }
        res.status(200).json({
            list: [newCatalogs, highCatalogs, listCatalog]
        });
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

const getListCatalog = async (name, soft, catalogtypeid, limit = 3) => {
    return await Catalog.findAll({
        attributes: ['id', 'name', 'pictureuri', 'price', 'description', 'catalogtypeid', 'quantity'],
        offset: 0, limit: limit,
        order: [[name, soft]],
        where: { catalogtypeid: catalogtypeid }
    });
}

const getListCatalogOffset = async (offset) => {
    return await Catalog.findAll({
        attributes: ['id', 'name', 'pictureuri', 'price', 'description', 'catalogtypeid', 'quantity'],
        offset: offset, limit: 6
    });
}