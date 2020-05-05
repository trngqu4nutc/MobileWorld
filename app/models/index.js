const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.SERVER,
        dialect: dbConfig.dialect,
        operatorsAliases: false,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model")(sequelize, Sequelize);
db.role = require("./role.model")(sequelize, Sequelize);
db.specifications = require("./specifications.model")(sequelize, Sequelize);
db.specificationslaptop = require("./specificationslaptop.model")(sequelize, Sequelize);
db.specificationsmobile = require("./specificationsmobile.model")(sequelize, Sequelize);
db.history = require("./history.model")(sequelize, Sequelize);
db.catalog = require("./catalog.model")(sequelize, Sequelize);
db.catalogtypes = require("./catalogtypes.model")(sequelize, Sequelize);
db.catalogbrands = require("./catalogbrands.model")(sequelize, Sequelize);
db.basket = require("./basket.model")(sequelize, Sequelize);
db.bill = require("./bill.model")(sequelize, Sequelize);

//one to one
// db.user.hasOne(db.userdetail, {
//     foreignKey: {
//       name: 'userid',
//       allowNull: false
//     }
// });

// db.userdetail.belongsTo(db.user, {
//     foreignKey: {
//       name: 'userid',
//       allowNull: false
//     }
// });

//may to many
db.role.belongsToMany(db.user, {
    through: "UserRoles",
    foreignKey: "roleid",
    otherKey: "userid"
});

db.user.belongsToMany(db.role, {
    through: "UserRoles",
    foreignKey: "userid",
    otherKey: "roleid"
});

//one to many
db.catalogtypes.hasMany(db.catalog, { foreignKey: { name: 'catalogtypeid', allowNull: false }, sourceKey: 'id' });
db.catalog.belongsTo(db.catalogtypes, { foreignKey: { name: 'catalogtypeid', allowNull: false }, targetKey: 'id' });

db.catalogbrands.hasMany(db.catalog, { foreignKey: { name: 'catalogbrandid', allowNull: false }, sourceKey: 'id' });
db.catalog.belongsTo(db.catalogbrands, { foreignKey: { name: 'catalogbrandid', allowNull: false }, targetKey: 'id' });

db.catalog.hasMany(db.specifications, { foreignKey: { name: 'catalogid', allowNull: false }, sourceKey: 'id' });
db.specifications.belongsTo(db.catalog, { foreignKey: { name: 'catalogid', allowNull: false }, targetKey: 'id' });

db.catalog.hasMany(db.specificationslaptop, { foreignKey: { name: 'catalogid', allowNull: false }, sourceKey: 'id' });
db.specificationslaptop.belongsTo(db.catalog, { foreignKey: { name: 'catalogid', allowNull: false }, targetKey: 'id' });

db.catalog.hasMany(db.specificationsmobile, { foreignKey: { name: 'catalogid', allowNull: false }, sourceKey: 'id' });
db.specificationsmobile.belongsTo(db.catalog, { foreignKey: { name: 'catalogid', allowNull: false }, targetKey: 'id' });

db.catalog.hasMany(db.history, { foreignKey: { name: 'catalogid', allowNull: false }, sourceKey: 'id' });
db.history.belongsTo(db.catalog, { foreignKey: { name: 'catalogid', allowNull: false }, targetKey: 'id' });

db.user.hasMany(db.basket, { foreignKey: { name: 'userid', allowNull: false } });
db.basket.belongsTo(db.user, { foreignKey: { name: 'userid', allowNull: false } });

db.catalog.hasMany(db.basket, { foreignKey: { name: 'catalogid', allowNull: false } });
db.basket.belongsTo(db.catalog, { foreignKey: { name: 'catalogid', allowNull: false } });

db.user.hasMany(db.bill, { foreignKey: { name: 'userid', allowNull: false } });
db.bill.belongsTo(db.user, { foreignKey: { name: 'userid', allowNull: false } });

db.ROLES = ["user", "admin"];

module.exports = db;