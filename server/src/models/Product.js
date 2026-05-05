import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    category: { type: String },
    unit: { type: String },
    quantity: { type: Number, default: 0 },
    threshold: { type: Number, default: 0 },
    expiry: { type: Date },
    costPrice: { type: Number, default: 0 },
    sellPrice: { type: Number, default: 0 },
    supplier: { type: String },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;

