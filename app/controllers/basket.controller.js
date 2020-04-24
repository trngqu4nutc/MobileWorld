const db = require("../models/index");
const Basket = db.basket;
const Bill = db.bill;
const Catalog = db.catalog;

exports.findAll = async (req, res) => {
    let { userid } = req.query;
    console.log(userid);
    try {
        let data = await Basket.findAll({
            attributes: ['unit'],
            include:[{ model: Catalog, attributes: ['id', 'name', 'price', 'pictureuri', 'description', 'quantity', ] }],
            where: { userid: userid } });
        return res.json(await getListCatalog(data));
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

// add/update
exports.addCatalogInCart = async (req, res) => {
    let userid = req.headers['id'];
    let { catalogid, unit } = req.body;
    let transaction;
    try {
        transaction = await db.sequelize.transaction();
        let basket = await Basket.findOne({ where: { userid: userid, catalogid: catalogid } });
        if (basket == null) {
            basket = await Basket.create({ userid: userid, catalogid: catalogid, unit: unit }, { transaction });
            if (basket != null) {
                await transaction.commit();
                return res.status(200).json({
                    message: "Add catalog to cart scuccesfully"
                });
            }
        } else {
            let result = await Basket.update(
                { unit: (basket.unit + parseInt(unit)) },
                { where: { userid: userid, catalogid: catalogid } },
                { transaction });
            if (result == 1) {
                await transaction.commit();
                return res.status(200).json({
                    message: "Update catalog to cart scuccesfully"
                });
            }
        }
        await transaction.rollback();
        return res.status(500).json({
            message: "Can not add/update catalog to cart"
        });
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        return res.status(500).json({
            error: error.message
        });
    }

}

exports.saveBill = async (req, res) => {
    let userid = req.headers["id"];
    let { catalogid, unitprice, unit } = req.body;
    try {

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

exports.acceptBasket = async (req, res) => {
    let userid = req.headers["id"];
    let catalogs = req.body;
    let transaction;
    try {
        transaction = await db.sequelize.transaction();
        if (catalogs.length > 0) {
            if (await checkDuplicateCatalog(userid, catalogs)) {
                console.log("ok");
                for (let i = 0; i < catalogs.length; i++) {
                    let catalog = await Catalog.findByPk(
                        catalogs[i].id,
                        { attributes: ['id', 'name', 'pictureuri', 'price'] });
                    let basket = await Basket.findOne({
                        where: { catalogid: catalogs[i].id, userid: parseInt(userid) }
                    });
                    await Bill.create({
                        catalogid: catalog.id,
                        name: catalog.name,
                        pictureuri: catalog.pictureuri,
                        unit: basket.unit,
                        unitprice: basket.unit * catalog.price,
                        userid: userid
                    }, { transaction });
                    await Basket.destroy({ where: { catalogid: catalogs[i].id, userid: userid } }, { transaction });
                }
                await transaction.commit();
                return res.status(200).json({
                    message: "Accept on cart successfully"
                });
            } else {
                await transaction.rollback();
                return res.status(500).json({
                    error: `Can not Accept on cart`
                });
            }
        } else {
            await transaction.rollback();
            return res.status(500).json({
                error: `Can not Accept on cart`
            });
        }
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        return res.status(500).json({
            error: error.message
        });
    }
}

exports.deleteOnCart = async (req, res) => {
    let userid = req.headers["id"];
    let catalogids = req.body;
    let transaction;
    try {
        transaction = await db.sequelize.transaction();
        if (catalogids.length > 0) {
            // catalogids.forEach(async item => {
            //     await Basket.destroy({ where: { catalogid: item, userid: userid } }, { transaction });
            // });
            for (let i = 0; i < catalogids.length; i++) {
                await Basket.destroy({ where: { catalogid: catalogids[i], userid: userid } }, { transaction });
            }
            await transaction.commit();
            return res.status(200).json({
                message: "Delete on cart successfully"
            });
        } else {
            await transaction.rollback();
            return res.status(500).json({
                error: `Can not delete on cart`
            });
        }
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        return res.status(500).json({
            error: error.message
        });
    }
}

exports.getAllBillById = async (req, res) => {
    let {userid} = req.query;
    try {
        let data = await Bill.findAll({ where: { userid: userid, status: 0 } });
        return res.json(data);
    } catch (error) {
        return res.status(500).json({
            error: 'Error'
        });
    }
}

const checkDuplicateCatalog = async (userid, catalogs) => {
    let result = {};
    for (let i = 0; i < catalogs.length; i++) {
        result = await Bill.findOne({ where: { catalogid: catalogs[i].id, userid: userid, status: 0 } });
        console.log(result)
        if (result != null) {
            return false;
        }
    }
    return true;
}

const getListCatalog = async (data) => {
    let result = [];
    data.forEach(item => {
        item.Catalog.dataValues.unit = item.unit;
        result.push(item.Catalog);
    });
    return result;
}
