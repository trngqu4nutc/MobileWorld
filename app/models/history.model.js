module.exports = (sequelize, Sequelize) => {
    const History = sequelize.define("History", {
        inputprice: {
            type: Sequelize.DECIMAL(18, 2)
        },
        unit: {
            type: Sequelize.INTEGER
        },
        catalogid: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
    return History;
};