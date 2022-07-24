const notFound = (req, res, next) => {
  return res.status(404).json({
    message: 'API Not Found'
  });
};

const error = (err, req, res, next) => {
  return res.status(err.code || 500).json({
    message: err.message || 'Internal Server Error'
  });
};

module.exports = {
  notFound,
  error
};
