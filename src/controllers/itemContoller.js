const { items, users } = require('../models');

const getAllItems = async (req, res, next) => {
  const allItems = await items.findAll({
    include: [
      { model: users, as: 'user', attributes: ['firstName', 'lastName'] }
    ]
  });
  if (allItems.length > 0) {
    return res.status(200).json({
      status: true,
      data: allItems
    });
  }
  return res.status(404).json({
    status: false,
    message: 'No items found'
  });
};

const getItemById = async (req, res, next) => {
  const id = req.params.id;
  const oneItem = await items.findByPk(id, {
    include: [
      { model: users, as: 'user', attributes: ['firstName', 'lastName'] }
    ]
  });
  if (oneItem) {
    return res.status(200).json({
      status: true,
      data: oneItem
    });
  }

  return res.status(404).json({
    status: false,
    message: 'Item not found'
  });
};

const createItem = async (req, res, next) => {
  const insert = await items.create(req.body);
  if (insert) {
    return res.status(201).json({
      status: true,
      message: 'Item created successfully',
      data: insert
    });
  }

  return res.status(400).json({
    status: false,
    message: 'Item not created'
  });
};

const updateItem = async (req, res, next) => {
  const findItem = await items.findByPk(req.params.id);
  if (findItem) {
    const update = await findItem.update(req.body);
    if (update) {
      return res.status(200).json({
        status: true,
        message: 'Item updated successfully',
        data: req.body
      });
    }
    return res.status(4040).json({
      status: false,
      message: 'Item updated failed'
    });
  }

  return res.status(404).json({
    status: false,
    message: 'Item not found'
  });
};

const deleteItem = async (req, res, next) => {
  const findItem = await items.findByPk(req.params.id);
  if (findItem) {
    const remove = await findItem.destroy();
    if (remove) {
      return res.status(200).json({
        status: true,
        message: 'Item deleted successfully'
      });
    }
    return res.status(404).json({
      status: false,
      message: 'Item not deleted'
    });
  }

  return res.status(404).json({
    status: false,
    message: 'Item not found'
  });
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};
