const Joi = require('joi');

const itemCreate = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  sku: Joi.string().required(),
  price: Joi.number().required(),
});

module.exports = itemCreate;
