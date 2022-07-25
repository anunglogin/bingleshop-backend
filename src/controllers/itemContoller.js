const getAllItems = (req, res, next) => {
  return res.status(200).json({
    message: 'Get all items'
  });
};

module.exports = {
  getAllItems
};
