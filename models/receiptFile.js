const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ReceiptFile = sequelize.define('ReceiptFile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_valid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    invalid_reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_processed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: 'receipt_file',
    timestamps: false,
  });
  ReceiptFile.beforeUpdate((instance) => {
    instance.updated_at = new Date();
  });

  return ReceiptFile;
};
