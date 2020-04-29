const db = require("../models/index");
const Bill = db.bill;


exports.getAllBillById = async (req, res) => {
    let { userid } = req.query;
    try {
        let data = await Bill.findAll({ where: { userid: userid } });
        return res.json(data);
    } catch (error) {
        return res.status(500).json({
            error: 'Error'
        });
    }
}

exports.updateCatalog = async (req, res) => {
    let id = req.body.idbill;
    let status = req.body.status;
    try {
        let data = await Bill.findOne({ where: { id: id } });
        if (data != null) {
            if (status >= -1 && status <=2) { //huy don hang
                await Bill.update({ status: status }, { where: { id: id } });
                return res.status(200).json({
                    message: "Cập nhật thành công!",
                    idbill: id
                });
            }
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