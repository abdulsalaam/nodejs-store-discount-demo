/* @abdul : 28-09-2018 */
import * as Mongoose from "mongoose";

export interface IOrder extends Mongoose.Document {
  userId: string;
  product: string;
  amount:number;
  discount:number;
  netAmount:number;
  description: string;
  completed: boolean;
  createdAt: Date;
  updateAt: Date;
}

export const OrderSchema = new Mongoose.Schema(
  {
    userId: { type: String, required: true },
    product: { type: String, required: true },
    amount: { type: Number, required: true },
    discount: { type: Number, required: false },
    netAmount: { type: Number, required: false },
    description: String,
    completed: Boolean
  },
  {
    timestamps: true
  }
);

export const OrderModel = Mongoose.model<IOrder>("Order", OrderSchema);
