const express = require('express');
const app = express();
const auth = require('./auth');
const items = require('./items');
const orders = require('./orders');

app.group('/api/v1/', (router) => {
  router.use('/auth', auth);
  router.use('/items', items);
  router.use('/orders', orders);
});

module.exports = app;
