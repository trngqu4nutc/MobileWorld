module.exports = (sequelize, Sequelize) => {
    const OrderItems = sequelize.define("OrderItems", {
        unitprice: {
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
        catalogname: {
            type: Sequelize.STRING(50)
        }
    });
    return OrderItems;
};