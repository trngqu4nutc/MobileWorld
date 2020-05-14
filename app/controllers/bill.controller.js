const db = require("../models/index");
const Bill = db.bill;
const Catalog = db.catalog;
const Notification = db.notification;


exports.getAllBillById = async (req, res) => {
    let userid = req.userid;
    let { type } = req.query;
    try {
        let data = await Bill.findAll({ where: { userid: userid, status: type } });
        return res.json(data);
    } catch (error) {
        return res.status(500).json({
            error: 'Error'
        });
    }
}

//user check
exports.updateCatalog = async (req, res) => {
    let userid = req.userid;
    let id = req.body.idbill;
    let status = req.body.status;
    let transaction;
    try {
        transaction = await db.sequelize.transaction();
        let data = await Bill.findOne({ where: { id: id, userid: userid } });
        let catalog = await Catalog.findByPk(
            data.catalogid,
            { attributes: ['quantity'] });
        if (data != null) {
            if (status >= -1 && status <=2) { //huy don hang
                await Bill.update({ status: status }, { where: { id: id } }, { transaction });
                if(status == -1){ //update quantity
                    await Catalog.update({
                        quantity: catalog.quantity + data.unit },
                        { where: { id: data.catalogid } },
                        { transaction });
                    await Notification.create(
                        {
                            billid: data.id,
                            userid: data.userid,
                            title: "Đơn hàng đã hủy.",
                            content: `Đơn hàng mã số ${id} đã hủy.`,
                            status: 0
                        },
                        { transaction });
                }else if(status == 2){
                    await Notification.update(
                        {
                            title: "Đơn hàng đã giao.",
                            content: `Đơn hàng mã số ${id} đã được giao thành công.`,
                            status: 1
                        },
                        { where: { billid: data.id, userid: data.userid } },
                        { transaction });
                }
                await transaction.commit();
                return res.status(200).json({
                    message: "Cập nhật thành công!",
                    idbill: id
                });
            }
        }
        return res.status(200).json({
            error: "Order does not exist!"
        })
    } catch (error) {
        if(transaction){
            await transaction.rollback();
        }
        return res.status(500).json({
            error: error.message
        })
    }
}

//admin check
exports.comfirmOrder = async (req, res) => {
    let id = req.body.idbill;
    try {
        let data = await Bill.findOne({ where: { id: id, status: 0 } });
        if (data != null) {
            await Bill.update({ status: 1 }, { where: { id: id } });
            return res.status(200).json({
                message: "Comfirm order successfully!"
            });
        }
        return res.status(500).json({
            error: "Order does not exist!"
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

//xem thong bao
exports.viewNotify = async (req, res) => {
    let userid = req.userid;
    try {
        let data = await Notification.findAll({ where: {userid: userid} });
        await Notification.update({ status: 2 }, { where: { userid: userid } });
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}