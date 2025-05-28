require('dotenv').config();
const express = require('express');
const path = require('path');
const receiptRoutes = require('./routes/receiptRoutes');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', receiptRoutes);

app.get('/', (req, res) => {
  res.send('Automate Accounts Receipt API is running!');
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});
