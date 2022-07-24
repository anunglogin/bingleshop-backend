require('dotenv').config();
require('express-group-routes');

const express = require('express');
const routes = require('./routes');
const app = express();
const port = process.env.NODE_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/**
 * @description - error handler for the application.
 */
app.use((req, res, next) => {
  return res.status(404).json({
    message: 'API Not Found'
  });
});

app.use((err, req, res, next) => {
  return res.status(err.code || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
