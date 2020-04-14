module.exports = (sequelize, Sequelize) => {
    const BasketItems = sequelize.define("BasketItems", {
        catalogitemid: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        unitprice: {
            type: Sequelize.DECIMAL(18, 2),
            allowNull: false
        }
    });
    return BasketItems;
};