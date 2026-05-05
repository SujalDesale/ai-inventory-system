import mongoose from 'mongoose'
const SaleItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String, qty: Number, price: Number, discount: Number, tax: Number,
})
const SaleSchema = new mongoose.Schema({
  items: [SaleItemSchema],
  total: Number,
  customer: String,
  paymentMethod: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })
export default mongoose.model('Sale', SaleSchema)
