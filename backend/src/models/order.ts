import mongoose, { Document, Types } from "mongoose";

export enum StatusType {
  Pending = "pending",
  Delivering = "delivering",
  Completed = "completed",
  Cancelled = "cancelled",
}

export interface IOrder extends Document {
  orderNumber: number;
  status: StatusType;
  totalAmount: number;

  products: Types.ObjectId[];
  customer: Types.ObjectId;

  payment: string;
  phone: string;
  email: string;
  comment: string;
  deliveryAddress: string;

  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    orderNumber: {
      type: Number,
      unique: true,
    },

    status: {
      type: String,
      enum: Object.values(StatusType),
      default: StatusType.Pending,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
    ],

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    payment: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    email: {
      type: String,
    },

    comment: {
      type: String,
      default: "",
    },

    deliveryAddress: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

orderSchema.pre("save", async function generateOrderNumber(next) {
  if (!this.orderNumber) {
    const lastOrder = await Order.findOne().sort({ orderNumber: -1 });

    this.orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;
  }

  next();
});

const Order = mongoose.model<IOrder>("order", orderSchema);

export default Order;
