module.exports = (sequelize, Sequelize) => {
    const CatalogTypes = sequelize.define("CatalogTypes", {
        type: {
            type: Sequelize.STRING(100)
        }
    });
    return CatalogTypes;
};