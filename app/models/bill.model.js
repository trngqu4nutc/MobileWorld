module.exports = (sequelize, Sequelize) => {
    const Bill = sequelize.define("Bill", {
        price: {
            type: Sequelize.DECIMAL(18, 2)
        },
        unit: {
            type: Sequelize.INTEGER
        },
        catalogid: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        pictureuri: {
            type: Sequelize.TEXT
        },
        name: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.INTEGER
        },
        shiptoaddress: {
            type: Sequelize.STRING
        }
    });
    return Bill;
};