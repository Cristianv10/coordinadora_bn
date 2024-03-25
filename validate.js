const Joi = require('joi');

const accountSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(3).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

const eventSchema = Joi.object({
  name: Joi.string().min(3).required(),
  date: Joi.date().required(),
  city: Joi.string().min(3).required(),
  participants: Joi.number().integer().min(1).required(),
});

module.exports.validateAccount = function(account) {
  return accountSchema.validate(account);
};

module.exports.validateEvent = function(event) {
  return eventSchema.validate(event);
};