const Joi = require('joi');

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string(),
  address: Joi.string(),
  phone: Joi.string(),
});

module.exports = signupSchema;
