'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../database/config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// begin association for users and items
db.items.belongsTo(db.users, {
  foreignKey: 'userId',
  as: 'user'
});

db.users.hasMany(db.items, {
  foreignKey: 'userId',
  as: 'itemsUsers'
});
// end association for users and items

// begin association for users and orders
db.orders.belongsTo(db.users, {
  foreignKey: 'userId',
  as: 'order'
});

db.users.hasMany(db.orders, {
  foreignKey: 'userId',
  as: 'ordersUsers'
});
// end association for users and orders

//begin association for orders and order items
db.orderItems.belongsTo(db.orders, {
  foreignKey: 'orderId',
  as: 'orderItem'
});
db.orders.hasMany(db.orderItems, {
  foreignKey: 'orderId',
  as: 'orderOrdersItems'
});
//end association for orders and order items

//begin association for order items and items
db.orderItems.belongsTo(db.items, {
  foreignKey: 'itemId',
  as: 'orderItems'
});
db.items.hasMany(db.orderItems, {
  foreignKey: 'itemId',
  as: 'itemOrdersItems'
});
//end association for order items and items

module.exports = db;
