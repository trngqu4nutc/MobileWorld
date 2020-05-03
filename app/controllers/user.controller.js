const db = require("../models");
const User = db.user;
var bcrypt = require("bcryptjs");

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
}

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
}

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
}

exports.update = async (req, res) => {
    let user = req.body;
    console.log(user);
    if(user.password){
        user.password = bcrypt.hashSync(user.password, 12);
    }
    try {
        let data = await User.update(user, { where: { id: user.id } });
        if(data == 1){
            user = await User.findByPk(user.id, { attributes: ['id', 'username', 'fullname','email', 'phonenumber', 'address', 'gender'] });
            res.status(200).json(user);
        }else{s
            res.status(500).json({
                message: `Can not update with username: ${user.username}!`
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

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

exports.changePassword = async (req, res) => {
    let { id, oldpassword, newpassword } = req.body;
    try {
        var user = await User.findByPk(id);
        if(bcrypt.compareSync(oldpassword, user.password)){
            await User.update({ password: bcrypt.hashSync(newpassword, 12) }, { where: { id: id } });
            return res.status(200).json({
                message: "Thay đổi mật khẩu thành công!"
            });
        }
        return res.status(200).json({
            error: "Mật khẩu không hợp lệ!"
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}