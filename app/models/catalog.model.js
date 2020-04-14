module.exports = (sequelize, Sequelize) => {
    const Catalog = sequelize.define("Catalog", {
        name: {
            type: Sequelize.STRING
        },
        pictureuri: {
            type: Sequelize.STRING
        },
        price: {
            type: Sequelize.DECIMAL(18, 2)
        },
        description: {
            type: Sequelize.TEXT
        },
        content: {
            type: Sequelize.TEXT
        },
        quantity: {
            type: Sequelize.INTEGER
        },
        metatitle: {
            type: Sequelize.STRING(50)
        }
    });
    return Catalog;
};