module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define("Notification", {
        billid: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        userid: {
            type: Sequelize.INTEGER
        },
        title: {
            type: Sequelize.STRING
        },
        content: {
            type: Sequelize.TEXT
        },
        status: {
            type: Sequelize.INTEGER
        }
    });
    Notification.removeAttribute('id');
    return Notification;
};