const db = require("../models");
const History = db.history;

exports.save = async (req, res) => {
    let data = req.body;
    try {
        data.forEach(async element => {
            await History.create(element);
        });
        return res.status(200).json({
            message: "Thêm thành công!"
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}