module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("Orders", {
        buyerid: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        shiptoaddress_city: {
            type: Sequelize.STRING(100)
        },
        shiptoaddress_state: {
            type: Sequelize.STRING(60)
        },
        shiptoaddress_street: {
            type: Sequelize.STRING(180)
        },
        status: {
            type: Sequelize.INTEGER
        }
    });
    return Order;
};