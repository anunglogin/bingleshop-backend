const express = require('express');
const app = express();
const auth = require('./auth.routes');
const items = require('./items.routes');
const orders = require('./orders.routes');

app.group('/api/v1/', (router) => {
  router.use('/auth', auth);
  router.use('/items', items);
  router.use('/orders', orders);
});

module.exports = app;
