import * as Hapi from "hapi";
import * as Joi from "joi";
import OrderController from "./order-controller";
import * as OrderValidator from "./order-validator";
import { jwtValidator } from "../users/user-validator";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";

export default function (
  server: Hapi.Server,
  configs: IServerConfigurations,
  database: IDatabase
) {
  const orderController = new OrderController(configs, database);
  server.bind(orderController);

  server.route({
    method: "GET",
    path: "/orders/{id}",
    options: {
      handler: orderController.getOrderById,
      auth: "jwt",
      tags: ["api", "orders"],
      description: "Get order by id.",
      validate: {
        params: {
          id: Joi.string().required()
        },
        headers: jwtValidator
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "200": {
              description: "Order founded."
            },
            "404": {
              description: "Order does not exists."
            }
          }
        }
      }
    }
  });

  server.route({
    method: "GET",
    path: "/orders",
    options: {
      handler: orderController.getOrders,
      auth: "jwt",
      tags: ["api", "orders"],
      description: "Get all orders.",
      validate: {
        query: {
          top: Joi.number().default(5),
          skip: Joi.number().default(0)
        },
        headers: jwtValidator
      }
    }
  });

  server.route({
    method: "DELETE",
    path: "/orders/{id}",
    options: {
      handler: orderController.deleteOrder,
      auth: "jwt",
      tags: ["api", "orders"],
      description: "Delete order by id.",
      validate: {
        params: {
          id: Joi.string().required()
        },
        headers: jwtValidator
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "200": {
              description: "Deleted Order."
            },
            "404": {
              description: "Order does not exists."
            }
          }
        }
      }
    }
  });

  server.route({
    method: "PUT",
    path: "/orders/{id}",
    options: {
      handler: orderController.updateOrder,
      auth: "jwt",
      tags: ["api", "orders"],
      description: "Update order by id.",
      validate: {
        params: {
          id: Joi.string().required()
        },
        payload: OrderValidator.updateOrderModel,
        headers: jwtValidator
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "200": {
              description: "Deleted Order."
            },
            "404": {
              description: "Order does not exists."
            }
          }
        }
      }
    }
  });

  server.route({
    method: "POST",
    path: "/orders",
    options: {
      handler: orderController.createOrder,
      auth: "jwt",
      tags: ["api", "orders"],
      description: "Create a order.",
      validate: {
        payload: OrderValidator.createOrderModel,
        headers: jwtValidator
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "201": {
              description: "Created Order."
            }
          }
        }
      }
    }
  });
}
