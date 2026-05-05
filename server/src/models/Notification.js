import mongoose from 'mongoose'
const NotificationSchema = new mongoose.Schema({
  message: String,
  type: { type: String, enum: ['low_stock','expiry','reorder','ai'] },
  read: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })
export default mongoose.model('Notification', NotificationSchema)
