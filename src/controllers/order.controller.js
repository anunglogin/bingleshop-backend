const { orders, order_items, items } = require('../models');
const { sequelize } = require('../models');

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
    const { ...createOrder } = req.body;

    const itemResult = [];
    let orderAmount = 0;
    for (const result of req.body.detailItem) {
      const { itemId, itemQuantity } = result;
      const findItem = await items.findByPk(itemId);
      if (findItem) {
        const itemData = {
          itemId: itemId,
          itemQuantity: itemQuantity,
          itemPrice: findItem.price * itemQuantity,
        };
        itemResult.push(itemData);
        orderAmount += findItem.price * itemQuantity;
      }
    }

    await sequelize.transaction(async (t) => {
      insertOrder = await orders.create(
        {
          ...createOrder,
          userId: req.userId,
          orderAmount: orderAmount,
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
            itemId: item.itemId,
            quantity: item.itemQuantity,
            price: item.itemPrice,
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
      if (findOrder.userId !== req.userId) {
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

const updateOrderItem = async (req, res, next) => {
  try {
    const findOrder = await order_items.findByPk(req.params.id, {
      attributes: ['id', 'orderId', 'itemId', 'quantity', 'price'],
      include: [
        {
          model: orders,
          as: 'orderItem',
          required: true,
          attributes: ['id', 'userId'],
        },
        {
          model: items,
          as: 'itemDetail',
          required: true,
          attributes: ['price'],
        },
      ],
    });

    if (findOrder) {
      if (findOrder.orderItem.userId !== req.userId) {
        throw {
          code: 401,
          message: 'You are not authorized to update this order',
        };
      }
      const price = findOrder.itemDetail.price * req.body.itemQuantity;

      const { ...updateOrderItem } = req.body;
      const update = await findOrder.update({
        ...updateOrderItem,
        price: price,
      });
      if (update) {
        const summaryAmount = await order_items.findAll({
          attributes: [
            [sequelize.fn('sum', sequelize.col('price')), 'totalAmount'],
          ],
          where: {
            orderId: findOrder.orderId,
          },
        });

        orders.update(
          {
            orderAmount: summaryAmount[0].dataValues.totalAmount,
          },
          {
            where: {
              id: findOrder.orderId,
            },
          }
        );

        return res.status(200).json({
          status: true,
          message: 'Order item updated successfully',
          data: req.body,
        });
      }
      return res.status(400).json({
        status: false,
        message: 'Order item not updated',
      });
    }
    return res.status(404).json({
      status: false,
      message: 'Order item not found',
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
  updateOrderItem,
  deleteOrder,
};
