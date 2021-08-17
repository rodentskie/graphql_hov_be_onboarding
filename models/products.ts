import { Schema, model } from "mongoose";

interface Product {
  id: Buffer;
  name: string;
  description: string;
  owner: Buffer;
  cursor: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<Product>(
  {
    id: { type: Buffer, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    owner: { type: Buffer, required: true },
    cursor: {
      type: Buffer,
      index: true,
    },
    createdAt: Date,
    updatedAt: Date,
  },
  {
    timestamps: true,
  }
);

const ProductModel = model<Product>("Product", schema);

export default ProductModel;
