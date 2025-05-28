const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Receipt = sequelize.define('Receipt', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    purchased_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    merchant_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    total_amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'receipt',
    timestamps: false,
  });
  Receipt.beforeUpdate((instance) => {
    instance.updated_at = new Date();
  });

  return Receipt;
};
