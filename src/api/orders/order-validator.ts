/* @abdul : 28-09-2018 */
import * as Joi from "joi";

export const createOrderModel = Joi.object().keys({
  product: Joi.string().required(),
  amount: Joi.number().required(),
  description: Joi.string().required()
});

export const updateOrderModel = Joi.object().keys({
  product: Joi.string().required(),
  amount: Joi.number().required(),
  description: Joi.string().required(),
  completed: Joi.boolean()
});
