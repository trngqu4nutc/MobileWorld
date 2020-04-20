module.exports = (sequelize, Sequelize) => {
    const Basket = sequelize.define("Basket", {
        catalogid: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        buyerid: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        unit: {
            type: Sequelize.INTEGER
        }
    });
    Basket.removeAttribute('id');
    return Basket;
};