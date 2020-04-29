const db = require("../models/index");
const Bill = db.bill;


exports.getAllBillById = async (req, res) => {
    let {userid, type} = req.query;
    try {
        let data = await Bill.findAll({ where: { userid: userid, status: type } });
        return res.json(data);
    } catch (error) {
        return res.status(500).json({
            error: 'Error'
        });
    }
}

exports.cancelCatalog = async (req, res) => {
    let id = req.body.idbill;
    try {
        let data = await Bill.findOne({ where: {id: id, status: 0} });
        if(data != null){
            await Bill.update({status: -1}, {where: {id: id}});
            return res.status(200).json({
                message: "Order canceled successfully!"
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

exports.comfirmOrder = async (req, res) => {
    let id = req.body.idbill;
    try {
        let data = await Bill.findOne({ where: {id: id, status: 0} });
        if(data != null){
            await Bill.update({status: 1}, {where: {id: id}});
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

exports.comfirmGetOrder = async (req, res) => {
    let id = req.body.idbill;
    try {
        let data = await Bill.findOne({ where: {id: id, status: 1} });
        if(data != null){
            await Bill.update({status: 2}, {where: {id: id}});
            return res.status(200).json({
                message: "Comfirm successfully!"
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