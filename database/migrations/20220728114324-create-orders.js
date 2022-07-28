'use strict';

const uuid = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: uuid.v4(),
        primaryKey: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      orderNo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      orderAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      orderAddress: {
        type: Sequelize.STRING,
        allowNull: false
      },
      orderStatus: {
        type: Sequelize.ENUM,
        values: ['pending', 'processing', 'completed', 'cancelled'],
        defaultValue: 'pending',
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};
