module.exports = (sequelize, Sequelize) => {
    const CatalogBrands = sequelize.define("CatalogBrands", {
        brand: {
            type: Sequelize.STRING(100)
        },
        prictureurl: {
            type: Sequelize.STRING(100)
        }
    });
    return CatalogBrands;
};