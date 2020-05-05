const db = require("../models");
const User = db.user;
var bcrypt = require("bcryptjs");

const nodemailer = require("nodemailer");
const transport = require("../config/email.config");

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
            res.status(200).json({
                message: `Can not update with username: ${user.username}!`
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.updateAvatar = async (req, res) => {
    try {
        let path = req.file.path.split('\\')[2];
        await User.update({ avatar: path }, { where: { id: req.headers["id"] } });
        return res.status(200).json({
            message: "Thay đổi ảnh đại diện thành công!"
        });
    } catch (error) {
        return res.status(200).json({
            error: "Có lỗi xảy ra!"
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
            return res.status(200).json({
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
            let afterUser = await User.findByPk(id);
            let content = `<p style="color: black;">Tài khoản <b>${afterUser.username}</b> đã được thay đổi mật khẩu vào lúc ${afterUser.updatedAt}.</p>`;
            content += `<p style="color: black;">Hãy chắc chắn rằng đó là bạn và liên hệ tới hòm thư ${transport.auth.user} để biết thêm thông tin chi tiết.</p>`;
            const mailOptions = {
                from: transport.auth.user,
                to: afterUser.email,
                subject: "Xác thực thay đổi mật khẩu!",
                html: content
            }
            // transporter.
            await transporter.sendMail(mailOptions);
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

const transporter = nodemailer.createTransport({
    service: transport.service,
    auth: {
        user: transport.auth.user,
        pass: transport.auth.pass
    }
});
