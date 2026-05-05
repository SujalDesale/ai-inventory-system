import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Product from '../models/Product.js'

async function run(){
  await mongoose.connect(process.env.MONGO_URI)
  const pass = await bcrypt.hash('password', 10)
  const user = await User.create({ name:'Demo Owner', email:'owner@example.com', password:pass, role:'owner', type:'store', organization:'Demo Mart' })
  await Product.insertMany([
    { name:'Milk', category:'Dairy', unit:'packet', quantity:20, costPrice:20, sellPrice:25, threshold:5, owner:user._id },
    { name:'Bread', category:'Bakery', unit:'loaf', quantity:15, costPrice:30, sellPrice:40, threshold:3, owner:user._id }
  ])
  console.log('Seeded: owner@example.com / password')
  await mongoose.disconnect()
}
run().catch(e=>{ console.error(e); process.exit(1) })
