module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("Users", {
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        fullname: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        phonenumber: {
            type: Sequelize.STRING(15)
        },
        email: {
            type: Sequelize.STRING(50)
        },
        address: {
            type: Sequelize.STRING(150)
        },
        createdby: {
            type: Sequelize.STRING
        },
        modifiedby: {
            type: Sequelize.STRING
        },
        gender: {
            type: Sequelize.INTEGER
        },
        avatar: {
            type: Sequelize.STRING
        }
    });
    return User;
};