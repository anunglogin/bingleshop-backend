const { orders, order_items, items } = require('../models');
const { sequelize } = require('../models/');

const getAllOrders = async (req, res, next) => {
  const allOrders = await orders.findAll({
    attributes: ['id', 'orderNo', 'orderAmount', 'orderAddress', 'orderStatus'],
    include: [
      {
        model: order_items,
        as: 'orderItems',
        attributes: ['id', 'itemId', 'quantity', 'price'],
        include: [
          {
            model: items,
            as: 'itemDetail',
            attributes: ['name', 'description'],
          },
        ],
      },
    ],
  });
  if (allOrders.length > 0) {
    return res.status(200).json({
      status: true,
      data: allOrders,
    });
  }
  return res.status(404).json({
    status: false,
    message: 'No orders found',
  });
};

const getOrderById = async (req, res, next) => {
  const id = req.params.id;
  const oneOrder = await orders.findByPk(id, {
    attributes: ['id', 'orderNo', 'orderAmount', 'orderAddress', 'orderStatus'],
    include: [
      {
        model: order_items,
        as: 'orderItems',
        attributes: ['id', 'itemId', 'quantity', 'price'],
        include: [
          {
            model: items,
            as: 'itemDetail',
            attributes: ['name', 'description'],
          },
        ],
      },
    ],
  });

  if (oneOrder) {
    return res.status(200).json({
      status: true,
      data: oneOrder,
    });
  }
  return res.status(404).json({
    status: false,
    message: 'Order not found',
  });
};

const createOrder = async (req, res, next) => {
  try {
    const { user_id, order_no, order_address, detail_items } = req.body;

    const itemResult = [];
    let order_amount = 0;
    for (const result of detail_items) {
      const { item_id, item_quantity } = result;
      const findItem = await items.findByPk(item_id);
      if (findItem) {
        const itemData = {
          item_id: item_id,
          item_quantity: item_quantity,
          item_price: findItem.price * item_quantity,
        };
        itemResult.push(itemData);
        order_amount += findItem.price * item_quantity;
      }
    }

    await sequelize.transaction(async (t) => {
      insertOrder = await orders.create(
        {
          userId: user_id,
          orderNo: order_no,
          orderAmount: order_amount,
          orderAddress: order_address,
          orderStatus: 'pending',
        },
        {
          transaction: t,
        }
      );

      await order_items.bulkCreate(
        itemResult.map((item) => {
          return {
            orderId: insertOrder.id,
            itemId: item.item_id,
            quantity: item.item_quantity,
            price: item.item_price,
          };
        }),
        {
          transaction: t,
        }
      );
    });

    return res.status(201).json({
      status: true,
      message: 'Order created successfully',
    });
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const findOrder = await orders.findByPk(req.params.id);
    if (findOrder) {
      let updateOrder = false;
      if (findOrder.userId !== req.body.userId) {
        throw {
          code: 401,
          message: 'You are not authorized to update this order',
        };
      }

      await sequelize.transaction(async (t) => {
        updateOrder = await findOrder.update(req.body, {
          transaction: t,
        });
      });

      if (updateOrder) {
        return res.status(200).json({
          status: true,
          message: 'Order has updated successfully',
          data: req.body,
        });
      }

      return res.status(400).json({
        status: false,
        message: 'Order not updated',
      });
    }
    return res.status(404).json({
      status: false,
      message: 'Order not found',
    });
  } catch (error) {
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  const findOrder = await orders.findByPk(req.params.id);
  if (findOrder) {
    const remove = await findOrder.destroy();
    if (remove) {
      return res.status(200).json({
        status: true,
        message: 'Order deleted successfully',
      });
    }
  }
  return res.status(404).json({
    status: false,
    message: 'Order not found',
  });
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
