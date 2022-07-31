module.exports = (sequelize, DataTypes) => {
  const OrderItems = sequelize.define(
    'order_items',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      itemId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'items',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: 'order_items',
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return OrderItems;
};
