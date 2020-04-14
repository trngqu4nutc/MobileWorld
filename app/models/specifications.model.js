module.exports = (sequelize, Sequelize) => {
    const Specifications = sequelize.define("Specifications", {
        cpu: {
            type: Sequelize.STRING(100)
        },
        ram: {
            type: Sequelize.STRING(100)
        },
        screen: {
            type: Sequelize.STRING(100)
        },
        os: {
            type: Sequelize.STRING(100)
        }
    });
    return Specifications;
};