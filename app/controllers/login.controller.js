const db = require('../models');
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;
var bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
    let { username, password } = req.body;
    try {
        let user = await User.findOne({ attributes: ["username", "password"], where: { username: username } });
        if (user != null) {
            if (bcrypt.compareSync(password, users.password)) {
                res.status(200).json(user.id);
            }
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

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
            gender: req.body.gender,
            password: bcrypt.hashSync(req.body.password, 12)
        }, { transaction });
        if (user != null) {
            let data = await user.setRoles([1], { transaction });
            if (data != null) {
                await transaction.commit();
                res.send({ message: "User was registered successfully!" });
            } else {
                res.status(500).send({ error: error.message });
            }
        } else {
            res.status(500).send({ error: error.message });
        }
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
            res.status(500).send({ error: error.message });
        }
    }
};

exports.loginByFb = async (req, res) => {
    let { name, id, email } = req.body;
    try {
        let user = await User.findOne({ username: name });
        if (user != null) {
            res.status(200).json(user.id);
        } else {
            user = await User.create({ username: name, password: bcrypt.hashSync(id, 12), email: email });
            await user.setRoles([1]);
            return res.status(200).json(user.id);
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
};