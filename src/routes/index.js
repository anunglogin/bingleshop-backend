const express = require('express');
const app = express();
const auth = require('./auth');

app.group('/api/v1/', (router) => {
  router.use('/auth', auth);
});

module.exports = app;
