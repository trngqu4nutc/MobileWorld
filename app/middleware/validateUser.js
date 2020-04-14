const db = require("../models");
const User = db.user;

validateId = (req, res, next) => {
    let {id} = req.body;
    try {
        let result = await User.findByPk(id);
        if(result != null){
            next();
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

const validateUser = {
    validateId: validateId
}

module.exports = validateUser;

