const logger = require('./logger');

const notFound = (req, res, next) => {
  logger('error').error(`${req.method} ${req.originalUrl}`);
  return res.status(404).json({
    message: 'API Not Found'
  });
};

const error = (err, req, res, next) => {
  logger('error').error(err.message);
  return res.status(err.code || 500).json({
    message: err.message || 'Internal Server Error'
  });
};

module.exports = {
  notFound,
  error
};
