import * as Hapi from "hapi";
import * as Boom from "boom";
import { IOrder } from "./order";
import { IUser } from "../users/user";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import { IRequest } from "../../interfaces/request";
import { ILogging } from "../../plugins/logging/logging";
import * as moment from 'moment';
/* @abdul : 28-09-2018 8:29PM */
//Custom helper module
import * as Helper from "../../utils/helper";

export default class OrderController {
  private database: IDatabase;
  private configs: IServerConfigurations;
  private EMPLOYEE_DISCOUNT = 30;
  private AFFILIATE_DISCOUNT = 10;
  private CUSTOMER__2YEAR_DISCOUNT = 5;
  private EXTRA_DISCOUNT = 5;

  constructor(configs: IServerConfigurations, database: IDatabase) {
	this.configs = configs;
	this.database = database;
  }

  private generateDiscount(user: IUser, amount: number) {
	let years = moment().diff(user.createdAt, 'years', false);
	let discount = 0;
    if (user.userType === 'employee') {
    discount = (this.EMPLOYEE_DISCOUNT / 100 * amount);
    } else if (user.userType === 'affiliate') {
    discount = (this.AFFILIATE_DISCOUNT / 100 * amount);
    } else if (user.userType === 'customer' && years >= 2) {
    discount = (this.AFFILIATE_DISCOUNT / 100 * amount);
    }
	let extraDiscount = Math.trunc(amount / 100) * 5 ;
	return (discount + extraDiscount);
  }

  public async createOrder(request: IRequest, h: Hapi.ResponseToolkit) {
	var newOrder: IOrder = <IOrder>request.payload;
	newOrder.userId = request.auth.credentials.id;
	try {
	  const id = request.auth.credentials.id;
	  let user: IUser = await this.database.userModel.findById(id);
	  newOrder.discount = await this.generateDiscount(user, newOrder.amount);
	  newOrder.netAmount = newOrder.amount - newOrder.discount;
	  let order: IOrder = await this.database.orderModel.create(newOrder);
	  return h.response(order).code(201);
	} catch (error) {
	  return Boom.badImplementation(error);
	}
  }

  public async updateOrder(request: IRequest, h: Hapi.ResponseToolkit) {
	let userId = request.auth.credentials.id;
	let _id = request.params["id"];

	try {
	  let order: IOrder = await this.database.orderModel.findByIdAndUpdate(
		{ _id, userId }, //ES6 shorthand syntax
		{ $set: request.payload },
		{ new: true }
	  );

	  if (order) {
		return order;
	  } else {
		return Boom.notFound();
	  }
	} catch (error) {
	  return Boom.badImplementation(error);
	}
  }

  public async deleteOrder(request: IRequest, h: Hapi.ResponseToolkit) {
	let id = request.params["id"];
	let userId = request["auth"]["credentials"];

	let deletedOrder = await this.database.orderModel.findOneAndRemove({
	  _id: id,
	  userId: userId
	});

	if (deletedOrder) {
	  return deletedOrder;
	} else {
	  return Boom.notFound();
	}
  }

  public async getOrderById(request: IRequest, h: Hapi.ResponseToolkit) {
	let userId = request.auth.credentials.id;
	let _id = request.params["id"];

	let order = await this.database.orderModel.findOne({ _id, userId })
	  .lean(true);

	if (order) {
	  return order;
	} else {
	  return Boom.notFound();
	}
  }

  public async getOrders(request: IRequest, h: Hapi.ResponseToolkit) {
	let userId = request.auth.credentials.id;
	let top = request.query["top"];
	let skip = request.query["skip"];
	let orders = await this.database.orderModel
	  .find({ userId: userId })
	  .lean(true)
	  .skip(skip)
	  .limit(top);

	return orders;
  }
}
