const db = require("../models");
const User = db.user;
var bcrypt = require("bcryptjs");

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.update = async (req, res) => {
    let user = req.body;
    user.password = bcrypt.hashSync(user.password, 12);
    try {
        let data = await User.update(user, { where: { id: user.id } });
        if(data == 1){
            res.status(200).json({
                message: "User was updated successfully!"
            });
        }else{
            res.status(500).json({
                message: `Can not update with username: ${user.username}!`
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.findUserById = async (req, res) => {
    let {id} = req.params;
    try {
        let user = await User.findByPk(id, { attributes: ['id', 'username', 'fullname', 'email', 'phonenumber', 'address'] });
        if(user != null){
            return res.status(200).json(user);
        }else{
            return res.status(500).json({
                message: `Can not find with id: ${id}!`
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}