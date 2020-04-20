const db = require("../models/index");
const Basket = db.basket;
const Bill = db.bill;

// add/update
exports.addCatalogInCart = async (req, res) => {
    let buyerid = req.headers["id"];
    let { catalogid, unit } = req.body;
    let transaction;
    try {
        transaction = await db.sequelize.transaction();
        let basket = await Basket.findOne({ where: { buyerid: buyerid, catalogid: catalogid } });
        if (basket == null) {
            basket = await Basket.create({ buyerid: buyerid, catalogid: catalogid, unit: unit }, { transaction });
            if (basket != null) {
                await transaction.commit();
                return res.status(200).json({
                    message: "Add catalog to cart scuccesfully"
                });
            }
        } else {
            let result = await Basket.update(
                { unit: (basket.unit + parseInt(unit)) },
                { where: { buyerid: buyerid, catalogid: catalogid } },
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
    let buyerid = req.headers["id"];
    let { catalogid, unitprice, unit } = req.body;
    try {

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

exports.acceptBasket = async (req, res) => {
    let buyerid = req.headers["id"];
    try {

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

exports.deleteOnCart = async (req, res) => {
    let buyerid = req.headers["id"];
    let catalogids = req.body;
    console.log(catalogids.length)
    let transaction;
    try {
        transaction = await db.sequelize.transaction();
        if (catalogids.length > 0) {
            // catalogids.forEach(async item => {
            //     await Basket.destroy({ where: { catalogid: item, buyerid: buyerid } }, { transaction });
            // });
            for (let i = 0; i < catalogids.length; i++) {
                await Basket.destroy({ where: { catalogid: catalogids[i], buyerid: buyerid } }, { transaction });
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