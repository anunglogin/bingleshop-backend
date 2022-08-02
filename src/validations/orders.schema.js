const Joi = require('joi');

const createOrder = Joi.object({
  orderNo: Joi.string().required(),
  orderAddress: Joi.string().required(),
  detailItem: Joi.array().items(
    Joi.object({
      itemId: Joi.string().required(),
      itemQuantity: Joi.string().required(),
    })
  ),
});

module.exports = createOrder;
