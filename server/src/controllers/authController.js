import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

function sign(user) {
  return jwt.sign({ id:user._id, email:user.email, role:user.role }, process.env.JWT_SECRET, { expiresIn:'7d' })
}

export async function register(req,res){
  const { name, email, phone, password, role='owner', type='store', organization='' } = req.body
  const exists = await User.findOne({ email })
  if (exists) return res.status(400).json({ message:'Email already in use' })
  const hashed = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, phone, password: hashed, role, type, organization })
  const token = sign(user)
  res.json({ token, user: { id:user._id, name, email, role, type } })
}

export async function login(req,res){
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ message:'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(400).json({ message:'Invalid credentials' })
  const token = sign(user)
  res.json({ token, user: { id:user._id, name:user.name, email, role:user.role, type:user.type } })
}
