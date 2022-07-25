const express = require('express');
const app = express();
const auth = require('./auth');
const items = require('./items');

app.group('/api/v1/', (router) => {
  router.use('/auth', auth);
  router.use('/items', items);
});

module.exports = app;
