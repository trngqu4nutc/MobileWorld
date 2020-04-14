module.exports = (sequelize, Sequelize) => {
    const SpecificationsMobile = sequelize.define("SpecificationsMobile", {
        backcamera: {
            type: Sequelize.STRING(100)
        },
        frontcamera: {
            type: Sequelize.STRING(100)
        },
        internalmemory: {
            type: Sequelize.STRING(100)
        },
        memorystick: {
            type: Sequelize.STRING(100)
        },
        sim: {
            type: Sequelize.STRING(100)
        },
        batery: {
            type: Sequelize.STRING(100)
        }
    });
    return SpecificationsMobile;
};