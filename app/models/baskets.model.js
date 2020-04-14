module.exports = (sequelize, Sequelize) => {
    const Baskets = sequelize.define("Baskets", {
        buyerid: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
    return Baskets;
};