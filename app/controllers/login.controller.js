const db = require('../models');
const User = db.user;
const Role = db.role;

const nodemailer = require("nodemailer");
const transport = require("../config/email.config");

const Op = db.Sequelize.Op;
var bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
    let { username, password } = req.body;
    try {
        let user = await User.findOne({ where: { username: username } });
        if (user != null) {
            if (bcrypt.compareSync(password, user.password)) {
                return res.status(200).json(castUser(user));
            }
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

exports.register = async (req, res) => {
    let transaction = await db.sequelize.transaction();
    try {
        let user = await User.create({
            username: req.body.username,
            fullname: req.body.fullname,
            email: req.body.email,
            status: true,
            phonenumber: req.body.phonenumber,
            address: req.body.address,
            gender: 0,
            password: bcrypt.hashSync(req.body.password, 12)
        }, { transaction });
        if (user != null) {
            let data = await user.setRoles([1], { transaction });
            if (data != null) {
                await transaction.commit();
                const mailOptions = {
                    from: transport.auth.user,
                    to: req.body.email,
                    subject: "Chào mừng bạn đến với MobileWorld!",
                    text: `Bạn đã đăng ký tài khoản ${req.body.username} thành công!`
                }
                await transporter.sendMail(mailOptions);
                return res.status(200).json(castUser(user));
            }
        }
        res.status(200).json({ error: error.message });
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
            res.status(500).send({ error: error.message });
        }
    }
}

exports.loginByFacebook = async (req, res) => {
    let { fullname, id, email } = req.body;
    try {
        let user = await User.findOne({ where: { username: "" + id } });
        if (user != null) {
            return res.status(200).json(castUser(user));
        } else {
            user = await User.create({ username: "" + id, password: bcrypt.hashSync("facebook", 12), status: true, fullname: fullname, email: email, gender: 0 });
            await user.setRoles([1]);
            return res.status(200).json(castUser(user));
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

exports.forGotPassword = async (req, res) => {
    let { email, username } = req.body;
    const mailOptions = {
        from: transport.auth.user,
        to: email,
        subject: "Your password has been changed.",
        text: ""
    }
    try {
        let data = await User.findOne({ where: { username: username, email: email } });
        if (data != null) {
            let password = makePassword();
            let check = await User.update(
                { password: bcrypt.hashSync(password, 12) },
                { where: { username: username } }
            );
            if (check == 1) {
                mailOptions.text = "Password: " + password;
                let infor = await transporter.sendMail(mailOptions);
                if(infor != null){
                    console.log(infor);
                    return res.status(200).json({
                        message: "Please check new password in your email!"
                    });
                }
            }
        }
        return res.status(500).json({
            error: "Không thể tiến hành xác thực."
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

const castUser = (user) => {
    return {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        address: user.address,
        phonenumber: user.phonenumber,
        gender: user.gender
    }
}

const makePassword = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}