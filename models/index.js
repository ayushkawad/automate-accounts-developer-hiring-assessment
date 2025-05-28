
const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database/receipts.db'),
  logging: false,
});

const ReceiptFile = require('./receiptFile')(sequelize);
const Receipt = require('./receipt')(sequelize);


module.exports = {
  sequelize,
  ReceiptFile,
  Receipt,
};
