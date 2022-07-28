module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define(
    'orders',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      orderNo: {
        type: DataTypes.STRING,
        allowNull: false
      },
      orderAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      orderAddress: {
        type: DataTypes.STRING,
        allowNull: false
      },
      orderStatus: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: 'orders',
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    }
  );

  return Orders;
};
