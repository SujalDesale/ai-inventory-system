import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  password: { type: String, required: true },
  role: { type: String, enum: ['owner','staff','family'], default: 'owner' },
  type: { type: String, enum: ['store','family'], default: 'store' },
  organization: String
}, { timestamps: true })

export default mongoose.model('User', UserSchema)
