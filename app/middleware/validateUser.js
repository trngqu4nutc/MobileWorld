const db = require("../models");
const User = db.user;

validateId = async (req, res, next) => {
    let id = req.headers["id"];
    try {
        let result = await User.findByPk(id);
        if(result != null){
            next();
        }else{
            return res.status(500).json({
                error: "Unauthoried"
            })
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

const validateUser = {
    validateId: validateId
}

module.exports = validateUser;

