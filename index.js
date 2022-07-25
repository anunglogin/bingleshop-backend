require('dotenv').config();
require('express-group-routes');

const express = require('express');
const routes = require('./routes');
const { notFound, error } = require('./middlewares/errorHandling');
const logger = require('./middlewares/logger');
const app = express();
const port = process.env.NODE_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.use('*', notFound);
app.use(error);

app.listen(port, () => {
  logger('listen').info(`Server is running on port ${port}`);
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
