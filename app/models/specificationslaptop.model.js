module.exports = (sequelize, Sequelize) => {
    const SpecificationsLaptop = sequelize.define("SpecificationsLaptop", {
        cardscreen: {
            type: Sequelize.STRING(100)
        },
        connector: {
            type: Sequelize.STRING(100)
        },
        harddrive: {
            type: Sequelize.STRING(100)
        },
        design: {
            type: Sequelize.STRING(100)
        },
        size: {
            type: Sequelize.STRING(100)
        },
        release: {
            type: Sequelize.STRING(100)
        }
    });
    return SpecificationsLaptop;
};