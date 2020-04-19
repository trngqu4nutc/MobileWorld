const db = require("../models/index");
const Order = db.order;
const OrderItems = db.orderitems;

exports.getCatalogInCart = async (req, res) => {
    let buyerid = req.query.id;
    try {
        let order = await Order.findOne({ where: { buyerid: buyerid } });
        if (order != null) {
            let result = await OrderItems.findAll({
                attributes: ['catalogid', 'pictureuri', 'catalogname', 'unit', 'unitprice'],
                where: { orderid: order.id }
            });
            if (result.length == 0) {
                return res.status(200).json({
                    error: "You have no items in your shopping cart!"
                });
            } else {
                return res.status(200).json(result);
            }
        } else {
            await Order.create({ buyerid: buyerid, status: 0 });
            return res.status(200).json({
                error: "You have no items in your shopping cart!"
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

exports.addOrder = async (req, res) => {
    let buyerid = req.headers["id"];
    try {
        let order = await Order.findOne({ where: { buyerid: buyerid } });
        if (order == null) {
            await Order.create({ buyerid: buyerid, status: 0 });
            return res.status(200).json({
                message: "Create order success"
            });
        } else {
            return res.status(500).json({
                message: "This order was exists"
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

exports.addCatalogInCart = async (req, res) => {
    let buyerid = req.headers["id"];
    let { catalogid, catalogname,unitprice,unit,pictureuri } = req.body;
    let transaction = await db.sequelize.transaction();
    try {
        let order = await Order.findOne({ where: { buyerid: buyerid } });
        if (order != null) {
            let catalog = {
                catalogid: catalogid,
                catalogname: catalogname,
                unitprice: unitprice,
                unit: unit,
                pictureuri: pictureuri,
                orderid: order.id
            }
            if (order.status == 0) {
                let result = await OrderItems.findOne({ where: { orderid: order.id, catalogid: catalog.catalogid } });
                console.log(order.id);
                if (result != null) {
                    return res.status(200).json({
                        error: "Catalog was exists!"
                    });
                } else {
                    catalog = await OrderItems.create(catalog, { transaction });
                    if (catalog != null) {
                        await transaction.commit();
                        return res.status(200).json({
                            message: "Add to cart successfully"
                        });
                    } else {
                        return res.status(500).json({
                            error: `Can not add to cart with id: ${order.id}`
                        });
                    }
                }
            } else {
                return res.status(500).json({
                    error: "Cart not avaiable"
                });
            }
        } else {
            order = await Order.create({ buyerid: buyerid, status: 0 }, { transaction });
            catalog.orderid = order.id;
            catalog = await OrderItems.create(catalog, { transaction });
            if (catalog != null) {
                await transaction.commit();
                return res.status(200).json({
                    message: "Add to cart successfully"
                });
            } else {
                return res.status(500).json({
                    error: `Can not add to cart with id: ${order.id}`
                });
            }
        }
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
            return res.status(500).json({
                error: error.message
            });
        }
    }
}

exports.saveOderItems = async (req, res) => {
    let buyerid = req.headers["id"];
    let { catalogid,unitprice,unit } = req.body;
    try {
        let order = await Order.findOne({ where: { buyerid: buyerid } });
        if (order.status == 0) {
            console.log(order.status);
            let result = await OrderItems.update({ unitprice: unitprice, unit: unit }, { where: { catalogid: catalogid, orderid: order.id } });
            console.log(result);
            if(result == 1){
                return res.status(200).json({
                    message: "Update to cart successfully"
                });
            }else{
                return res.status(500).json({
                    error: "Cart not avaiable"
                });
            }
        } else {
            return res.status(500).json({
                error: "Cart not avaiable"
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

exports.acceptOrder = async (req, res) => {
    let buyerid = req.headers["id"];
    try {
        let result = await Order.update({ status: 1 }, { where: { buyerid: buyerid } });
        if (result == 1) {
            return res.status(200).json({
                message: "Update to cart successfully"
            });
        } else {
            return res.status(500).json({
                error: `Can not update to cart with id: ${buyerid}`
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

exports.deleteOnCart = async (req, res) => {
    let buyerid = req.headers["id"];
    let catalogs = req.body;
    console.log(catalogs);
    let transaction = await db.sequelize.transaction();
    try {
        let order = await Order.findOne({ where: { buyerid: buyerid } });
        if (order.status == 0) {
            if(catalogs.length > 0){
                catalogs.forEach(async catalog => {
                    await OrderItems.destroy({ where: { catalogid: catalog.catalogid, orderid: order.id } }, { transaction });
                });
                await transaction.commit();
                return res.status(200).json({
                    message: "Delete on cart successfully"
                });
            }else{
                await transaction.rollback();
                return res.status(500).json({
                    error: `Can not delete on cart`
                });
            }
        }else {
            if (transaction) {
                await transaction.rollback();
            }
            return res.status(500).json({
                error: `Can not delete on cart`
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}